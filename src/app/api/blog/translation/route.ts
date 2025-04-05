import { NextRequest, NextResponse } from 'next/server';
import { findTranslatedSlug } from '@/lib/blog';

export async function GET(request: NextRequest) {
  try {
    // URL'den parametreleri al
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const locale = searchParams.get('locale') || 'en';
    const otherLocale = searchParams.get('otherLocale') || 'tr';
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }
    
    // Çevirisi olan slug'ı bul
    const translatedSlug = findTranslatedSlug(slug, locale, otherLocale);
    
    return NextResponse.json({ translatedSlug });
  } catch (error) {
    console.error('Error finding translated slug:', error);
    return NextResponse.json(
      { error: 'Failed to find translated slug' },
      { status: 500 }
    );
  }
}
