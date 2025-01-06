"use client";

import React from 'react';
import { PlatformType, PLATFORM_LABELS } from '@/types/content';
import PlatformIcon from '@/components/common/PlatformIcon';
import { useTranslations } from 'next-intl';

interface PlatformSelectorProps {
  selectedPlatforms: PlatformType[];
  onPlatformToggle: (platform: PlatformType) => void;
}

const PlatformSelector = ({ selectedPlatforms, onPlatformToggle }: PlatformSelectorProps) => {
  const t = useTranslations('common.content');

  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(PLATFORM_LABELS) as PlatformType[]).map((platform) => {
        const isSelected = selectedPlatforms.includes(platform);
        
        return (
          <button
            key={platform}
            type="button" // Bu satırı ekleyin
            onClick={() => onPlatformToggle(platform)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
              transition-all duration-200
              ${isSelected 
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}
            `}
          >
            <PlatformIcon platform={platform} />
            <span className="font-medium">{t(`platforms.${platform}`)}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSelector;