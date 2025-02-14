"use client";
import { useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';

export default function PaywallPage() {
  const router = useRouter();
  const session = useSession();
  const [subscriptionStatus, setSubscriptionStatus] = useState('loading');
  const t = useTranslations('paywall');

  useEffect(() => {
    const fetchStatus = async () => {
      if (!session?.user?.id) {
        setSubscriptionStatus('expired');
        return;
      }

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', session.user.id)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching status:', error);
        return;
      }

      setSubscriptionStatus(data?.status || 'expired');
    };

    fetchStatus();
  }, [session?.user?.id]);

  const handleUpgrade = async () => {
    if (!session?.access_token) {
      router.push('/auth/login?redirect=/paywall');
      return;
    }

    try {
      const response = await fetch(`/api/checkout?plan=monthly`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        console.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Failed to fetch checkout URL:', error);
    }
  };

  const getContent = () => {
    switch (subscriptionStatus) {
      case 'payment_failed':
        return {
          title: t('titles.paymentFailed'),
          message: t('messages.paymentFailedMessage'),
          buttonText: t('buttons.updatePayment')
        };
      case 'expired':
        return {
          title: t('titles.subscriptionEnded'),
          message: t('messages.subscriptionEndedMessage'),
          buttonText: t('buttons.renewSubscription')
        };
      case 'cancel_scheduled':
        return {
          title: t('titles.subscriptionCanceled'),
          message: t('messages.subscriptionCanceledMessage'),
          buttonText: t('buttons.reactivateSubscription')
        };
      default:
        return {
          title: t('titles.accessRestricted'),
          message: t('messages.proRequired'),
          buttonText: t('buttons.upgradeToPro')
        };
    }
  };

  const content = getContent();

  if (subscriptionStatus === 'loading') {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          {content.title}
        </h1>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
          {content.message}
        </p>
        <button
          onClick={handleUpgrade}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium"
        >
          {content.buttonText}
        </button>
      </div>
    </div>
  );
}