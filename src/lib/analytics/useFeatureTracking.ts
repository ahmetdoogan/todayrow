import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FeatureTracker } from './feature-tracking';

export const useFeatureTracking = (
  featureName: 'dashboard' | 'content_planning' | 'notes' | 'calendar'
) => {
  const { user } = useAuth();
  const startTimeRef = useRef<number>(Date.now());

  // Komponentin mount olduğu anı kaydet
  useEffect(() => {
    startTimeRef.current = Date.now();

    // Feature görüntüleme olayını kaydet
    if (user?.id) {
      if (featureName === 'dashboard') {
        FeatureTracker.trackDashboardUsage(user.id, 'view');
      } else {
        FeatureTracker.trackFeatureOutcome(user.id, featureName, 'success', {
          action: 'view'
        });
      }
    }

    // Komponent unmount olduğunda süreyi kaydet
    return () => {
      if (user?.id) {
        const timeSpentSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        FeatureTracker.trackFeatureTime(user.id, featureName, timeSpentSeconds);
      }
    };
  }, [featureName, user?.id]);

  // Feature kullanımını izlemek için yardımcı fonksiyonlar
  const trackUsage = (
    action: string,
    details: Record<string, any> = {}
  ) => {
    if (!user?.id) return;

    switch (featureName) {
      case 'dashboard':
        FeatureTracker.trackDashboardUsage(user.id, 'interact', details);
        break;
      case 'content_planning':
        FeatureTracker.trackContentPlanning(user.id, action as any, details);
        break;
      case 'notes':
        FeatureTracker.trackNoteUsage(user.id, action as any, details);
        break;
      case 'calendar':
        FeatureTracker.trackCalendarUsage(user.id, action as any, details);
        break;
    }
  };

  const trackError = (errorDetails: Record<string, any> = {}) => {
    if (!user?.id) return;
    
    FeatureTracker.trackFeatureOutcome(user.id, featureName, 'error', errorDetails);
  };

  return {
    trackUsage,
    trackError
  };
};