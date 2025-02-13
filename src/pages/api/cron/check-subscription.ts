import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// BURADA tip (arayüz) tanımlıyoruz
interface SubscriptionItem {
  user_id: string;
  auth: {
    users: {
      email: string;
    }[];
  };
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
      .gt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Son 24 saat içinde updated
      .eq('subscription_type', 'pro');

    if (newProError) throw newProError;

    // Yeni Pro kullanıcılarına mail gönder
    for (const user of (newProUsers as SubscriptionItem[])) {
      await fetch('https://todayrow.app/api/email/sendProStarted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.auth.users[0].email })
      });
    }

    // 2) Pro üyeliği iptal olanları kontrol et
    const { data: cancelledUsers, error: cancelledError } = await supabase
      .from('subscriptions')
      .select('user_id, auth:users!inner(email)')
      .eq('status', 'cancelled')
      .gt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Son 24 saat
      .eq('subscription_type', 'free');

    if (cancelledError) throw cancelledError;

    // İptal edilen Pro kullanıcılarına mail gönder
    for (const user of (cancelledUsers as SubscriptionItem[])) {
      await fetch('https://todayrow.app/api/email/sendProCancelled', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.auth.users[0].email })
      });
    }

    return res.status(200).json({
      message: 'Subscription checks completed',
      newProEmails: (newProUsers as SubscriptionItem[]).length,
      cancelledEmails: (cancelledUsers as SubscriptionItem[]).length
    });

  } catch (error) {
    console.error('Subscription check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
