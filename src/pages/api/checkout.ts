import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Polar } from '@polar-sh/sdk';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // plan=monthly or plan=yearly, default monthly
    const plan = (req.query.plan || 'monthly') as string;

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token found' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ message: 'Auth failed' });
    }

    // polar sandbox client
    const polar = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN ?? '',
      server: 'sandbox', 
    });

    // create checkout
    const checkout = await polar.checkouts.custom.create({
      productId: process.env.POLAR_PRODUCT_ID!,
      successUrl: 'http://localhost:3000/dashboard?payment=success', 
      metadata: {
        user_id: user.id,
        plan, // so we know monthly/yearly in polar.ts
      },
    });

    return res.status(200).json({ url: checkout.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return res.status(500).json({
      message: 'Something went wrong',
      error: err.message || String(err),
    });
  }
}
