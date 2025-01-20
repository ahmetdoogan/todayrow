import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';

export const SubscriptionBadge = () => {
  const { isTrialing, isPro, trialDaysLeft } = useSubscription();

  if (isPro) {
    return (
      <Badge variant="success" className="bg-green-500 text-white">
        PRO
      </Badge>
    );
  }

  if (isTrialing) {
    return (
      <Badge variant="warning" className="bg-orange-500 text-white">
        {trialDaysLeft} days left
      </Badge>
    );
  }

  return null;
};