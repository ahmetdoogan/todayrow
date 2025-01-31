// src/pages/api/webhooks/polar.ts

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
    console.log('=========== START: POLAR WEBHOOK ===========');
    console.log('1. Received payload:', JSON.stringify(payload, null, 2));

    const { type, data } = payload;
    console.log('2. Event type:', type);

    let userIdFromMeta = data?.metadata?.user_id || data?.user_id || null;
    console.log('3. userIdFromMeta:', userIdFromMeta);

    let planType = data?.metadata?.plan === 'yearly' ? 'yearly' : 'monthly';

    if (!userIdFromMeta) {
      console.log('No user_id in metadata; cannot update subscription');
      console.log('=========== END: POLAR WEBHOOK ===========');
      return res.status(200).json({ message: 'No user_id, ignoring' });
    }

    switch (type) {
      // ----------------------------
      // 1) subscription.created
      // ----------------------------
      case 'subscription.created':
        console.log('[Webhook] subscription.created');
        const polarSubId = data.id;
        const currentDate = new Date().toISOString();

        const { data: updated, error: updateErr } = await supabase
          .from('subscriptions')
          .update({
            status: 'pro',
            subscription_type: planType,
            subscription_start: currentDate,
            subscription_end: null,
            polar_sub_id: polarSubId,
            updated_at: currentDate,
          })
          .eq('user_id', userIdFromMeta)
          .select('*');

        if (updateErr) {
          console.log('Update error:', updateErr);
        }

        if (!updated || updated.length === 0) {
          const { data: inserted, error: insertErr } = await supabase
            .from('subscriptions')
            .insert({
              user_id: userIdFromMeta,
              status: 'pro',
              subscription_type: planType,
              subscription_start: currentDate,
              subscription_end: null,
              polar_sub_id: polarSubId
            })
            .select('*');

          if (insertErr) {
            console.log('Insert error:', insertErr);
          } else {
            console.log('Insert success:', inserted);
          }
        }
        break;

      // ----------------------------
      // 2) subscription.updated
      // ----------------------------
      case 'subscription.updated':
        console.log('[Webhook] subscription.updated');
        if (data.cancel_at_period_end) {
          console.log('>> cancellation requested, setting status=cancel_scheduled');
          const periodEndDate = data.current_period_end
            ? new Date(data.current_period_end)
            : new Date();

          const { error: upErr } = await supabase
            .from('subscriptions')
            .update({
              status: 'cancel_scheduled',
              subscription_end: periodEndDate,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userIdFromMeta);

          if (upErr) {
            console.log('Error updating cancel_scheduled:', upErr);
          } else {
            console.log('Successfully scheduled cancellation for:', periodEndDate);
          }
        } else if (data.subscription_status === 'active' && data.paid) {
          // Subscription yenilenmiş veya ödeme başarılı
          const { error: reactivateErr } = await supabase
            .from('subscriptions')
            .update({
              status: 'pro',
              subscription_end: null,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userIdFromMeta);

          if (reactivateErr) {
            console.log('Error reactivating subscription:', reactivateErr);
          } else {
            console.log('Successfully reactivated subscription');
          }
        }
        break;

      // ----------------------------
      // 3) subscription.payment_failed
      // ----------------------------
      case 'subscription.payment_failed':
        console.log('[Webhook] subscription.payment_failed');
        const { error: paymentErr } = await supabase
          .from('subscriptions')
          .update({
            status: 'payment_failed',
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userIdFromMeta);

        if (paymentErr) {
          console.log('Error updating payment failed status:', paymentErr);
        } else {
          console.log('Successfully marked payment as failed');
        }
        break;

      // ----------------------------
      // 4) subscription.canceled
      // ----------------------------
      case 'subscription.canceled':
        console.log('[Webhook] subscription.canceled');
        if (data.cancel_at_period_end) {
          console.log('>> subscription.canceled but still active until period end');
          const { error: upErr2 } = await supabase
            .from('subscriptions')
            .update({
              status: 'cancel_scheduled',
              subscription_end: data.current_period_end
                ? new Date(data.current_period_end)
                : new Date(),
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userIdFromMeta);

          if (upErr2) {
            console.log('Error updating cancel_scheduled:', upErr2);
          }
        } else {
          console.log('>> subscription.canceled immediately');
          const { error: expErr } = await supabase
            .from('subscriptions')
            .update({
              status: 'expired',
              subscription_end: new Date(),
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userIdFromMeta);

          if (expErr) {
            console.log('Error updating expired:', expErr);
          }
        }
        break;

      // ----------------------------
      // 5) subscription.expired
      // ----------------------------
      case 'subscription.expired':
        console.log('[Webhook] subscription.expired');
        const { error: expErr2 } = await supabase
          .from('subscriptions')
          .update({
            status: 'expired',
            subscription_end: new Date(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userIdFromMeta);

        if (expErr2) {
          console.log('Error updating expired:', expErr2);
        }
        break;

      default:
        console.log('Unhandled webhook type:', type);
        break;
    }

    console.log('=========== END: POLAR WEBHOOK ===========');
    return res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}