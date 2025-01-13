import { sendEvent, EventCategories } from './ga-manager';

export class CustomReporting {
  // Cohort analizi için event gönderimi
  static trackCohortEvent(
    userId: string,
    cohortId: string, // Örnek: "2024-01" (kayıt olduğu ay)
    eventType: string,
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: 'cohort_event',
      category: EventCategories.ENGAGEMENT,
      user_id: userId,
      cohort_id: cohortId,
      event_type: eventType,
      ...details
    });
  }

  // Kullanıcı segmenti izleme
  static trackSegmentActivity(
    userId: string,
    segmentName: string, // Örnek: "power_user", "casual_user"
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: 'segment_activity',
      category: EventCategories.ENGAGEMENT,
      user_id: userId,
      segment: segmentName,
      ...details
    });
  }

  // A/B test sonuçları
  static trackExperimentResult(
    userId: string,
    experimentId: string,
    variant: string,
    result: string,
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: 'experiment_result',
      category: EventCategories.ENGAGEMENT,
      user_id: userId,
      experiment_id: experimentId,
      variant,
      result,
      ...details
    });
  }

  // Özelleştirilmiş kullanıcı yolculuğu
  static trackCustomJourney(
    userId: string,
    journeyStep: string,
    success: boolean,
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: 'custom_journey',
      category: EventCategories.ENGAGEMENT,
      user_id: userId,
      journey_step: journeyStep,
      success,
      ...details
    });
  }

  // Detaylı oturum analizi
  static trackDetailedSession(
    userId: string,
    sessionData: {
      duration: number;
      featuresUsed: string[];
      actionsPerformed: number;
      deviceType: string;
    },
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: 'detailed_session',
      category: EventCategories.ENGAGEMENT,
      user_id: userId,
      ...sessionData,
      ...details
    });
  }

  // ROI metrikleri
  static trackROIMetrics(
    userId: string,
    metrics: {
      timeSpentMinutes: number;
      tasksCompleted: number;
      resourcesSaved: number;
    },
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: 'roi_metrics',
      category: EventCategories.ENGAGEMENT,
      user_id: userId,
      ...metrics,
      ...details
    });
  }
}