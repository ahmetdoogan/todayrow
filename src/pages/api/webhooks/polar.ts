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
    const payload = req.body;
    console.log('--- Polar webhook payload ---');
    console.log(JSON.stringify(payload, null, 2));

    const { type, data } = payload;

    let userIdFromMeta = data?.metadata?.user_id || data?.user_id || null;
    console.log('userIdFromMeta:', userIdFromMeta);

    // plan => monthly/yearly
    let planType = 'monthly';
    if (data?.metadata?.plan === 'yearly') {
      planType = 'yearly';
    }

    switch (type) {
      case 'subscription.created':
        if (!userIdFromMeta) {
          console.log('No userId in metadata; skipping subscription update');
          return res.status(200).json({ message: 'OK, but no userId' });
        }

        // Polar Subscription ID'yi kaydet
        const polarSubscriptionId = data.id; // Bu, abonelik ID'si olmalı
        console.log('Polar Subscription ID:', polarSubscriptionId); // Log ekle

        // try update => pro
        const { data: updatedRows, error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: 'pro',
            subscription_type: planType,
            subscription_end: null,
            polar_sub_id: polarSubscriptionId // Polar Subscription ID'yi kaydet
          })
          .eq('user_id', userIdFromMeta)
          .select('*');

        if (updateError) {
          console.log('Update error:', updateError);
        } else {
          console.log('Update success, updatedRows:', updatedRows);
        }

        // if no row => insert
        if (!updatedRows || updatedRows.length === 0) {
          const { data: insertedRows, error: insertError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: userIdFromMeta,
              status: 'pro',
              subscription_type: planType,
              subscription_end: null,
              polar_sub_id: polarSubscriptionId // Polar Subscription ID'yi kaydet
            })
            .select('*');

          if (insertError) {
            console.log('Insert error:', insertError);
          } else {
            console.log('Insert success:', insertedRows);
          }
        }
        break;

      case 'subscription.updated':
        if (!userIdFromMeta) {
          console.log('No userId in metadata; skipping subscription update');
          return res.status(200).json({ message: 'OK, but no userId' });
        }

        // Eğer iptal edildiyse ve dönem sonuna kadar devam edecekse
        if (data.cancel_at_period_end) {
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
              status: 'cancel_scheduled',
              subscription_end: data.current_period_end
            })
            .eq('user_id', userIdFromMeta);

          if (updateError) {
            console.log('Update error:', updateError);
          } else {
            console.log('Subscription marked as cancel_scheduled');
          }
        }
        break;

      case 'subscription.canceled':
      case 'subscription.expired':
        if (!userIdFromMeta) {
          console.log('No userId in metadata; skipping subscription cancel');
          return res.status(200).json({ message: 'OK, but no userId' });
        }

        // Aboneliği expired olarak işaretle
        await supabase
          .from('subscriptions')
          .update({
            status: 'expired',
            subscription_end: new Date(),
          })
          .eq('user_id', userIdFromMeta);

        await supabase.auth.admin.updateUserById(userIdFromMeta, {
          user_metadata: {
            subscription_status: 'expired',
            subscription_type: 'free',
          },
        });
        break;

      default:
        console.log('Unhandled webhook type:', type);
        break;
    }

    return res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}