// /pages/api/delete-account.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// .env içinde şu değerlerin tanımlı olduğunu varsayalım
// NEXT_PUBLIC_SUPABASE_URL
// SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // 1) Authorization header'dan token al
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No auth token' });
    }

    const token = authHeader.replace('Bearer ', '');

    // 2) Token'dan kullanıcı bilgisi çek
    const { data: userData, error: getUserError } = await supabaseAdmin.auth.getUser(token);
    if (getUserError || !userData?.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    const user = userData.user; // { id, email, ... }

    // 3) Minimal Log (deleted_users tablosuna e-posta kaydet)
    //    İstemezsen bu kısmı kaldırabilirsin.
    await supabaseAdmin
      .from('deleted_users')
      .insert({ email: user.email });

    // 4) Kullanıcının “public” şemadaki tablolarını (içerikler, planlar vs.) manuel sil:
    //    Tablolarının isimlerini ve kolonlarını burada ayarlıyoruz.

    // Content
    await supabaseAdmin
      .from('Content')
      .delete()
      .eq('user_id', user.id);

    // Notes
    await supabaseAdmin
      .from('Notes')
      .delete()
      .eq('user_id', user.id);

    // Plans
    await supabaseAdmin
      .from('plans')
      .delete()
      .eq('user_id', user.id);

    // Quick_plans
    await supabaseAdmin
      .from('quick_plans')
      .delete()
      .eq('user_id', user.id);

    // Subscriptions
    await supabaseAdmin
      .from('subscriptions')
      .delete()
      .eq('user_id', user.id);

    // Google_calendar_tokens
    await supabaseAdmin
      .from('google_calendar_tokens')
      .delete()
      .eq('user_id', user.id);

    // User_hidden_plans
    await supabaseAdmin
      .from('user_hidden_plans')
      .delete()
      .eq('user_id', user.id);

    // 5) profiles tablosundan sil
    await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', user.id);

    // 6) auth.users tablosundan kullanıcıyı sil
    //    (service role key gerektiğini unutma)
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (deleteUserError) {
      console.error('deleteUserError:', deleteUserError);
      return res.status(500).json({ error: 'User could not be deleted from auth' });
    }

    // 7) Başarılıysa yanıt
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('delete-account error:', err);
    return res.status(500).json({ error: err.message });
  }
}
