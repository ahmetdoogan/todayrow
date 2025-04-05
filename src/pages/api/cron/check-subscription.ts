// src/pages/api/cron/check-subscription.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface SubscriptionRecord {
  user_id: string;
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
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { data: newProUsers, error: newProError } = await supabase
      .from('subscriptions')
      .select('user_id, updated_at, status, subscription_type')
      .eq('status', 'pro')
      .in('subscription_type', ['monthly', 'yearly'])
      .gt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (newProError) throw newProError;

    let newProEmailsSent = 0;

    for (const sub of (newProUsers as SubscriptionRecord[])) {
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', sub.user_id)
        .maybeSingle();

      if (profileErr) {
        console.error("Error fetching profile (pro started):", profileErr);
        continue;
      }
      if (!profileData?.email) {
        console.log('No email found for user_id (pro):', sub.user_id);
        continue;
      }

      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://todayrow.app'}/api/email/sendProStarted`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profileData.email })
      });
      newProEmailsSent++;
    }

    const { data: cancelledUsers, error: userCancelledError } = await supabase
      .from('subscriptions')
      .select('user_id, updated_at, status, subscription_type')
      .eq('status', 'cancelled')
      .eq('subscription_type', 'free')
      .gt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (userCancelledError) throw userCancelledError;

    let cancelledEmailsSent = 0;

    for (const sub of (cancelledUsers as SubscriptionRecord[])) {
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', sub.user_id)
        .maybeSingle();

      if (profileErr) {
        console.error("Error fetching profile (cancelled):", profileErr);
        continue;
      }
      if (!profileData?.email) {
        console.log('No email found for user_id (cancelled):', sub.user_id);
        continue;
      }

      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://todayrow.app'}/api/email/sendProCancelled`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profileData.email })
      });
      cancelledEmailsSent++;
    }

    // 1) Cancel_scheduled durumundaki abonelikler süresi dolunca cancelled'a çevrilir
    const { data: cancelledSubscriptions, error: cancelledError } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', subscription_type: 'free', updated_at: new Date().toISOString() })
      .eq('status', 'cancel_scheduled')
      .lte('subscription_end', new Date().toISOString())
      .select('user_id');
      
    console.log(`${cancelledSubscriptions?.length || 0} subscriptions changed from cancel_scheduled to cancelled`);

    if (cancelledError) throw cancelledError;

    let cancelledCount = cancelledSubscriptions ? cancelledSubscriptions.length : 0;

    // 2) Süresi dolan pro abonelikler için 1 günlük grace period sonunda expired yapma
    // NOT: 1 gün geçmişse ödeme hala yapılmamış demektir
    // ANCAK: polar_sub_id değeri olan kullanıcılar için bu kontrol yapılmamalı
    // Çünkü Polar aboneliği aktif olabilir ancak webhook henüz gelmemiş olabilir
    const gracePeriod = new Date();
    gracePeriod.setDate(gracePeriod.getDate() - 1); // 1 gün öncesi

    const { data: expiredProSubscriptions, error: expiredProError } = await supabase
      .from('subscriptions')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('status', 'pro')
      .lt('subscription_end', gracePeriod.toISOString())
      // Polar entegrasyonu olan kullanıcıları bu güncellemenin dışında bırak
      .is('polar_sub_id', null) 
      .select('user_id, subscription_end');

    if (expiredProError) throw expiredProError;

    console.log(`${expiredProSubscriptions?.length || 0} pro subscriptions changed to expired (payment grace period ended)`);

    // 3) Süresi dolan pro abonelikler için expiry email gönderme
    let expiredProEmailsSent = 0;
    
    for (const sub of (expiredProSubscriptions || [])) {
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', sub.user_id)
        .maybeSingle();

      if (profileErr || !profileData?.email) {
        console.error("Error fetching profile for expired pro:", profileErr || "No email found");
        continue;
      }

      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://todayrow.app'}/api/email/sendSubscriptionExpired`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profileData.email })
      }).catch(console.error);
      
      expiredProEmailsSent++;
    }

    // 4) Polar entegrasyonu olan ve "expired" statüsünde kalan kullanıcıları tekrar "pro" yap
    const { data: reactivatedUsers, error: reactivationError } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'pro', 
        updated_at: new Date().toISOString()
      })
      .eq('status', 'expired')
      .not('polar_sub_id', 'is', null)
      .select('user_id');

    if (reactivationError) throw reactivationError;

    console.log(`${reactivatedUsers?.length || 0} expired polar users reactivated to pro`);

    // 5) Polar entegrasyonu olan kullanıcıların subscription_end tarihi geçmiş ise güncelle
    const { data: updatedEndDates, error: updateEndError } = await supabase
      .from('subscriptions')
      .update({ 
        subscription_end: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        updated_at: new Date().toISOString()
      })
      .eq('status', 'pro')
      .not('polar_sub_id', 'is', null)
      .lt('subscription_end', new Date().toISOString())
      .select('user_id');
      
    if (updateEndError) throw updateEndError;
    
    console.log(`${updatedEndDates?.length || 0} pro users with outdated subscription_end updated`);

    return res.status(200).json({
      message: 'Subscription checks completed',
      newProEmails: newProEmailsSent,
      cancelledEmails: cancelledEmailsSent,
      cancelledSubscriptions: cancelledCount,
      expiredProSubscriptions: expiredProSubscriptions?.length || 0,
      expiredProEmails: expiredProEmailsSent,
      reactivatedUsers: reactivatedUsers?.length || 0,
      updatedEndDates: updatedEndDates?.length || 0
    });

  } catch (error) {
    console.error('Subscription check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}