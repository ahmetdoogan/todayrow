import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
      
      // Mail gönderimi
      if (data?.user) {
        await fetch(`${request.headers.get('origin')}/api/email/sendWelcome`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: data.user.email,
            name: data.user.user_metadata?.full_name || '' 
          })
        }).catch(console.error);
      }
    }

    // Host'a göre www'li veya www'siz URL oluştur
    const origin = request.headers.get('host')?.includes('www') 
      ? 'https://www.todayrow.app' 
      : 'https://todayrow.app';

    return NextResponse.redirect(`${origin}/dashboard`, {
      status: 301
    });
  } catch (error) {
    console.error('Callback error:', error);
    // Hata durumunda da aynı www kontrolü
    const origin = request.headers.get('host')?.includes('www') 
      ? 'https://www.todayrow.app' 
      : 'https://todayrow.app';
    return NextResponse.redirect(origin, {
      status: 301
    });
  }
}