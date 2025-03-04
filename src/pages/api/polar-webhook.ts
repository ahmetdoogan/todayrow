// src/pages/api/webhooks/polar.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// API config for Vercel
export const config = {
  api: {
    bodyParser: true,
    externalResolver: true
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('=========== START: POLAR WEBHOOK ===========');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const payload = req.body;
    const { type, data } = payload;
    console.log('Event Type:', type);

    // user_id
    let userIdFromMeta = data?.metadata?.user_id || data?.user_id || null;
    console.log('User ID:', userIdFromMeta);

    // planType = 'monthly' or 'yearly'
    let planType = data?.metadata?.plan || 'monthly';
    console.log('Plan Type:', planType);

    if (!userIdFromMeta) {
      console.log('No user_id found in metadata, aborting...');
      return res.status(200).json({ message: 'No user_id found' });
    }

    switch (type) {
      case 'subscription.created':
      case 'subscription.active':
      case 'subscription.renewed': {
        console.log('Processing subscription creation/activation');
        const polarSubId = data.id;
        const currentDate = new Date().toISOString();

        // Aboneliğin yenilenme tarihini hesapla
        const subscriptionEnd = new Date();
        if (planType === 'yearly') {
          subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
        } else {
          // monthly
          subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
        }
        // Bitiş tarihini günün sonuna ayarla (23:59:59.999)
        subscriptionEnd.setHours(23, 59, 59, 999);

        const updateData = {
          status: 'pro',
          subscription_type: planType === 'yearly' ? 'yearly' : 'monthly',
          subscription_start: currentDate,
          subscription_end: subscriptionEnd.toISOString(),
          polar_sub_id: polarSubId,
          trial_start: null,
          trial_end: null,
          updated_at: currentDate,
          polar_customer_id: data.customer_id || null
        };

        console.log('Updating subscription with data:', updateData);

        const { data: updated, error: updateErr } = await supabase
          .from('subscriptions')
          .update(updateData)
          .eq('user_id', userIdFromMeta)
          .select('*');

        if (updateErr) {
          console.error('Failed to update subscription:', updateErr);
          return res.status(500).json({ error: updateErr.message });
        }

        // Pro başladı maili gönder
        await fetch('https://todayrow.app/api/email/sendProStarted', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email })
        }).catch(console.error);

        if (!updated || updated.length === 0) {
          console.log('No existing subscription found, creating new one');
          const { data: inserted, error: insertErr } = await supabase
            .from('subscriptions')
            .insert({
              user_id: userIdFromMeta,
              ...updateData
            })
            .select('*');

          if (insertErr) {
            console.error('Failed to insert subscription:', insertErr);
            return res.status(500).json({ error: insertErr.message });
          }

          console.log('Successfully created new subscription:', inserted);
        } else {
          console.log('Successfully updated subscription:', updated);
        }
        break;
      }

      case 'subscription.canceled': {
        console.log('Processing subscription cancellation');
        const cancelDate = new Date().toISOString();

        const { error: cancelErr } = await supabase
          .from('subscriptions')
          .update({
            status: 'cancel_scheduled',
            // subscription_type değişmiyor - pro haklarını korumak için
            updated_at: cancelDate,
          })
          .eq('user_id', userIdFromMeta);

        if (cancelErr) {
          console.error('Failed to process cancellation:', cancelErr);
          return res.status(500).json({ error: cancelErr.message });
        }

        // Pro iptal maili gönder
        await fetch('https://todayrow.app/api/email/sendProCancelled', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email })
        }).catch(console.error);
        break;
      }

      default:
        console.log('Unhandled webhook type:', type);
        break;
    }

    console.log('=========== END: POLAR WEBHOOK ===========');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
