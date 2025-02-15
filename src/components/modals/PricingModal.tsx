import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/utils/supabaseClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isTrialEnded?: boolean; // Bunu ekledik
}

const priceChangeKeyframes = `
  @keyframes priceChange {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const PricingModal = ({ isOpen, onClose, isTrialEnded }: Props) => {
  const [loading, setLoading] = useState(false);
  const t = useTranslations('pricing');
  const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('monthly');

  const price = billingType === 'monthly' ? 3 : 30;
  const savings = billingType === 'yearly' ? t('yearlyDiscount') : null;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <style>{priceChangeKeyframes}</style>
        
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden bg-white dark:bg-slate-900 rounded-3xl">
                <div className="p-8">
                  {/* Optional: Trial bitti mesajı */}
                  {isTrialEnded && (
                    <div className="mb-4 text-red-600 font-semibold">
                      {/* "Pro süreniz doldu, lütfen yenileyin" gibi */}
                      {t('subscriptionEndedMessage')}
                    </div>
                  )}

                  {/* Header Section */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Dialog.Title className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {t('title')}
                      </Dialog.Title>
                      <Dialog.Description className="text-lg text-gray-600 dark:text-gray-400">
                        {t('description')}
                      </Dialog.Description>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Pricing Switch */}
                  <div className="mt-8 flex justify-center gap-4">
                    <div className="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 p-1">
                      <button
                        onClick={() => setBillingType('monthly')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          billingType === 'monthly'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {t('monthly')}
                      </button>
                      <button
                        onClick={() => setBillingType('yearly')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 relative ${
                          billingType === 'yearly'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {t('yearly')}
                        <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                          -17%
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="mt-8 text-center relative h-20">
                    <div 
                      key={price} 
                      className="inline-flex items-baseline"
                      style={{ animation: 'priceChange 300ms ease-out' }}
                    >
                      <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                        ${price}
                      </span>
                      <span className="text-xl text-gray-500 dark:text-gray-400 ml-2">
                        /{billingType === 'monthly' ? t('monthlyShort') : t('yearlyShort')}
                      </span>
                    </div>
                    {savings && (
                      <div 
                        className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium"
                        style={{ animation: 'fadeIn 300ms ease-out' }}
                      >
                        {savings}
                      </div>
                    )}
                  </div>

                  {/* Features Grid */}
                  <div className="mt-8 grid grid-cols-2 gap-6">
                    {[
                      t('features.unlimited'),
                      t('features.planning'),
                      t('features.calendar'),
                      t('features.support'),
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <svg 
                            className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M5 13l4 4L19 7" 
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-center">
                    <button
                      className="mt-8 w-1/2 h-14 bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black text-base font-medium rounded-2xl transition-colors relative overflow-hidden"
                      disabled={loading}
                      onClick={async () => {
                        setLoading(true);
                        const { data: { session } } = await supabase.auth.getSession();
                        if (!session?.access_token) {
                          setLoading(false);
                          return;
                        }

                        try {
                          const resp = await fetch(`/api/checkout?plan=${billingType}`, {
                            method: 'GET',
                            headers: {
                              'Authorization': `Bearer ${session.access_token}`,
                            }
                          });

                          if (!resp.ok) {
                            console.error('Checkout error:', await resp.text());
                            setLoading(false);
                            return;
                          }

                          const data = await resp.json();
                          window.location.href = data.url;
                          onClose();
                        } catch (error) {
                          console.error('Checkout error:', error);
                          setLoading(false);
                        }
                      }}
                    >
                      {loading && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      )}
                      {t('button')}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PricingModal;
