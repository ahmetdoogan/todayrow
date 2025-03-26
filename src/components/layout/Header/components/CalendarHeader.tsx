"use client";

import React from 'react';
import BaseHeader from './BaseHeader';
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useTranslations } from 'next-intl';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPrevMonth,
  onNextMonth
}) => {
  const t = useTranslations();
  const { language } = useLanguage();
  const locale = t('common.locales.dateFormat');
  
  const monthName = currentMonth.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

  return (
    <BaseHeader
      leftContent={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium">{monthName}</span>
            <button
              onClick={onNextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      }
      middleContent={
        <h1 className="text-sm font-medium text-black dark:text-white">
          {t('common.calendar.title', { defaultValue: 'Calendar' })}
        </h1>
      }
      className="bg-stone-50"
      noPadding
      showThemeToggle={true}
    />
  );
};

export default CalendarHeader;