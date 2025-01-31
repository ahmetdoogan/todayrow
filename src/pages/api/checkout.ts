// src/pages/api/checkout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Polar } from '@polar-sh/sdk';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Production URL'i tanımlayalım
const SITE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://todayrow.app'
  : 'http://localhost:3000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('=== CHECKOUT START ===');

  try {
    const plan = (req.query.plan || 'monthly') as string;
    console.log('Plan:', plan);

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token found' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ message: 'Auth failed' });
    }

    console.log('Authenticated user:', user.id);

    const polar = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN ?? '',
      server: 'production',
    });

    console.log('Creating checkout with config:', {
      productId: process.env.POLAR_PRODUCT_ID,
      successUrl: `${SITE_URL}/dashboard?payment=success`,
      userId: user.id,
      plan
    });

    const checkout = await polar.checkouts.custom.create({
      productId: process.env.POLAR_PRODUCT_ID!,
      successUrl: `${SITE_URL}/dashboard?payment=success`,
      metadata: {
        user_id: user.id,
        plan,
      },
    });

    console.log('Checkout created successfully:', checkout.url);
    return res.status(200).json({ url: checkout.url });
  } catch (err: any) {
    console.error('=== CHECKOUT ERROR ===');
    console.error('Error details:', err);
    return res.status(500).json({
      message: 'Something went wrong',
      error: err.message || String(err),
    });
  }
}