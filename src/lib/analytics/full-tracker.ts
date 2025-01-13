import { sendEvent, EventCategories } from './ga-manager';

// Tüm sayfa rotalarını izle
const PAGE_ROUTES = {
  DASHBOARD: '/dashboard',
  NOTES: '/dashboard/notes',
  CONTENTS: '/dashboard/contents',
  CALENDAR: '/dashboard/calendar',
  SETTINGS: '/dashboard/settings',
  PROFILE: '/dashboard/settings/profile',
} as const;

// Tüm özellikleri izle
const FEATURES = {
  NOTES: {
    CREATE: 'note_create',
    EDIT: 'note_edit',
    DELETE: 'note_delete',
    VIEW: 'note_view'
  },
  CONTENT: {
    CREATE: 'content_create',
    EDIT: 'content_edit',
    DELETE: 'content_delete',
    VIEW: 'content_view'
  },
  PLAN: {
    CREATE: 'plan_create',
    EDIT: 'plan_edit',
    DELETE: 'plan_delete',
    VIEW: 'plan_view',
    COMPLETE: 'plan_complete'
  },
  CALENDAR: {
    CREATE: 'calendar_event_create',
    EDIT: 'calendar_event_edit',
    DELETE: 'calendar_event_delete',
    VIEW: 'calendar_view'
  },
  SETTINGS: {
    UPDATE: 'settings_update',
    VIEW: 'settings_view'
  }
} as const;

// Sayfa görüntüleme izleme
export const trackPage = (path: string) => {
  const normalizedPath = path.split('?')[0].split('#')[0];
  
  sendEvent({
    action: 'page_view',
    category: EventCategories.NAVIGATION,
    page_path: normalizedPath,
    page_title: document.title
  });
};

// Özellik kullanımı izleme
export const trackFeature = (
  feature: keyof typeof FEATURES,
  action: string,
  details: Record<string, any> = {}
) => {
  sendEvent({
    action: `${feature.toLowerCase()}_${action}`,
    category: EventCategories.FEATURE,
    feature_name: feature,
    ...details
  });
};

// Kullanıcı etkileşimi izleme
export const trackUserInteraction = (
  action: string,
  details: Record<string, any> = {}
) => {
  sendEvent({
    action: action,
    category: EventCategories.USER,
    ...details
  });
};

// Oturum süresi izleme
export const trackSessionDuration = (durationSeconds: number) => {
  sendEvent({
    action: 'session_duration',
    category: EventCategories.ENGAGEMENT,
    value: durationSeconds
  });
};

// Hata durumlarını izleme
export const trackError = (
  errorType: string,
  details: Record<string, any> = {}
) => {
  sendEvent({
    action: 'error',
    category: EventCategories.ERROR,
    error_type: errorType,
    ...details
  });
};