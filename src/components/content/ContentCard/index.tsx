"use client";
import React from 'react';
import { Calendar, Check, ArrowLeft } from "lucide-react";
import { useContent } from '@/context/ContentContext';
import { PlatformType } from '@/types/content';
import PlatformIcons from '@/components/common/PlatformIcons';
import { useTranslations } from 'next-intl';

interface ContentCardProps {
  content: {
    id: number;
    title: string;
    details: string;
    date: string;
    type: string;
    format: string;
    timeFrame: string;
    tags: string;
    is_completed: boolean;
    platforms: PlatformType[];
  };
  viewType?: 'grid' | 'list';
}

const ContentCard: React.FC<ContentCardProps> = ({ content, viewType = 'grid' }) => {
  const {
    selectedItems,
    isSelectionMode,
    setSelectedItems,
    setSelectedContent,
    handleMarkAsCompleted,
    handleMarkAsIncomplete,
    formatDate
  } = useContent();
  const t = useTranslations('common.content');

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    if (isSelectionMode) {
      e.stopPropagation();
      if (selectedItems.includes(content.id)) {
        setSelectedItems(selectedItems.filter(id => id !== content.id));
      } else {
        setSelectedItems([...selectedItems, content.id]);
      }
    } else {
      setSelectedContent(content);
    }
  };

  // Liste görünümü
  if (viewType === 'list') {
    return (
      <div
        onClick={handleClick}
        className={`
          group relative
          bg-white dark:bg-slate-800/50 
          shadow-sm hover:shadow-md 
          transition-all duration-200 
          p-4 rounded-2xl
          ${isSelectionMode && selectedItems.includes(content.id) ? 'ring-2 ring-indigo-500/50' : ''}
          cursor-pointer
          border border-slate-200/50 dark:border-slate-700/50
        `}
      >
        {/* Mobil Liste Görünümü */}
        <div className="md:hidden flex items-center gap-3">
          <PlatformIcons platforms={content.platforms} />
          <h3 className={`flex-1 text-base font-medium line-clamp-1 ${
            content.is_completed 
              ? 'text-slate-500 dark:text-slate-400' 
              : 'text-slate-900 dark:text-slate-100'
          }`}>
            {content.title}
          </h3>
          {/* Status Badge */}
          {content.is_completed ? (
            <div className="shrink-0 bg-green-500/5 text-green-600 dark:bg-green-500/10 dark:text-green-400 px-2.5 py-1 rounded-full text-[11px] font-medium">
              {t('status.completed')}
            </div>
          ) : (
            <div className="shrink-0 bg-indigo-500/5 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 px-2.5 py-1 rounded-full text-[11px] font-medium">
              {t('status.active')}
            </div>
          )}
        </div>

        {/* Masaüstü Liste Görünümü */}
        <div className="hidden md:flex items-center gap-4">
          {/* Content Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <PlatformIcons platforms={content.platforms} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h3 className={`text-base font-medium truncate ${
                    content.is_completed 
                      ? 'text-slate-500 dark:text-slate-400' 
                      : 'text-slate-900 dark:text-slate-100'
                  }`}>
                    {content.title}
                  </h3>

                  {/* Status Badge */}
                  {content.is_completed ? (
                    <div className="bg-green-500/5 text-green-600 dark:bg-green-500/10 dark:text-green-400 px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0">
                      {t('status.completed')}
                    </div>
                  ) : (
                    <div className="bg-indigo-500/5 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0">
                      {t('status.active')}
                    </div>
                  )}
                </div>

                {/* Type & Format Badges */}
                <div className="flex gap-2 mt-2">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className={content.is_completed ? "text-slate-400" : ""}>
                      {content.date ? formatDate(content.date) : t('date.noDate')}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] ${
                    content.is_completed
                      ? 'bg-slate-100/50 text-slate-500 dark:bg-slate-700/30 dark:text-slate-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300'
                  }`}>
                    {content.type}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] ${
                    content.is_completed
                      ? 'bg-indigo-50/50 text-indigo-500/70 dark:bg-indigo-400/5 dark:text-indigo-400/70'
                      : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400'
                  }`}>
                    {content.format}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {!content.is_completed ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsCompleted(content.id);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20 rounded-lg text-xs transition-colors"
              >
                <Check className="w-3 h-3" />
                <span className="font-medium">{t('actions.complete')}</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsIncomplete(content.id);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 rounded-lg text-xs transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span className="font-medium">{t('actions.undo')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid görünümü (değişmedi)
  return (
    <div
      onClick={handleClick}
      className={`
        group relative min-h-[180px]
        ${content.is_completed 
          ? 'bg-slate-50/80 dark:bg-slate-800/30 border-slate-200/70' 
          : 'bg-white dark:bg-slate-800/50 border-slate-200/80'
        }
        border dark:border-slate-700/50 
        rounded-2xl 
        overflow-hidden 
        hover:shadow-lg 
        dark:hover:shadow-slate-700/10 
        transition-all 
        duration-200 
        backdrop-blur-sm
        ${isSelectionMode && selectedItems.includes(content.id) ? 'ring-2 ring-indigo-500/50' : ''}
      `}
    >
      {isSelectionMode && (
        <div className="absolute top-4 left-4 z-10">
          <input
            type="checkbox"
            checked={selectedItems.includes(content.id)}
            readOnly
            className="w-4 h-4 rounded-full border-slate-300 dark:border-slate-600"
          />
        </div>
      )}

      <div className="absolute top-4 right-4 z-10">
        {content.is_completed ? (
          <div className="bg-green-500/5 text-green-600 dark:bg-green-500/10 dark:text-green-400 px-2.5 py-1 rounded-full text-[11px] font-medium">
            {t('status.completed')}
          </div>
        ) : (
          <div className="bg-indigo-500/5 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 px-2.5 py-1 rounded-full text-[11px] font-medium">
            {t('status.active')}
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Date */}
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
          <Calendar className="w-3.5 h-3.5" />
          <span className={content.is_completed ? "text-slate-400" : ""}>
            {content.date ? formatDate(content.date) : t('date.noDate')}
          </span>
        </div>

        {/* Title with Platform Icons */}
        <div className="flex gap-3 items-start mt-5">
          <PlatformIcons platforms={content.platforms} />
          <h3 className={`text-base font-medium line-clamp-2 flex-1 ${
            content.is_completed 
              ? 'text-slate-500 dark:text-slate-400' 
              : 'text-slate-900 dark:text-slate-100'
          }`}>
            {content.title}
          </h3>
        </div>

        {/* Type & Format Badges */}
        <div className="flex flex-wrap gap-2 mt-6">
          <span className={`px-2.5 py-1 rounded-lg text-[11px] ${
            content.is_completed
              ? 'bg-slate-100/50 text-slate-500 dark:bg-slate-700/30 dark:text-slate-400'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300'
          }`}>
            {content.type}
          </span>
          <span className={`px-2.5 py-1 rounded-lg text-[11px] ${
            content.is_completed
              ? 'bg-indigo-50/50 text-indigo-500/70 dark:bg-indigo-400/5 dark:text-indigo-400/70'
              : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400'
          }`}>
            {content.format}
          </span>
        </div>

        {/* Hover Actions */}
        <div className={`absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
          content.is_completed
            ? 'from-slate-50 dark:from-slate-800/30'
            : 'from-white dark:from-slate-800/90'
        }`} />
        
        <div 
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          {!content.is_completed ? (
            <button
              onClick={() => handleMarkAsCompleted(content.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20 rounded-lg text-xs transition-colors"
            >
              <Check className="w-3 h-3" />
              <span className="font-medium">{t('actions.complete')}</span>
            </button>
          ) : (
            <button
              onClick={() => handleMarkAsIncomplete(content.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 rounded-lg text-xs transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="font-medium">{t('actions.undo')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;