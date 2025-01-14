'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabaseClient';

export const useSubscription = () => {
  const { user } = useAuth();
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);
  const [status, setStatus] = useState<'free_trial' | 'active' | 'expired' | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;

      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      if (subscription) {
        const trialEnd = new Date(subscription.trial_end);
        const now = new Date();
        const diff = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        setTrialDaysLeft(diff);
        setStatus(subscription.status);
      }
    };

    fetchSubscription();
  }, [user]);

  return { trialDaysLeft, status };
};
