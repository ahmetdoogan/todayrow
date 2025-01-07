"use client";
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTranslations } from 'next-intl';
import { ViewType } from '@/types/calendar';

interface CalendarNavigationProps {
  view: string;
  setView: (view: ViewType) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  navigateToNext: () => void;
  navigateToPrevious: () => void;
  navigateToToday: () => void;
  dateTitle: string;
}

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  view,
  setView,
  selectedDate,
  navigateToNext,
  navigateToPrevious,
  navigateToToday,
  dateTitle,
}) => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const t = useTranslations('common');

  return (
    <div className="flex flex-wrap gap-3 mb-3 sm:mb-6">
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <div className="flex gap-1">
          <button
            onClick={navigateToToday}
            className="p-2 text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {t('planner.dates.today')}
          </button>

          <div className="flex items-center">
            <button 
              onClick={navigateToPrevious}
              className="h-8 w-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={navigateToNext}
              className="h-8 w-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white truncate">
          {dateTitle}
        </h2>
      </div>

      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        <button
          onClick={() => setView('day')}
          className={`h-8 px-3 text-sm font-medium rounded-lg transition-colors min-w-[36px] ${
            view === 'day'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700'
          }`}
        >
          {isMobile ? t('calendar.views.day.shortLabel') : t('calendar.views.day.label')}
        </button>
        <button
          onClick={() => setView('week')}
          className={`h-8 px-3 text-sm font-medium rounded-lg transition-colors min-w-[36px] ${
            view === 'week'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700'
          }`}
        >
          {isMobile ? t('calendar.views.week.shortLabel') : t('calendar.views.week.label')}
        </button>
        <button
          onClick={() => setView('month')}
          className={`h-8 px-3 text-sm font-medium rounded-lg transition-colors min-w-[36px] ${
            view === 'month'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700'
          }`}
        >
          {isMobile ? t('calendar.views.month.shortLabel') : t('calendar.views.month.label')}
        </button>
      </div>
    </div>
  );
};

export default CalendarNavigation;