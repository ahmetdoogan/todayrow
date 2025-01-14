'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal = ({ isOpen, onClose }: Props) => {
  const t = useTranslations('pricing');
  const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('monthly');

  const price = billingType === 'monthly' ? 3 : 30;
  const savings = billingType === 'yearly' ? t('yearlyDiscount') : null;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
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
              <Dialog.Panel className="w-full max-w-lg transform rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-xl transition-all">
                {/* Title */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <Dialog.Title className="text-2xl font-semibold text-gray-900 dark:text-white">
                      <span className="relative">
                        {t('title')}
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-violet-500 rounded-full transform scale-x-100 origin-left transition-transform"></span>
                      </span>
                    </Dialog.Title>
                    <Dialog.Description className="mt-2 text-base text-gray-500 dark:text-gray-400">
                      {t('description')}
                    </Dialog.Description>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center gap-4 mb-8">
                  <button
                    onClick={() => setBillingType('monthly')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      billingType === 'monthly'
                        ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-900 dark:text-violet-100'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {t('monthly')}
                  </button>
                  <button
                    onClick={() => setBillingType('yearly')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 relative ${
                      billingType === 'yearly'
                        ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-900 dark:text-violet-100'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {t('yearly')}
                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 rounded-full">
                      -17%
                    </span>
                  </button>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${price}
                    </span>
                    <span className="text-lg text-gray-500 dark:text-gray-400 mb-1">
                      /{billingType === 'monthly' ? t('monthlyShort') : t('yearlyShort')}
                    </span>
                  </div>
                  {savings && (
                    <div className="mt-1 text-sm text-green-600 dark:text-green-400">
                      {savings}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {[
                    t('features.unlimited'),
                    t('features.planning'),
                    t('features.calendar'),
                    t('features.support'),
                    t('features.noCard')
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors">
                  {t('button')}
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PricingModal;