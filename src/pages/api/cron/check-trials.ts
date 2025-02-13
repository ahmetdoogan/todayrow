import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1) Trial süresi henüz bitmemiş kullanıcılar
interface SubscriptionUser {
  user_id: string;
  trial_end: string;   // bir tarih string'i
  auth: { email: string }[]; // auth bir dizi
}

// 2) Tamamen bitmiş kullanıcılar
interface ExpiredUser {
  user_id: string;
  auth: { email: string }[]; 
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // --- İŞTE BURAYA CONSOLE.LOG EKLEDİK ---
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

    // 1) Bitimine 7 gün veya daha az kalanlar (ama hâlâ geçerli)
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { data: users, error } = await supabase
      .from('subscriptions')
      .select('user_id, trial_end, auth:users!inner(email)')
      .eq('status', 'free_trial')
      .gt('trial_end', now.toISOString())
      .lt('trial_end', sevenDaysLater.toISOString());

    if (error) throw error;

    for (const user of (users as SubscriptionUser[])) {
      const trialEnd = new Date(user.trial_end);
      const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const userEmail = user.auth[0]?.email;
      if (!userEmail) continue;

      if (daysLeft <= 7 && daysLeft > 1) {
        await fetch('https://todayrow.app/api/email/sendTrialWarning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, daysLeft })
        });
      } else if (daysLeft <= 1) {
        await fetch('https://todayrow.app/api/email/sendTrialWarning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, daysLeft: 1 })
        });
      }
    }

    // 2) Trial'ı bitenleri bul (trial_end < now)
    const { data: expiredUsers, error: expiredError } = await supabase
      .from('subscriptions')
      .select('user_id, auth:users!inner(email)')
      .eq('status', 'free_trial')
      .lt('trial_end', now.toISOString());

    if (expiredError) throw expiredError;

    for (const user of (expiredUsers as ExpiredUser[])) {
      const userEmail = user.auth[0]?.email;
      if (!userEmail) continue;

      await fetch('https://todayrow.app/api/email/sendTrialEnded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });

      await supabase
        .from('subscriptions')
        .update({ 
          status: 'expired',
          subscription_type: 'free',
          updated_at: now.toISOString()
        })
        .eq('user_id', user.user_id);
    }

    // 3) Bitti
    return res.status(200).json({ 
      message: 'Trial checks completed',
      warningsSent: (users as SubscriptionUser[]).length,
      expiredProcessed: (expiredUsers as ExpiredUser[]).length
    });

  } catch (error) {
    console.error('Trial check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
