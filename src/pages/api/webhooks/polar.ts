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
    console.log('=========== START: POLAR WEBHOOK ===========');
    console.log('1. Raw request:', {
      method: req.method,
      headers: req.headers,
      body: req.body
    });

    const payload = req.body;
    console.log('2. Parsed payload:', JSON.stringify(payload, null, 2));

    const { type, data } = payload;
    console.log('3. Event type:', type);

    let userIdFromMeta = data?.metadata?.user_id || data?.user_id || null;
    console.log('4. userIdFromMeta:', userIdFromMeta);

    let planType = data?.metadata?.plan === 'yearly' ? 'yearly' : 'monthly';
    console.log('5. planType:', planType);

    if (!userIdFromMeta) {
      console.log('6. No user_id found, ignoring webhook');
      console.log('=========== END: POLAR WEBHOOK ===========');
      return res.status(200).json({ message: 'No user_id, ignoring' });
    }

    switch (type) {
      case 'subscription.created':
        console.log('7. Handling subscription.created');
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
          console.log('8. Update error:', updateErr);
        } else {
          console.log('8. Update success:', updated);
        }

        if (!updated || updated.length === 0) {
          console.log('9. No existing record, trying insert');
          const { data: inserted, error: insertErr } = await supabase
            .from('subscriptions')
            .insert({
              user_id: userIdFromMeta,
              status: 'pro',
              subscription_type: planType,
              subscription_start: currentDate,
              subscription_end: null,
              polar_sub_id: polarSubId,
              created_at: currentDate,
              updated_at: currentDate
            })
            .select('*');

          if (insertErr) {
            console.log('10. Insert error:', insertErr);
          } else {
            console.log('10. Insert success:', inserted);
          }
        }
        break;

      // Diğer case'ler aynı kalacak...

      default:
        console.log('7. Unhandled webhook type:', type);
        break;
    }

    console.log('=========== END: POLAR WEBHOOK ===========');
    return res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}