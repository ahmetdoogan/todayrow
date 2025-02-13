import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SubscriptionUser {
  user_id: string;
  trial_end: string;
  email: string | null; // Kolon boş olabilir, o yüzden null olabilir
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  console.log("DEBUG: process.env.CRON_SECRET =", process.env.CRON_SECRET);
  console.log("DEBUG: req.headers.authorization =", req.headers.authorization);

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // API token kontrolü
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // 1) 7 gün içinde bitecek trial kullanıcılarını buluyoruz
    const { data: users, error } = await supabase
      .from('subscriptions')
      .select('user_id, trial_end, email') // <-- Artık 'auth:users!inner(email)' yerine 'email' var
      .eq('status', 'free_trial')
      .gt('trial_end', now.toISOString())
      .lt('trial_end', sevenDaysLater.toISOString());

    if (error) throw error;

    // 2) Her kullanıcı için daysLeft hesapla ve mail gönder
    for (const user of (users as SubscriptionUser[])) {
      if (!user.email) {
        // Eposta boşsa mail gönderemeyiz
        console.log("No email found for user_id:", user.user_id);
        continue;
      }

      const trialEnd = new Date(user.trial_end);
      const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysLeft <= 7 && daysLeft > 1) {
        // 7 günden az, 1 günden fazla kaldı => Trial Warning
        await fetch('https://todayrow.app/api/email/sendTrialWarning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, daysLeft })
        });
      } else if (daysLeft <= 1) {
        // 1 günden az kaldı => Warning (1 gün kaldı)
        await fetch('https://todayrow.app/api/email/sendTrialWarning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, daysLeft: 1 })
        });
      }
    }

    // 3) Trial bitenler (trial_end < now)
    const { data: expiredUsers, error: expiredError } = await supabase
      .from('subscriptions')
      .select('user_id, trial_end, email')
      .eq('status', 'free_trial')
      .lt('trial_end', now.toISOString());

    if (expiredError) throw expiredError;

    for (const user of (expiredUsers as SubscriptionUser[])) {
      if (!user.email) continue; // yine email kontrolü

      await fetch('https://todayrow.app/api/email/sendTrialEnded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });

      // status = expired
      await supabase
        .from('subscriptions')
        .update({ 
          status: 'expired',
          subscription_type: 'free',
          updated_at: now.toISOString()
        })
        .eq('user_id', user.user_id);
    }

    return res.status(200).json({ 
      message: 'Trial checks completed',
      warningsSent: (users as SubscriptionUser[]).length,
      expiredProcessed: (expiredUsers as SubscriptionUser[]).length
    });

  } catch (error) {
    console.error('Trial check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
