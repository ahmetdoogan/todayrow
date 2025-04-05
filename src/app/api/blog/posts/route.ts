import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/blog';

export async function GET(request: NextRequest) {
  try {
    // URL'den locale parametresini al
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    // Blog yazılarını getir
    const posts = getAllBlogPosts(locale);
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
