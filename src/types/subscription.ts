export type SubscriptionStatus =
  | "free_trial"
  | "pro"
  | "expired"
  | "active"
  | "cancel_scheduled";

export type SubscriptionType = "monthly" | "yearly" | "free";

export interface Subscription {
  id?: string;
  user_id?: string;
  status?: SubscriptionStatus;
  trial_start?: string | null;
  trial_end?: string | null;
  subscription_start?: string | null;
  subscription_end?: string | null;
  subscription_type?: SubscriptionType;
  polar_sub_id?: string | null;
  polar_customer_id?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
}
