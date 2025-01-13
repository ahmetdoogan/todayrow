import { isValidTraffic } from './filters';

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Event kategorileri için sabitler
export const EventCategories = {
  USER: 'user',
  FEATURE: 'feature',
  CONTENT: 'content',
  PREMIUM: 'premium',
  ENGAGEMENT: 'engagement',
  PERFORMANCE: 'performance',
  NAVIGATION: 'navigation',
  ERROR: 'error'
} as const;

// Event aksiyonları için sabitler
export const EventActions = {
  // Kullanıcı olayları
  SIGNUP: 'signup',
  LOGIN: 'login',
  LOGOUT: 'logout',
  PROFILE_UPDATE: 'profile_update',
  
  // Feature kullanımı
  FEATURE_VIEW: 'feature_view',
  FEATURE_USE: 'feature_use',
  
  // İçerik olayları
  CONTENT_CREATE: 'content_create',
  CONTENT_UPDATE: 'content_update',
  CONTENT_DELETE: 'content_delete',
  
  // Premium olayları
  PREMIUM_VIEW: 'premium_view',
  PREMIUM_START: 'premium_start',
  PREMIUM_CONVERT: 'premium_convert',
  PREMIUM_CANCEL: 'premium_cancel',
  
  // Engagement olayları
  PAGE_ENGAGEMENT: 'page_engagement',
  FEATURE_ENGAGEMENT: 'feature_engagement',
  
  // Navigation olayları
  PAGE_VIEW: 'page_view',
  ROUTE_CHANGE: 'route_change',
  
  // Performance olayları
  PERFORMANCE: 'performance',
  
  // Error olayları
  ERROR: 'error',
} as const;

// Temel sayfa görüntüleme
export const pageView = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag && isValidTraffic()) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      transport_type: 'beacon'
    });
  }
};

// Kullanıcı kimliği ayarlama
export const setUserId = (userId: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag && isValidTraffic()) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      user_id: userId
    });
  }
};

// Performance metrikleri gönderme
export const sendPerformanceMetrics = () => {
  if (typeof window !== 'undefined' && 'performance' in window && isValidTraffic()) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    const firstPaint = paint.find(entry => entry.name === 'first-paint')?.startTime || 0;
    const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

    sendEvent({
      action: EventActions.PERFORMANCE,
      category: EventCategories.PERFORMANCE,
      label: window.location.pathname,
      metrics: {
        domComplete: navigation.domComplete || 0,
        loadEventEnd: navigation.loadEventEnd || 0,
        firstPaint,
        firstContentfulPaint,
      }
    });
  }
};

// Özel event gönderme
export const sendEvent = ({
  action,
  category,
  label,
  value,
  userId,
  metrics = {},
  ...otherProps
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
  metrics?: Record<string, number>;
  [key: string]: any;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag && isValidTraffic()) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      user_id: userId,
      ...metrics,
      ...otherProps,
    });
  }
};