// src/pages/api/cron/check-polar-subscriptions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface SubscriptionRecord {
  user_id: string;
  polar_sub_id: string;
  status: string;
  subscription_end: string;
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

    console.log('Starting Polar subscriptions check');
    
    // 1) Polar entegrasyonu olan ve süresi dolmuş "expired" abonelikleri yeniden aktifleştir
    // Bu kısım, Polar'dan webhook bekliyoruz ama gelmediği durumlar için bir güvenlik ağı sağlar
    const currentDate = new Date();

    // Polar entegrasyonu olan (polar_sub_id != null) tüm kullanıcıları al
    const { data: polarUsers, error: polarError } = await supabase
      .from('subscriptions')
      .select('user_id, polar_sub_id, status, subscription_end')
      .not('polar_sub_id', 'is', null);

    if (polarError) {
      console.error('Error fetching Polar users:', polarError);
      return res.status(500).json({ error: polarError.message });
    }

    let reactivatedCount = 0;
    let updatedEndDates = 0;

    // Tüm Polar kullanıcıları için kontroller
    for (const sub of (polarUsers as SubscriptionRecord[] || [])) {
      // 1. Statüsü "expired" olan Polar kullanıcıları "pro" statüsüne geri getir
      if (sub.status === 'expired') {
        // Abonelik bitiş tarihini 1 ay uzat (aylık abonelik varsayımı)
        const newEndDate = new Date();
        // Eğer subscription_end null değilse ve gelecekteyse, o tarihi baz al
        if (sub.subscription_end && new Date(sub.subscription_end) > currentDate) {
          newEndDate.setTime(new Date(sub.subscription_end).getTime());
        }
        // Bir ay ekle
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        // Günün sonuna ayarla (23:59:59.999)
        newEndDate.setHours(23, 59, 59, 999);

        // Subscription tablosunu güncelle
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: 'pro',
            subscription_end: newEndDate.toISOString(),
            updated_at: currentDate.toISOString()
          })
          .eq('user_id', sub.user_id);

        if (updateError) {
          console.error(`Error updating subscription for user ${sub.user_id}:`, updateError);
          continue;
        }

        reactivatedCount++;
        console.log(`Reactivated Pro status for user ${sub.user_id}`);
      }
      
      // 2. Abonelik bitiş tarihi geçmiş olan Polar kullanıcıları için tarihi güncelle
      else if (sub.status === 'pro' && sub.subscription_end && new Date(sub.subscription_end) < currentDate) {
        // Abonelik bitiş tarihini 1 ay uzat (aylık abonelik varsayımı)
        const newEndDate = new Date();
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        // Günün sonuna ayarla (23:59:59.999)
        newEndDate.setHours(23, 59, 59, 999);

        // Subscription tablosunu güncelle
        const { error: updateEndDateError } = await supabase
          .from('subscriptions')
          .update({
            subscription_end: newEndDate.toISOString(),
            updated_at: currentDate.toISOString()
          })
          .eq('user_id', sub.user_id);

        if (updateEndDateError) {
          console.error(`Error updating subscription_end for user ${sub.user_id}:`, updateEndDateError);
          continue;
        }

        updatedEndDates++;
        console.log(`Updated subscription_end for user ${sub.user_id}`);
      }
    }

    // 3) cron_logs tablosuna kayıt
    const { error: logErr } = await supabase
      .from('cron_logs')
      .insert({
        job_name: 'check-polar-subscriptions',
        execution_time: currentDate.toISOString(),
        details: { 
          reactivatedCount,
          updatedEndDates,
          totalPolarUsers: polarUsers?.length || 0
        }
      });
      
    if (logErr) {
      console.error('Error inserting cron log:', logErr);
    }

    return res.status(200).json({
      message: 'Polar subscriptions check completed',
      reactivatedCount,
      updatedEndDates,
      totalPolarUsers: polarUsers?.length || 0
    });

  } catch (error) {
    console.error('Polar subscriptions check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}