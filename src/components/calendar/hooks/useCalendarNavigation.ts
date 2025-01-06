import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ViewType } from '@/types/calendar';

export const useCalendarNavigation = (initialView: ViewType = 'week') => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<ViewType>(initialView);
  const t = useTranslations('common');
  const locale = t('locales.dateFormat');

  const navigateToToday = () => {
    setSelectedDate(new Date());
  };

  const navigateToNext = () => {
    const newDate = new Date(selectedDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setSelectedDate(newDate);
  };

  const navigateToPrevious = () => {
    const newDate = new Date(selectedDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setSelectedDate(newDate);
  };

  const getDateTitle = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: view === 'day' ? 'long' : undefined,
      year: 'numeric',
      month: 'long',
      day: view === 'day' ? 'numeric' : undefined,
    };

    return selectedDate.toLocaleDateString(locale, options);
  };

  return {
    selectedDate,
    setSelectedDate,
    view,
    setView,
    navigateToToday,
    navigateToNext,
    navigateToPrevious,
    getDateTitle,
  };
};