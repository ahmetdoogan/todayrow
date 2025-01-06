import { NextApiRequest, NextApiResponse } from 'next';
import * as cheerio from 'cheerio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }

    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Meta verileri toplama
    const metadata = {
      title: $('meta[property="og:title"]').attr('content') || $('title').text() || '',
      description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '',
      image: $('meta[property="og:image"]').attr('content') || '',
      site_name: $('meta[property="og:site_name"]').attr('content') || ''
    };

    res.status(200).json(metadata);
  } catch (error) {
    console.error('Metadata fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
}