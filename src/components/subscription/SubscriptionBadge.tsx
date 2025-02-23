import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

export const SubscriptionBadge = () => {
  const { isTrialing, isPro, trialDaysLeft, isExpired, status } = useSubscription(); // status ekledik
  const t = useTranslations('common.sidebar.trial');

  if (isExpired) {
    return (
      <Badge variant="destructive" className="bg-red-500 text-white">
        {t('ended')}
      </Badge>
    );
  }

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
        {t('daysLeft', { days: trialDaysLeft })}
      </Badge>
    );
  }

  if (status === 'cancelled') { // Yeni eklenen kısım
    return (
      <Badge variant="destructive" className="bg-red-500 text-white">
        Cancelled
      </Badge>
    );
  }

  return null; // Free için badge göstermiyoruz
};