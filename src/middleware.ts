import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basit boş middleware fonksiyonu - hiçbir işlem yapmıyor
export async function middleware(req: NextRequest) {
  return NextResponse.next();
}

// Şimdilik boş bir matcher listesi
export const config = {
  matcher: [],
};
