import { useAuth } from '@/context/AuthContext';
import { ConversionTracker } from './conversion-tracking';

export const useConversionTracking = () => {
  const { user } = useAuth();

  const trackTrialStart = (details: Record<string, any> = {}) => {
    if (!user?.id) return;
    ConversionTracker.trackTrialStart(user.id, details);
  };

  const trackTrialStatus = (daysRemaining: number, details: Record<string, any> = {}) => {
    if (!user?.id) return;
    ConversionTracker.trackTrialStatus(user.id, daysRemaining, details);
  };

  const trackConversionStep = (
    step: 'view_plans' | 'select_plan' | 'checkout_start' | 'payment_info' | 'payment_submit',
    details: Record<string, any> = {}
  ) => {
    if (!user?.id) return;
    ConversionTracker.trackConversionFlow(user.id, step, details);
  };

  const trackPayment = (success: boolean, details: Record<string, any> = {}) => {
    if (!user?.id) return;
    ConversionTracker.trackPaymentResult(user.id, success, details);
  };

  const trackSubscriptionChange = (
    status: 'activated' | 'canceled' | 'renewed' | 'expired',
    details: Record<string, any> = {}
  ) => {
    if (!user?.id) return;
    ConversionTracker.trackSubscriptionChange(user.id, status, details);
  };

  const trackRetention = (
    retentionDays: number,
    isActive: boolean,
    details: Record<string, any> = {}
  ) => {
    if (!user?.id) return;
    ConversionTracker.trackRetentionStatus(user.id, retentionDays, isActive, details);
  };

  const trackPremiumFeature = (featureName: string, details: Record<string, any> = {}) => {
    if (!user?.id) return;
    ConversionTracker.trackPremiumFeatureUsage(user.id, featureName, details);
  };

  const trackUpgradePrompt = (
    promptType: string,
    action: 'show' | 'click' | 'dismiss',
    details: Record<string, any> = {}
  ) => {
    if (!user?.id) return;
    ConversionTracker.trackUpgradePrompt(user.id, promptType, action, details);
  };

  return {
    trackTrialStart,
    trackTrialStatus,
    trackConversionStep,
    trackPayment,
    trackSubscriptionChange,
    trackRetention,
    trackPremiumFeature,
    trackUpgradePrompt
  };
};