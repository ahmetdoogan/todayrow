import { User } from '@supabase/supabase-js';
import { sendEvent, EventCategories, EventActions } from './ga-manager';

export class UserTracker {
  // Kullanıcı oturum durumu değişikliklerini izle
  static trackAuthStateChange(event: string, user: User | null) {
    if (!user) return;

    const commonProps = {
      user_id: user.id,
      auth_provider: user.app_metadata.provider,
      user_email_domain: user.email ? user.email.split('@')[1] : null,
    };

    switch (event) {
      case 'SIGNED_IN':
        sendEvent({
          action: EventActions.LOGIN,
          category: EventCategories.USER,
          ...commonProps,
        });
        break;

      case 'SIGNED_UP':
        sendEvent({
          action: EventActions.SIGNUP,
          category: EventCategories.USER,
          ...commonProps,
        });
        break;

      case 'SIGNED_OUT':
        sendEvent({
          action: EventActions.LOGOUT,
          category: EventCategories.USER,
          ...commonProps,
        });
        break;
    }
  }

  // Kullanıcı oturum süresini izle
  static trackSessionDuration(userId: string, sessionStartTime: number) {
    const sessionDuration = Date.now() - sessionStartTime;
    
    sendEvent({
      action: 'session_end',
      category: EventCategories.USER,
      user_id: userId,
      value: Math.floor(sessionDuration / 1000), // saniye cinsinden
      metric: {
        session_duration_seconds: Math.floor(sessionDuration / 1000),
      }
    });
  }

  // Kullanıcı etkileşimlerini izle
  static trackUserEngagement(userId: string, action: string, details: Record<string, any> = {}) {
    sendEvent({
      action: action,
      category: EventCategories.ENGAGEMENT,
      user_id: userId,
      ...details
    });
  }

  // İleride premium/ödeme durumu için
  static trackSubscriptionStatus(userId: string, status: 'free' | 'trial' | 'premium') {
    sendEvent({
      action: 'subscription_status',
      category: EventCategories.USER,
      user_id: userId,
      label: status,
      subscription_status: status
    });
  }
}