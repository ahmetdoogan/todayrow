import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // API token kontrolü
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Trial bitimine 7 gün ve 1 gün kalan kullanıcıları bul
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const { data: users, error } = await supabase
      .from('subscriptions')
      .select('user_id, trial_end, users!inner(email)')
      .eq('status', 'trial')
      .gt('trial_end', now.toISOString())
      .lt('trial_end', sevenDaysLater.toISOString());

    if (error) throw error;

    // Her kullanıcı için uygun maili gönder
    for (const user of users) {
      const trialEnd = new Date(user.trial_end);
      const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // 7 gün kaldıysa
      if (daysLeft <= 7 && daysLeft > 1) {
        await fetch('http://todayrow.app/api/email/sendTrialWarning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: user.users.email,
            daysLeft: daysLeft 
          })
        });
      }
      // 1 gün kaldıysa
      else if (daysLeft <= 1) {
        await fetch('http://todayrow.app/api/email/sendTrialWarning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: user.users.email,
            daysLeft: 1
          })
        });
      }
    }

    // Trial'ı bitenleri bul ve mail gönder
    const { data: expiredUsers, error: expiredError } = await supabase
      .from('subscriptions')
      .select('user_id, users!inner(email)')
      .eq('status', 'trial')
      .lt('trial_end', now.toISOString());

    if (expiredError) throw expiredError;

    for (const user of expiredUsers) {
      // Trial bitti mail'i gönder
      await fetch('http://todayrow.app/api/email/sendTrialEnded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.users.email })
      });

      // Status'ü güncelle
      await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('user_id', user.user_id);
    }

    return res.status(200).json({ 
      message: 'Trial checks completed',
      warningsSent: users.length,
      expiredProcessed: expiredUsers.length
    });

  } catch (error) {
    console.error('Trial check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}