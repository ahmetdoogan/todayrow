import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface DbUser {
  email: string;
}

interface DbSubscription {
  user_id: string;
  trial_end: string;
  users: DbUser;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // 1) 7 gün içinde bitecek trial kullanıcılarını buluyoruz
    const { data: trialUsers, error } = await supabase
      .from('subscriptions')
      .select(`
        subscriptions.user_id,
        subscriptions.trial_end,
        auth.users (
          email
        )
      `)
      .eq('status', 'free_trial')
      .gt('trial_end', now.toISOString())
      .lt('trial_end', sevenDaysLater.toISOString()) as { data: DbSubscription[] | null, error: any };

    if (error) throw error;

    let warningsSent = 0;
    for (const user of (trialUsers || [])) {
      if (!user.users?.email) {
        console.log("No email found for user_id:", user.user_id);
        continue;
      }

      const trialEnd = new Date(user.trial_end);
      const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysLeft <= 7 && daysLeft > 1) {
        await fetch('https://todayrow.app/api/email/sendTrialWarning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.users.email, daysLeft })
        });
        warningsSent++;
      } else if (daysLeft <= 1) {
        await fetch('https://todayrow.app/api/email/sendTrialWarning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.users.email, daysLeft: 1 })
        });
        warningsSent++;
      }
    }

    // 2) Trial bitenler (trial_end < now)
    const { data: expiredData, error: expiredError } = await supabase
      .from('subscriptions')
      .select(`
        subscriptions.user_id,
        subscriptions.trial_end,
        auth.users (
          email
        )
      `)
      .eq('status', 'free_trial')
      .lt('trial_end', now.toISOString()) as { data: DbSubscription[] | null, error: any };

    if (expiredError) throw expiredError;

    let expiredProcessed = 0;
    for (const user of (expiredData || [])) {
      if (!user.users?.email) continue;

      await fetch('https://todayrow.app/api/email/sendTrialEnded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.users.email })
      });

      await supabase
        .from('subscriptions')
        .update({ 
          status: 'expired',
          subscription_type: 'free',
          updated_at: now.toISOString()
        })
        .eq('user_id', user.user_id);
      
      expiredProcessed++;
    }

    await supabase
      .from('cron_logs')
      .insert({
        job_name: 'check-trials',
        execution_time: new Date().toISOString(),
        details: {
          warningsSent,
          expiredProcessed
        }
      });

    return res.status(200).json({ 
      message: 'Trial checks completed',
      warningsSent,
      expiredProcessed
    });

  } catch (error) {
    console.error('Trial check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}