import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { pageView, sendEvent, setUserId, EventCategories, EventActions } from './ga-manager';

export const useAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = useSupabaseClient();

  // Sayfa değişikliklerini izle
  useEffect(() => {
    if (pathname) {
      pageView(pathname);
    }
  }, [pathname, searchParams]);

  // Kullanıcı oturumunu izle ve user_id'yi ayarla
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.id) {
        setUserId(session.user.id);
        
        // Oturum olaylarını kaydet
        if (event === 'SIGNED_IN') {
          sendEvent({
            action: EventActions.LOGIN,
            category: EventCategories.USER,
            userId: session.user.id,
          });
        } else if (event === 'SIGNED_OUT') {
          sendEvent({
            action: EventActions.LOGOUT,
            category: EventCategories.USER,
            userId: session.user.id,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Event gönderme yardımcı fonksiyonları
  const trackFeatureUsage = (featureName: string, details?: Record<string, any>) => {
    sendEvent({
      action: EventActions.FEATURE_USE,
      category: EventCategories.FEATURE,
      label: featureName,
      ...details,
    });
  };

  const trackContentAction = (action: string, contentType: string, details?: Record<string, any>) => {
    sendEvent({
      action,
      category: EventCategories.CONTENT,
      label: contentType,
      ...details,
    });
  };

  const trackPremiumAction = (action: string, details?: Record<string, any>) => {
    sendEvent({
      action,
      category: EventCategories.PREMIUM,
      ...details,
    });
  };

  return {
    trackFeatureUsage,
    trackContentAction,
    trackPremiumAction,
    sendEvent, // genel event gönderimi için
  };
};