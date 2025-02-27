import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Dil tercihi algılama ve yönlendirme
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Eğer /en uzantısına gidilmeye çalışılıyorsa ana sayfaya yönlendir
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const newUrl = req.nextUrl.clone();
    // /en yerine root'a yönlendir
    newUrl.pathname = pathname.replace(/^\/en(\/|$)/, '/');
    return NextResponse.redirect(newUrl);
  }
  
  // Diğer tüm URL'ler için normal davranış 
  return NextResponse.next();
}

// Middleware sadece /en ile başlayan path'ler için çalışsın
export const config = {
  matcher: ['/en', '/en/:path*'],
};
