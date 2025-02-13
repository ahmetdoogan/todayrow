import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 'auth' alanı bir dizi [{ email: string }, ...]
interface SubscriptionItem {
  user_id: string;
  auth: { email: string }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // API token kontrolü
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 1) Pro üyeliği yeni başlayanları kontrol et
    const { data: newProUsers, error: newProError } = await supabase
      .from('subscriptions')
      .select('user_id, auth:users!inner(email)')
      .eq('status', 'pro')
      .gt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Son 24 saat
      .eq('subscription_type', 'pro');

    if (newProError) throw newProError;

    // 2) Pro üyeliği iptal olanları kontrol et
    const { data: cancelledUsers, error: cancelledError } = await supabase
      .from('subscriptions')
      .select('user_id, auth:users!inner(email)')
      .eq('status', 'cancelled')
      .gt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Son 24 saat
      .eq('subscription_type', 'free');

    if (cancelledError) throw cancelledError;

    // 3) Yeni Pro olanlara mail gönder
    for (const user of (newProUsers as SubscriptionItem[])) {
      // 'auth' bir dizi, 0. elemanın email'ine erişiyoruz
      const userEmail = user.auth[0]?.email;
      if (!userEmail) continue; // ihtimale karşı koruyucu

      await fetch('https://todayrow.app/api/email/sendProStarted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });
    }

    // 4) İptal edilen Pro kullanıcılarına mail gönder
    for (const user of (cancelledUsers as SubscriptionItem[])) {
      const userEmail = user.auth[0]?.email;
      if (!userEmail) continue;

      await fetch('https://todayrow.app/api/email/sendProCancelled', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });
    }

    return res.status(200).json({
      message: 'Subscription checks completed',
      // length'e de bu şekilde erişiyoruz
      newProEmails: (newProUsers as SubscriptionItem[]).length,
      cancelledEmails: (cancelledUsers as SubscriptionItem[]).length
    });

  } catch (error) {
    console.error('Subscription check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
