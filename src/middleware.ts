import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Dil tercihi algılama ve yönlendirme
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Eğer zaten tr veya en prefix'i varsa, hiçbir şey yapma
  if (pathname.startsWith('/tr') || pathname.startsWith('/en')) {
    return NextResponse.next();
  }
  
  // Eğer pathname root veya basit bir endpoint ise
  const newPathname = pathname === '/' ? '' : pathname;
  
  // Varsayılan olarak tr kullan (ama kullanıcının dil tercihini kontrol et)
  let locale = 'tr';
  
  // Kullanıcının tarayıcı dilini kontrol et
  const acceptLanguage = req.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim().toLowerCase());
    
    // Türkçe ve İngilizce dil kodlarını kontrol et
    const hasTurkish = languages.some(lang => lang.startsWith('tr'));
    const hasEnglish = languages.some(lang => lang.startsWith('en'));
    
    // İngilizce varsa ve Türkçe yoksa, en olarak ayarla
    if (hasEnglish && !hasTurkish) {
      locale = 'en';
    }
  }
  
  // Cookie veya localStorage kontrolü (client-side olduğu için middleware'de yapılamaz)
  // Bu kısım LanguageProvider tarafından client-side'da halledilecek
  
  // İlgili dizine yönlendir ama boş bir alt sayfa oluşturmadan
  const url = req.nextUrl.clone();
  url.pathname = newPathname;
  
  // Redirect status: true => 307 (geçici yönlendirme), false => 308 (kalıcı yönlendirme)
  return NextResponse.next();
}

// Middleware yalnızca kök sayfa için çalıştır
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|.*\..*).*)'],
};
