"use client";
import React, { useMemo } from 'react';
import { useContent } from '@/context/ContentContext';
import { isSameDay } from '@/utils/calendarHelpers';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTranslations } from 'next-intl';

interface CalendarContentProps {
  content: any;
  onClick: () => void;
  isCurrentMonth: boolean;
}

const CalendarContent: React.FC<CalendarContentProps> = ({ content, onClick, isCurrentMonth }) => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  return (
    <div
      onClick={onClick}
      className={`${
        isCurrentMonth 
          ? (content.is_completed 
              ? 'bg-slate-800/50 text-slate-300' 
              : 'bg-slate-800 text-white'
            )
          : (content.is_completed 
              ? 'bg-slate-100/30 text-slate-500' 
              : 'bg-slate-100/30 text-slate-700'
            )
      } p-1.5 sm:p-2 rounded-lg text-xs sm:text-sm mb-1 cursor-pointer hover:opacity-90 transition-all backdrop-blur-sm`}
    >
      <div className="font-medium text-[11px] sm:text-xs truncate leading-tight max-w-[80px] sm:max-w-none">
        {isMobile ? content.title.substring(0, 12) + '...' : content.title}
      </div>
    </div>
  );
};

interface MonthViewProps {
  selectedDate: Date;
}

const MonthView: React.FC<MonthViewProps> = ({ selectedDate }) => {
  const { contents, setSelectedContent } = useContent();
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  // common namespace için: örneğin hafta günleri ve diğer ortak anahtarlar
  const tCommon = useTranslations('common');
  // views namespace için: ay görünümü ile ilgili çeviriler
  const tViews = useTranslations('views');

  // Haftanın günlerini çevirilerden al (common namespace)
  const weekDays = [
    tCommon('calendar.days.monday'),
    tCommon('calendar.days.tuesday'),
    tCommon('calendar.days.wednesday'),
    tCommon('calendar.days.thursday'),
    tCommon('calendar.days.friday'),
    tCommon('calendar.days.saturday'),
    tCommon('calendar.days.sunday')
  ];

  const weekDaysShort = [
    tCommon('calendar.daysShort.mon'),
    tCommon('calendar.daysShort.tue'),
    tCommon('calendar.daysShort.wed'),
    tCommon('calendar.daysShort.thu'),
    tCommon('calendar.daysShort.fri'),
    tCommon('calendar.daysShort.sat'),
    tCommon('calendar.daysShort.sun')
  ];

  // Ayın başlangıç tarihini hesapla (takvim grid'inin başlangıcı)
  const monthStart = useMemo(() => {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }, [selectedDate]);

  // Belirtilen gün için içerikleri filtrele
  const getDayContents = (date: Date) => {
    return contents.filter(content => {
      if (!content.date) return false;
      
      try {
        const contentDate = new Date(content.date);
        return isSameDay(contentDate, date);
      } catch (err) {
        console.error('MonthView - Tarih işlenirken hata:', err, 'Content:', content.id, content.title);
        return false;
      }
    });
  };

  // 6 haftalık takvim grid'i oluştur
  const calendar = useMemo(() => {
    const weeks = [];
    const day = new Date(monthStart);

    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        weekDays.push(new Date(day));
        day.setDate(day.getDate() + 1);
      }
      weeks.push(weekDays);
    }
    return weeks;
  }, [monthStart]);

  // Bugünün tarihini kontrol et
  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const displayDays = isMobile ? weekDaysShort : weekDays;
  const monthContents = contents.filter(content => {
    if (!content.date) return false;

    try {
      const contentDate = new Date(content.date);
      return contentDate.getMonth() === selectedDate.getMonth() &&
             contentDate.getFullYear() === selectedDate.getFullYear();
    } catch (err) {
      console.error('MonthView - Ay içeriklerini filtreleme hatası:', err);
      return false;
    }
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Empty State */}
      {monthContents.length === 0 && (
        <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
          {tViews('month.empty')}
        </div>
      )}

      {/* Haftanın Günleri */}
      <div className="grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800">
        {displayDays.map((day, index) => (
          <div key={day + index} className="text-center font-medium text-[11px] sm:text-sm text-slate-600 dark:text-slate-400 py-2 sm:py-3">
            {day}
          </div>
        ))}
      </div>

      {/* Takvim Grid */}
      <div className="grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800">
        {calendar.flat().map((date) => {
          const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
          const dayContents = getDayContents(date);
          const maxVisibleContents = isMobile ? 2 : 3;
          const hasMoreContents = dayContents.length > maxVisibleContents;

          return (
            <div 
              key={date.toISOString()}
              className={`min-h-[90px] sm:min-h-[120px] p-1.5 sm:p-2 ${
                isToday(date) 
                  ? 'ring-1 ring-inset ring-slate-900 dark:ring-white/20' 
                  : ''
              } ${
                isCurrentMonth 
                  ? 'bg-white dark:bg-slate-900' 
                  : 'bg-slate-50/50 dark:bg-slate-800/50'
              } relative group border-b border-slate-100 dark:border-slate-800`}
            >
              <div className={`
                text-xs sm:text-sm mb-1 sm:mb-2
                ${isCurrentMonth 
                  ? 'text-slate-900 dark:text-white' 
                  : 'text-slate-500 dark:text-slate-500'
                } 
                ${isToday(date) ? 'font-semibold' : 'font-medium'}
              `}>
                {date.getDate()}
              </div>
              <div className="space-y-0 sm:space-y-1 overflow-y-auto max-h-[60px] sm:max-h-[80px] hide-scrollbar">
                {dayContents.slice(0, maxVisibleContents).map(content => (
                  <CalendarContent
                    key={content.id}
                    content={content}
                    onClick={() => setSelectedContent(content)}
                    isCurrentMonth={isCurrentMonth}
                  />
                ))}
                {hasMoreContents && (
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {tViews('month.more', { count: dayContents.length - maxVisibleContents })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
