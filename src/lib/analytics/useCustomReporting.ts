import { useAuth } from '@/context/AuthContext';
import { CustomReporting } from './custom-reporting';

export const useCustomReporting = () => {
  const { user } = useAuth();

  // Kayıt tarihine göre cohort ID'si oluştur
  const getCohortId = (user: any) => {
    if (!user?.created_at) return null;
    const date = new Date(user.created_at);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const trackCohort = (eventType: string, details: Record<string, any> = {}) => {
    if (!user?.id) return;
    const cohortId = getCohortId(user);
    if (cohortId) {
      CustomReporting.trackCohortEvent(user.id, cohortId, eventType, details);
    }
  };

  const trackSegment = (segmentName: string, details: Record<string, any> = {}) => {
    if (!user?.id) return;
    CustomReporting.trackSegmentActivity(user.id, segmentName, details);
  };

  const trackExperiment = (
    experimentId: string,
    variant: string,
    result: string,
    details: Record<string, any> = {}
  ) => {
    if (!user?.id) return;
    CustomReporting.trackExperimentResult(user.id, experimentId, variant, result, details);
  };

  const trackJourney = (
    journeyStep: string,
    success: boolean,
    details: Record<string, any> = {}
  ) => {
    if (!user?.id) return;
    CustomReporting.trackCustomJourney(user.id, journeyStep, success, details);
  };

  const trackDetailedSession = (
    sessionData: {
      duration: number;
      featuresUsed: string[];
      actionsPerformed: number;
      deviceType: string;
    },
    details: Record<string, any> = {}
  ) => {
    if (!user?.id) return;
    CustomReporting.trackDetailedSession(user.id, sessionData, details);
  };

  const trackROI = (
    metrics: {
      timeSpentMinutes: number;
      tasksCompleted: number;
      resourcesSaved: number;
    },
    details: Record<string, any> = {}
  ) => {
    if (!user?.id) return;
    CustomReporting.trackROIMetrics(user.id, metrics, details);
  };

  return {
    trackCohort,
    trackSegment,
    trackExperiment,
    trackJourney,
    trackDetailedSession,
    trackROI
  };
};