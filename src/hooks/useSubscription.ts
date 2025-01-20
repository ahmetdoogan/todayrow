import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Subscription } from '@/types/subscription';

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();

  useEffect(() => {
    async function getSubscription() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Önce subscriptions tablosundan kontrol et
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (subData) {
          setSubscription(subData);
        } else {
          // User metadata'dan kontrol et
          const status = user.user_metadata?.subscription_status || 'free_trial';
          const type = user.user_metadata?.subscription_type || 'free';
          const trialEnd = user.user_metadata?.trial_end_date;

          setSubscription({
            id: undefined,
            user_id: user.id,
            status,
            subscription_type: type,
            trial_end: trialEnd,
            subscription_end: undefined,
            trial_start: undefined,
            subscription_start: undefined,
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
  }, [supabase]);

  // Bazı türetme (trialDaysLeft, isPro, vs.)
  let derivedStatus = subscription?.status || 'free_trial';

  // Trial day calc
  let trialDaysLeft = 0;
  if (subscription?.trial_end) {
    const diff = new Date(subscription.trial_end).getTime() - Date.now();
    trialDaysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    if (derivedStatus === 'free_trial' && trialDaysLeft <= 0) {
      derivedStatus = 'expired';
    }
  }

  // Cancel scheduled => pro until subscription_end (if in future)
  let isPro = false;
  if (derivedStatus === 'pro' || derivedStatus === 'active') {
    isPro = true;
  } else if (derivedStatus === 'cancel_scheduled') {
    // e.g. we set subscription_end in future
    const endTime = subscription?.subscription_end ? new Date(subscription.subscription_end).getTime() : 0;
    if (endTime > Date.now()) {
      // still pro
      isPro = true;
    } else {
      // period ended => expired
      derivedStatus = 'expired';
    }
  }

  const isTrialing = (derivedStatus === 'free_trial');
  const isExpired = (derivedStatus === 'expired');

  return {
    subscription,
    loading,
    isTrialing,
    isPro,
    isExpired,
    trialDaysLeft,
    status: derivedStatus,
  };
}
