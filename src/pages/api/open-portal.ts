// src/pages/api/open-portal.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('=== OPEN PORTAL START ===');
  
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({ message: 'No token found' });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      console.log('Auth failed:', userError);
      return res.status(401).json({ message: 'Auth failed' });
    }
    const user = userData.user;
    console.log('User found:', user.id);

    const { data: subRecord, error: subError } = await supabase
      .from('subscriptions')
      .select('polar_sub_id, status')
      .eq('user_id', user.id)
      .eq('status', 'pro')
      .single();

    if (subError || !subRecord?.polar_sub_id) {
      console.log('No active subscription found:', subError);
      return res.status(404).json({ message: 'No active subscription found' });
    }

    console.log('Subscription found:', subRecord.polar_sub_id);

    // Manuel olarak portal URL'i oluşturalım
    const orgName = 'todayrow-test'; // Polar'daki organizasyon adınız
    const returnUrl = encodeURIComponent('http://localhost:3000/settings?portal_action=cancel_complete');
    const customerPortalUrl = `https://sandbox.polar.sh/${orgName}/portal?subscription_id=${subRecord.polar_sub_id}&return_url=${returnUrl}`;

    console.log('Generated portal URL:', customerPortalUrl);
    console.log('=== OPEN PORTAL END ===');

    return res.status(200).json({ url: customerPortalUrl });

  } catch (error: any) {
    console.error('[open-portal] error:', error);
    console.log('=== OPEN PORTAL ERROR END ===');
    return res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
}