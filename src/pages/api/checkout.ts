// src/pages/api/checkout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Polar } from '@polar-sh/sdk';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('=== CHECKOUT START ===');
  console.log('1. Request headers:', req.headers);

  try {
    const plan = (req.query.plan || 'monthly') as string;
    console.log('2. Plan:', plan);

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      console.log('3. No token found in request');
      return res.status(401).json({ message: 'No token found' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.log('4. Auth error:', error);
      return res.status(401).json({ message: 'Auth failed' });
    }

    console.log('5. User authenticated:', user.id);

    const serverEnv = 'production';
    const polarAccessToken = process.env.POLAR_ACCESS_TOKEN;
    const productId = process.env.POLAR_PRODUCT_ID;

    console.log('6. Config:', {
      serverEnv,
      hasAccessToken: !!polarAccessToken,
      hasProductId: !!productId
    });

    const polar = new Polar({
      accessToken: polarAccessToken ?? '',
      server: serverEnv as any,
    });

    console.log('7. Creating checkout...');

    const checkout = await polar.checkouts.custom.create({
      productId: productId!,
      successUrl: `${req.headers.origin}/dashboard?payment=success`,
      metadata: {
        user_id: user.id,
        plan,
      },
    });

    console.log('8. Checkout created:', checkout.url);
    console.log('=== CHECKOUT END ===');

    return res.status(200).json({ url: checkout.url });
  } catch (err: any) {
    console.error('=== CHECKOUT ERROR ===');
    console.error('Error details:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    return res.status(500).json({
      message: 'Something went wrong',
      error: err.message || String(err),
    });
  }
}