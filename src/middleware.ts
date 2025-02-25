// middleware.js.bak
// Şu anda devre dışı bırakıldı

/*
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const url = req.nextUrl.clone();
  const { pathname } = url;
  
  // Şifre sıfırlama için özel işlem
  if (pathname === '/auth/reset-password') {
    // Şifre sıfırlama sayfasında oturum kontrolü yapmıyoruz
    // Bu sayfa herkes tarafından erişilebilir olmalı
    return res;
  }
  
  // Dashboard ve korumalı rotalar için oturum kontrolu yap
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/settings')) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Oturum yoksa login sayfasına yönlendir ve geldiği sayfayı redirect parametresine ekle
      url.pathname = '/auth/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return res;
}

export const config = {
  matcher: [
    // Korumalı alanlar
    '/dashboard/:path*',
    '/settings/:path*',
    // Auth sayfaları (giriş yapmış kullanıcıları yönlendirmek için)
    '/auth/reset-password',
  ],
};
*/