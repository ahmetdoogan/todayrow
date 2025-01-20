export type SubscriptionStatus = 'free_trial' | 'pro' | 'expired';
export type SubscriptionType = 'monthly' | 'yearly' | 'free';

export interface Subscription {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  trialStart: Date;
  trialEnd: Date;
  subscriptionStart?: Date;
  subscriptionEnd?: Date;
  subscriptionType: SubscriptionType;
}