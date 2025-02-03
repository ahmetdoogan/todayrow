"use client";
import React, { useMemo } from 'react';
import { useContent } from '@/context/ContentContext';
import { getWeekStart, isSameDay } from '@/utils/calendarHelpers';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTranslations } from 'next-intl';

interface CalendarContentProps {
  content: any;
  onClick: () => void;
}

const CalendarContent: React.FC<CalendarContentProps> = ({ content, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`${
        content.is_completed 
          ? 'bg-slate-800/80 text-slate-300' 
          : 'bg-slate-800 text-white'
      } p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-xs sm:text-sm mb-1 sm:mb-1.5 cursor-pointer hover:opacity-90 transition-all backdrop-blur-sm`}
    >
      <div className="font-medium text-[10px] sm:text-xs truncate leading-tight">
        {content.title}
      </div>
    </div>
  );
};

interface WeekViewProps {
  selectedDate: Date;
}

const WeekView: React.FC<WeekViewProps> = ({ selectedDate }) => {
  const { contents, setSelectedContent } = useContent();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const t = useTranslations('common');
  
  const weekDays = [
    t('calendar.days.monday'),
    t('calendar.days.tuesday'),
    t('calendar.days.wednesday'),
    t('calendar.days.thursday'),
    t('calendar.days.friday'),
    t('calendar.days.saturday'),
    t('calendar.days.sunday')
  ];

  const weekDaysShort = [
    t('calendar.daysShort.mon'),
    t('calendar.daysShort.tue'),
    t('calendar.daysShort.wed'),
    t('calendar.daysShort.thu'),
    t('calendar.daysShort.fri'),
    t('calendar.daysShort.sat'),
    t('calendar.daysShort.sun')
  ];

  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Haftanın başlangıç gününü al
  const weekStart = useMemo(() => getWeekStart(selectedDate), [selectedDate]);

  // Her gün için içerikleri filtrele
  const getDayContents = (dayOffset: number, hour: number) => {
  const currentDate = new Date(weekStart);
  currentDate.setDate(weekStart.getDate() + dayOffset);

  return contents.filter(content => {
    const cDate = new Date(content.date);
    return (
      isSameDay(cDate, currentDate) &&
      cDate.getHours() === hour
    );
  });
};

  // Bugünün tarihini kontrol et
  const isToday = (dayOffset: number) => {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + dayOffset);
    const today = new Date();
    return isSameDay(currentDate, today);
  };

  const displayDays = isMobile ? weekDaysShort : weekDays;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      {/* Header - Days */}
      <div className="grid grid-cols-8 divide-x divide-slate-200 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2 sm:p-3 text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm">{t('calendar.time')}</div>
        {displayDays.map((day, index) => {
          const currentDate = new Date(weekStart);
          currentDate.setDate(weekStart.getDate() + index);
          const todayClass = isToday(index) ? 'font-semibold text-slate-900 dark:text-white' : '';
          
          return (
            <div key={day + index} className="p-2 sm:p-3 text-center">
              <div className={`font-medium text-xs sm:text-sm ${todayClass || 'text-slate-600 dark:text-slate-400'}`}>
                {day}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                {currentDate.getDate().toString().padStart(2, '0')}/{(currentDate.getMonth() + 1).toString().padStart(2, '0')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Grid */}
      <div className="overflow-auto max-h-[600px] hide-scrollbar">
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-8 divide-x divide-slate-200 dark:divide-slate-800">
            {/* Time Column */}
            <div className="p-1.5 sm:p-2 text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>

            {/* Day Columns */}
            {weekDays.map((_, dayIndex) => {
              const isCurrentDay = isToday(dayIndex);
              return (
                <div 
                  key={`${dayIndex}-${hour}`} 
                  className={`p-1 sm:p-1.5 border-t border-slate-200 dark:border-slate-800 ${
                    isCurrentDay ? 'bg-slate-50/50 dark:bg-slate-800/20' : ''
                  }`}
                >
                  {getDayContents(dayIndex, hour).map(content => (
                    <CalendarContent
                      key={content.id}
                      content={content}
                      onClick={() => setSelectedContent(content)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;