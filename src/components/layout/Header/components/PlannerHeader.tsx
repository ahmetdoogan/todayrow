"use client";

import React from 'react';
import { usePlanner } from '@/context/PlannerContext';
import { motion } from 'framer-motion';
import BaseHeader from '@/components/layout/Header/components/BaseHeader';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useTranslations } from 'next-intl';
import { Trash2, Check, CheckSquare, ChevronLeft, ChevronRight } from "lucide-react";

const PlannerHeader = () => {
  const { 
    selectedDate, 
    setSelectedDate,
    isSelectionMode,
    setIsSelectionMode,
    selectedPlanIds,
    bulkDeletePlans,
    bulkCompletePlans
  } = usePlanner();

  const { language } = useLanguage();
  const t = useTranslations();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(t('common.locales.dateFormat'), {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const isYesterday = (date: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return `${t('common.planner.dates.today')} (${formatDate(date)})`;
    if (isTomorrow(date)) return `${t('common.planner.dates.tomorrow')} (${formatDate(date)})`;
    if (isYesterday(date)) return `${t('common.planner.dates.yesterday')} (${formatDate(date)})`;
    return formatDate(date);
  };
  
  // Gece yarısı sonrası uyarı kontrolü
  const isAfterMidnight = () => {
    const now = new Date();
    return now.getHours() >= 0 && now.getHours() < 6;
  };
  
  const [showMidnightWarning, setShowMidnightWarning] = React.useState(isAfterMidnight());
  
  React.useEffect(() => {
    // Sadece başlangıçta kontrol et
    setShowMidnightWarning(isAfterMidnight());
  }, []);

  const dates = React.useMemo(() => {
    const today = new Date();
    return [-1, 0, 1].map(offset => {
      const date = new Date(today);
      date.setDate(date.getDate() + offset);
      return date;
    });
  }, []);

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentIndex = dates.findIndex(date => date.toDateString() === selectedDate.toDateString());
    const newDate = dates[direction === 'prev' ? currentIndex - 1 : currentIndex + 1];
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  // Mobil için Tarih Navigasyonu
  const MobileDateNavigation = () => (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => navigateDate('prev')}
        disabled={selectedDate.toDateString() === dates[0].toDateString()}
        className="p-1"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm font-medium">{getDateLabel(selectedDate)}</span>
      <button 
        onClick={() => navigateDate('next')}
        disabled={selectedDate.toDateString() === dates[2].toDateString()}
        className="p-1"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  // Masaüstü için Tarih Navigasyonu
  const DesktopDateNavigation = () => (
    <div className="flex justify-center gap-1 md:gap-2">
      {dates.map((date, index) => {
        const isSelected = selectedDate.toDateString() === date.toDateString();
        const isDisabled = date < dates[0];

        return (
          <motion.button
            key={date.toISOString()}
            onClick={() => !isDisabled && setSelectedDate(date)}
            whileHover={!isDisabled ? { scale: 1.02 } : {}}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
            className={`
              relative px-2 md:px-4 py-1 md:py-1.5 rounded-lg transition-colors text-sm
              ${isSelected 
                ? 'bg-stone-800 text-white dark:bg-zinc-700 dark:text-stone-200' 
                : index === 1
                  ? 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${index === 1 ? 'font-medium' : ''}
            `}
          >
            {getDateLabel(date)}
            {index === 1 && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="w-1 h-1 bg-blue-500 rounded-full" />
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <>
      {showMidnightWarning && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/30 text-amber-700 dark:text-amber-400 px-4 py-2 text-sm text-center">
          <span>
            {t('common.planner.midnightWarning', { date: formatDate(new Date()) })}
          </span>
        </div>
      )}
      <BaseHeader
        leftContent={
          <button
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            className={`
              group flex items-center justify-center transition-colors rounded-lg
              w-8 h-8 md:w-auto md:h-auto md:px-4 md:py-2
              border border-gray-200 dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-700 
              ${isSelectionMode ? "bg-gray-100 dark:bg-gray-700" : ""}
            `}
            title={isSelectionMode ? t('common.planner.cancelSelection') : t('common.planner.multiSelect')}
          >
            <CheckSquare className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline text-sm">
              {isSelectionMode ? t('common.planner.cancelSelection') : t('common.planner.multiSelect')}
            </span>
          </button>
        }
        middleContent={
          <>
            <div className="hidden md:block">
              <DesktopDateNavigation />
            </div>
            <div className="md:hidden">
              <MobileDateNavigation />
            </div>
          </>
        }
      rightContent={
        isSelectionMode && selectedPlanIds.length > 0 ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => bulkDeletePlans(selectedPlanIds)}
              className="flex items-center gap-1 px-2 py-1 md:px-4 md:py-2 
                       bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 
                       text-white text-sm rounded-lg"
              title={t('common.planner.deleteSelected')}
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">{t('common.planner.deleteButton')}</span>
              <span>({selectedPlanIds.length})</span>
            </button>
            
            <button
              onClick={() => bulkCompletePlans(selectedPlanIds)}
              className="flex items-center gap-1 px-2 py-1 md:px-4 md:py-2 
                       bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 
                       text-white text-sm rounded-lg"
              title={t('common.planner.completeSelected')}
            >
              <Check className="w-4 h-4" />
              <span className="hidden md:inline">{t('common.planner.completeButton')}</span>
            </button>
          </div>
        ) : null
      }
      className="bg-stone-50 dark:bg-gray-900"
      noPadding
      showThemeToggle={true}
    />
  );
};

export default PlannerHeader;