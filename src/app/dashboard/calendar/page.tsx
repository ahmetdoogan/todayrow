"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
import CalendarHeader from '@/components/layout/Header/components/CalendarHeader';
import DayView from '@/components/calendar/views/DayView';
import WeekView from '@/components/calendar/views/WeekView';
import MonthView from '@/components/calendar/views/MonthView';
import CalendarNavigation from '@/components/calendar/CalendarNavigation';
import { useCalendarNavigation } from '@/components/calendar/hooks/useCalendarNavigation';
import { useContent } from '@/context/ContentContext';
import ContentDetailPopup from '@/components/content/ContentDetailPopup';

export default function CalendarPage() {
  const { theme, toggleTheme } = useTheme();
  const { selectedContent } = useContent();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    selectedDate,
    setSelectedDate,
    view,
    setView,
    navigateToToday,
    navigateToNext,
    navigateToPrevious,
    getDateTitle,
  } = useCalendarNavigation();

  return (
    <>
      <CalendarHeader 
        currentMonth={selectedDate}
        onPrevMonth={navigateToPrevious}
        onNextMonth={navigateToNext}
        darkMode={theme === 'dark'}
        toggleTheme={toggleTheme}
      />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-7xl mx-auto px-2 sm:px-4"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CalendarNavigation
              view={view}
              setView={setView}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              navigateToNext={navigateToNext}
              navigateToPrevious={navigateToPrevious}
              navigateToToday={navigateToToday}
              dateTitle={getDateTitle()}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="overflow-x-hidden"
            >
              {view === 'day' && <DayView selectedDate={selectedDate} />}
              {view === 'week' && <WeekView selectedDate={selectedDate} />}
              {view === 'month' && <MonthView selectedDate={selectedDate} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {selectedContent && <ContentDetailPopup />}
    </>
  );
}