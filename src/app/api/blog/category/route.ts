import { NextRequest, NextResponse } from 'next/server';
import { getPostsByCategory } from '@/lib/blog';

export async function GET(request: NextRequest) {
  try {
    // URL'den category ve locale parametrelerini al
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const locale = searchParams.get('locale') || 'en';
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category parameter is required' },
        { status: 400 }
      );
    }
    
    // Kategoriye göre blog yazılarını getir
    const posts = getPostsByCategory(category, locale);
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts by category' },
      { status: 500 }
    );
  }
}
