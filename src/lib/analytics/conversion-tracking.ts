import { sendEvent, EventCategories } from './ga-manager';

export class ConversionTracker {
  // Free Trial başlangıcı
  static trackTrialStart(userId: string, details: Record<string, any> = {}) {
    sendEvent({
      action: 'trial_start',
      category: EventCategories.PREMIUM,
      user_id: userId,
      ...details
    });
  }

  // Free Trial durumu
  static trackTrialStatus(
    userId: string, 
    daysRemaining: number, 
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: 'trial_status',
      category: EventCategories.PREMIUM,
      user_id: userId,
      value: daysRemaining,
      metrics: {
        trial_days_remaining: daysRemaining
      },
      ...details
    });
  }

  // Premium dönüşüm süreci izleme
  static trackConversionFlow(
    userId: string,
    step: 'view_plans' | 'select_plan' | 'checkout_start' | 'payment_info' | 'payment_submit',
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: 'conversion_flow',
      category: EventCategories.PREMIUM,
      user_id: userId,
      label: step,
      flow_step: step,
      ...details
    });
  }

  // Ödeme işlemi sonucu
  static trackPaymentResult(
    userId: string,
    success: boolean,
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: success ? 'payment_success' : 'payment_failure',
      category: EventCategories.PREMIUM,
      user_id: userId,
      value: success ? 1 : 0,
      ...details
    });
  }

  // Premium üyelik durumu değişikliği
  static trackSubscriptionChange(
    userId: string,
    status: 'activated' | 'canceled' | 'renewed' | 'expired',
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: `subscription_${status}`,
      category: EventCategories.PREMIUM,
      user_id: userId,
      subscription_status: status,
      ...details
    });
  }

  // Retention/Churn izleme
  static trackRetentionStatus(
    userId: string,
    retentionDays: number,
    isActive: boolean,
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: 'retention_status',
      category: EventCategories.PREMIUM,
      user_id: userId,
      value: retentionDays,
      metrics: {
        days_retained: retentionDays,
        is_active: isActive ? 1 : 0  // boolean'ı number'a çevirdik
      },
      ...details
    });
  }

  // Feature kullanım analizi (premium özelliklere özel)
  static trackPremiumFeatureUsage(
    userId: string,
    featureName: string,
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: 'premium_feature_use',
      category: EventCategories.PREMIUM,
      user_id: userId,
      feature: featureName,
      ...details
    });
  }

  // Yükseltme teklifi gösterimi ve etkileşimi
  static trackUpgradePrompt(
    userId: string,
    promptType: string,
    action: 'show' | 'click' | 'dismiss',
    details: Record<string, any> = {}
  ) {
    sendEvent({
      action: 'upgrade_prompt',
      category: EventCategories.PREMIUM,
      user_id: userId,
      label: `${promptType}_${action}`,
      prompt_type: promptType,
      prompt_action: action,
      ...details
    });
  }
}