import { sendEvent, EventCategories } from './ga-manager';

// Not özelliği izleme
export const trackNoteEvent = (action: 'create' | 'edit' | 'delete' | 'view', details = {}) => {
  sendEvent({
    action: `note_${action}`,
    category: EventCategories.FEATURE,
    feature_name: 'notes',
    ...details
  });
};

// İçerik özelliği izleme
export const trackContentEvent = (action: 'create' | 'edit' | 'delete' | 'view', details = {}) => {
  sendEvent({
    action: `content_${action}`,
    category: EventCategories.FEATURE,
    feature_name: 'content',
    ...details
  });
};

// Planlama özelliği izleme
export const trackPlanEvent = (action: 'create' | 'edit' | 'delete' | 'view', details = {}) => {
  sendEvent({
    action: `plan_${action}`,
    category: EventCategories.FEATURE,
    feature_name: 'planner',
    ...details
  });
};

// Özellik kullanım süresi izleme
export const trackFeatureUsageTime = (featureName: string, timeSpentSeconds: number) => {
  sendEvent({
    action: 'feature_usage_time',
    category: EventCategories.ENGAGEMENT,
    feature_name: featureName,
    time_spent: timeSpentSeconds
  });
};