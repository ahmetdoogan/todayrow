import { sendEvent, EventCategories, EventActions } from './ga-manager';

export class FeatureTracker {
  // Dashboard kullanım analizi
  static trackDashboardUsage(userId: string, action: 'view' | 'interact', details: Record<string, any> = {}) {
    sendEvent({
      action: action === 'view' ? 'dashboard_view' : 'dashboard_interact',
      category: EventCategories.FEATURE,
      user_id: userId,
      feature: 'dashboard',
      ...details
    });
  }

  // İçerik planlama kullanımı
  static trackContentPlanning(
    userId: string, 
    action: 'create' | 'edit' | 'delete' | 'view',
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: `content_${action}`,
      category: EventCategories.FEATURE,
      user_id: userId,
      feature: 'content_planning',
      ...details
    });
  }

  // Not alma özelliği kullanımı
  static trackNoteUsage(
    userId: string,
    action: 'create' | 'edit' | 'delete' | 'view',
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: `note_${action}`,
      category: EventCategories.FEATURE,
      user_id: userId,
      feature: 'notes',
      ...details
    });
  }

  // Takvim özelliği kullanımı
  static trackCalendarUsage(
    userId: string,
    action: 'view' | 'add_event' | 'edit_event' | 'delete_event',
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: `calendar_${action}`,
      category: EventCategories.FEATURE,
      user_id: userId,
      feature: 'calendar',
      ...details
    });
  }

  // Özellik kullanım süresi takibi
  static trackFeatureTime(
    userId: string,
    feature: string,
    timeSpentSeconds: number,
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: 'feature_time',
      category: EventCategories.FEATURE,
      user_id: userId,
      feature,
      value: timeSpentSeconds,
      metric: {
        time_spent_seconds: timeSpentSeconds
      },
      ...details
    });
  }

  // Özellik başarı/hata durumları
  static trackFeatureOutcome(
    userId: string,
    feature: string,
    outcome: 'success' | 'error',
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: `feature_${outcome}`,
      category: EventCategories.FEATURE,
      user_id: userId,
      feature,
      ...details
    });
  }
}