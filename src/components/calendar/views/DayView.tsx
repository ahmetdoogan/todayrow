"use client";
import React from 'react';
import { useContent } from '@/context/ContentContext';
import { isSameDay } from '@/utils/calendarHelpers';
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
      } p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm mb-1 sm:mb-1.5 cursor-pointer hover:opacity-90 transition-all backdrop-blur-sm`}
    >
      <div className="font-medium text-[11px] sm:text-xs truncate leading-tight">
        {content.title}
      </div>
      {content.description && (
        <div className="text-[10px] sm:text-xs mt-1 opacity-75 truncate">
          {content.description}
        </div>
      )}
    </div>
  );
};

interface DayViewProps {
  selectedDate: Date;
}

const DayView: React.FC<DayViewProps> = ({ selectedDate }) => {
  const { contents, setSelectedContent } = useContent();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const isMobile = useMediaQuery('(max-width: 640px)');

  // views için çeviri anahtarlarını tViews ile, common için olanları tCommon ile çekiyoruz.
  const tViews = useTranslations('views');
  const tCommon = useTranslations('common');

  // Günün içeriklerini filtrele
  const getDayContents = (hour: number) => {
  return contents.filter(content => {
    // Tarih kontrolü - içerik yoksa filtrele
    if (!content.date) return false;
    
    try {
      // Burada önemli olan, içeriğin tarihini takvimde gösterilecek doğru saate çevirmektir
      const contentDate = new Date(content.date);
      
      // Takvimde görüntülemek için, içeriğin saatini (UTC'den) yerel zamana çeviriyoruz
      // content.timeFrame varsa ve "HH:MM" formatındaysa bunu da kullanabiliriz
      // Ancak burada sadece content.date değerini kullanmamız yeterli
      
      // Gün ve saat karşılaştırması
      const sameDay = isSameDay(contentDate, selectedDate);
      const sameHour = contentDate.getHours() === hour;
      
      // Debug için:
      if (sameDay && sameHour) {
        console.log(`İçerik '${content.title}', ${hour}:00 saatinde görüntüleniyor. DB Tarihi:`, content.date);
      }
      
      return sameDay && sameHour;
    } catch (err) {
      console.error('Tarih işlenirken hata:', err);
      return false;
    }
  });
};

  // Bugünün tarihini kontrol et
  const isToday = () => {
    const today = new Date();
    return isSameDay(selectedDate, today);
  };

  const todayClass = isToday() ? 'bg-slate-50/50 dark:bg-slate-800/20' : '';
  const dayContents = getDayContents(0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="p-2 sm:p-3 border-b border-slate-200 dark:border-slate-800">
        <div className={`font-medium text-xs sm:text-sm ${isToday() ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
          {selectedDate.toLocaleDateString(tCommon('locales.dateFormat'), { 
            weekday: isMobile ? 'short' : 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      </div>

      {/* Empty State */}
      {dayContents.length === 0 && (
        <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
          {tViews('day.empty')}
        </div>
      )}

      {/* Time Grid */}
      <div className="overflow-auto max-h-[600px] hide-scrollbar">
        {hours.map(hour => (
          <div key={hour} className={`flex border-b border-slate-200 dark:border-slate-800 ${todayClass}`}>
            {/* Time Column */}
            <div className="w-14 sm:w-20 flex-shrink-0 p-1.5 sm:p-2.5 text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500">
              {tCommon('calendar.timeGrid.hour', { hour: hour.toString().padStart(2, '0') })}
            </div>

            {/* Content Column */}
            <div className="flex-1 border-l border-slate-200 dark:border-slate-800 p-1.5">
              {getDayContents(hour).map(content => (
                <CalendarContent
                  key={content.id}
                  content={content}
                  onClick={() => setSelectedContent(content)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayView;
