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
    //    Sorgu: [Şimdi ... 7 gün sonrası] arasında
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { data: users, error } = await supabase
      .from('subscriptions')
      .select('user_id, trial_end, auth:users!inner(email)')
      .eq('status', 'free_trial')
      .gt('trial_end', now.toISOString())
      .lt('trial_end', sevenDaysLater.toISOString());

    if (error) throw error;

    // 2) Tek tek mail gönder
    for (const user of (users as SubscriptionUser[])) {
      const trialEnd = new Date(user.trial_end);
      const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // 'auth' dizisinin ilk elemanındaki email'e ulaş
      const userEmail = user.auth[0]?.email;
      if (!userEmail) continue; // boşluk koruması

      // 7 günden az ve 1 günden fazla kaldıysa "warning"
      if (daysLeft <= 7 && daysLeft > 1) {
        await fetch('https://todayrow.app/api/email/sendTrialWarning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, daysLeft })
        });
      }
      // 1 gün veya daha az kaldıysa, yine "warning" ama daysLeft: 1
      else if (daysLeft <= 1) {
        await fetch('https://todayrow.app/api/email/sendTrialWarning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, daysLeft: 1 })
        });
      }
    }

    // 3) Trial'ı bitenleri bul (trial_end < now)
    const { data: expiredUsers, error: expiredError } = await supabase
      .from('subscriptions')
      .select('user_id, auth:users!inner(email)')
      .eq('status', 'free_trial')
      .lt('trial_end', now.toISOString());

    if (expiredError) throw expiredError;

    // 4) Bitmiş olanlara "Trial Ended" mail gönder
    for (const user of (expiredUsers as ExpiredUser[])) {
      const userEmail = user.auth[0]?.email;
      if (!userEmail) continue;

      await fetch('https://todayrow.app/api/email/sendTrialEnded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });

      // ve status = expired yap
      await supabase
        .from('subscriptions')
        .update({ 
          status: 'expired',
          subscription_type: 'free',
          updated_at: now.toISOString()
        })
        .eq('user_id', user.user_id);
    }

    // 5) Log info
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
