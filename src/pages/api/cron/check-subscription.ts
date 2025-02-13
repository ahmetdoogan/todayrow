import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SubscriptionItem {
  user_id: string;
  email: string | null;
  updated_at: string;
  status: string;
  subscription_type: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("DEBUG: process.env.CRON_SECRET =", process.env.CRON_SECRET);
  console.log("DEBUG: req.headers.authorization =", req.headers.authorization);

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Güvenlik kontrolü
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 1) Pro'ya yeni geçenler (son 24 saat)
    const { data: newProUsers, error: newProError } = await supabase
      .from('subscriptions')
      .select('user_id, email, updated_at, status, subscription_type')
      .eq('status', 'pro')
      .eq('subscription_type', 'pro')
      .gt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (newProError) throw newProError;

    for (const user of (newProUsers as SubscriptionItem[])) {
      if (!user.email) {
        console.log("No email for user_id:", user.user_id);
        continue;
      }
      await fetch('https://todayrow.app/api/email/sendProStarted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
    }

    // 2) Pro iptal edenler (son 24 saat)
    const { data: cancelledUsers, error: cancelledError } = await supabase
      .from('subscriptions')
      .select('user_id, email, updated_at, status, subscription_type')
      .eq('status', 'cancelled')
      .eq('subscription_type', 'free')
      .gt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (cancelledError) throw cancelledError;

    for (const user of (cancelledUsers as SubscriptionItem[])) {
      if (!user.email) continue;
      await fetch('https://todayrow.app/api/email/sendProCancelled', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
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
