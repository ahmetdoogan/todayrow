// src/hooks/useSubscription.ts
import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Subscription } from '@/types/subscription';
import { useAuth } from '@/context/AuthContext';

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();
  const { user } = useAuth();

  useEffect(() => {
    async function getSubscription() {
      try {
        if (!user) return;
        const { data: subData, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching subscription:', error);
        }

        if (subData) {
          setSubscription(subData);
        } else {
          const status = user.user_metadata?.subscription_status || 'free_trial';
          const type = user.user_metadata?.subscription_type || 'free';
          const trialEnd = user.user_metadata?.trial_end_date || null;
          setSubscription({
            id: undefined,
            user_id: user.id,
            status,
            subscription_type: type,
            trial_end: trialEnd,
            trial_start: undefined,
            subscription_end: undefined,
            subscription_start: undefined,
            polar_sub_id: undefined,
            created_at: undefined,
            updated_at: undefined
          });
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    }
    getSubscription();
  }, [supabase, user]);

  let derivedStatus = subscription?.status || 'free_trial';
  let trialDaysLeft = 0;

  if (subscription?.trial_end) {
    const diff = new Date(subscription.trial_end).getTime() - Date.now();
    trialDaysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    if (derivedStatus === 'free_trial' && trialDaysLeft <= 0) {
      derivedStatus = 'expired';
    }
  }

  const isPro = (
    (derivedStatus === 'pro' || derivedStatus === 'active') && 
    subscription?.subscription_type && 
    ['pro'].includes(subscription.subscription_type)
  );

  const isTrialing = (
    derivedStatus === 'free_trial' && 
    subscription?.subscription_type && 
    ['free'].includes(subscription.subscription_type)
  );

  const isExpired = (derivedStatus === 'expired');

  const isVerifiedUser = Boolean(subscription?.polar_sub_id);

  return {
    subscription,
    loading,
    isTrialing,
    isPro,
    isExpired,
    trialDaysLeft,
    status: derivedStatus,
    isVerifiedUser
  };
}