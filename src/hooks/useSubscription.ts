// src/hooks/useSubscription.ts

import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '@/context/AuthContext';
import type { Subscription } from '@/types/subscription';

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchSubscription() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Subscriptions tablosunda bu kullanıcının kaydını çekiyoruz
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching subscription:', error);
        }

        if (data) {
          setSubscription(data);
        } else {
          // Eğer subscriptions tablosunda kaydı yoksa (yeni user)
          setSubscription({
            id: "",  // uuid stub
            user_id: user.id,
            status: "free_trial",
            subscription_type: "free",
            trial_start: null,
            trial_end: null,
            subscription_start: null,
            subscription_end: null,
            polar_sub_id: null,
            polar_customer_id: null,  // <-- Artık arayüzde tanımlı
            created_at: null,
            updated_at: null
          });
        }
      } catch (err) {
        console.error("Error fetching subscription:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [user, supabase]);

  // Eğer subscription hâlâ null ise
  if (!subscription) {
    return {
      subscription: null,
      loading,
      isPro: false,
      isExpired: false,
      isTrialing: false,
      trialDaysLeft: 0,
      status: "free_trial",
      isVerifiedUser: false
    };
  }

  // Mevcut subscription status
  let derivedStatus = subscription.status;
  let trialDaysLeft = 0;

  // TRIAL durumu & kalan gün hesaplama
  if (subscription.status === "free_trial" && subscription.trial_end) {
    const diff = new Date(subscription.trial_end).getTime() - Date.now();
    if (diff <= 0) {
      derivedStatus = "expired";
    } else {
      trialDaysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
  }

  // CANCEL_SCHEDULED durumu & süresi dolmuşsa EXPIRIED yap
  if (subscription.status === "cancel_scheduled" && subscription.subscription_end) {
    const diff = new Date(subscription.subscription_end).getTime() - Date.now();
    if (diff <= 0) {
      derivedStatus = "cancelled"; // Süresi dolmuşsa cancelled'e çevir
    }
  }

  // Pro mu? => status='pro' & subscription_type ∈ ['monthly','yearly']
  const isPro =
    derivedStatus === "pro" &&
    (subscription.subscription_type === "monthly" ||
      subscription.subscription_type === "yearly");

  // Expired mi? (trial bittiğinde veya cancel_scheduled süresi dolmuşsa)
  const isExpired = derivedStatus === "expired";

  // Trialing mi?
  const isTrialing = derivedStatus === "free_trial";

  // Cancelled mi?
  const isCancelled = derivedStatus === "cancelled";

  // polar_sub_id varsa isVerifiedUser
  const isVerifiedUser = Boolean(subscription.polar_sub_id);

  return {
    subscription,
    loading,
    isPro,
    isExpired,
    isTrialing,
    isCancelled, // Yeni eklenen field
    trialDaysLeft,
    status: derivedStatus,
    isVerifiedUser
  };
}