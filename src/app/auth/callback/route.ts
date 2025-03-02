import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    console.log('Auth callback route triggered, search params:', requestUrl.searchParams.toString());
    const code = requestUrl.searchParams.get('code');

    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
      
      console.log('Auth callback triggered, user data:', data?.session);
      if (data?.user) {
        // Önce profiles tablosundan kontrol et
        const { data: profile } = await supabase
          .from('profiles')
          .select('welcome_email_sent')
          .eq('id', data.user.id)
          .single();

        // Burada localStorage'ı kontrol edemiyoruz (server-side kod)
        // Ancak client-side'da kontrol edip temizleyeceğiz
        if (!profile?.welcome_email_sent) {
          const origin = request.headers.get('origin') || 'https://www.todayrow.app';
          console.log('Welcome email not sent yet, sending now');
          await fetch(`${origin}/api/email/sendWelcome`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ 
              email: data.user.email,
              name: data.user.user_metadata?.full_name || '' 
            })
          }).catch(error => {
            console.error('Welcome email fetch error:', error);
          });

          // welcome_email_sent'i güncelle
          await supabase
            .from('profiles')
            .update({ welcome_email_sent: true })
            .eq('id', data.user.id);
        }
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