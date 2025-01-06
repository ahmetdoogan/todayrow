"use client";
import React from 'react';
import { ViewType } from '@/types/calendar';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface CalendarHeaderProps {
  view: ViewType;
  setView: (view: ViewType) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ view, setView }) => {
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <div className="flex items-center justify-end gap-1 mb-2 sm:mb-4 sm:gap-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg flex p-0.5 sm:p-1">
        <button
          onClick={() => setView('day')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg ${
            view === 'day'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {isMobile ? 'G' : 'Gün'}
        </button>
        <button
          onClick={() => setView('week')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg ${
            view === 'week'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {isMobile ? 'H' : 'Hafta'}
        </button>
        <button
          onClick={() => setView('month')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg ${
            view === 'month'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {isMobile ? 'A' : 'Ay'}
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;