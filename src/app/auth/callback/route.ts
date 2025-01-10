import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    }

    // HTTPS kullanımını zorlayalım
    return NextResponse.redirect('https://todayrow.app/dashboard', {
      status: 301
    });
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect('https://todayrow.app', {
      status: 301
    });
  }
}