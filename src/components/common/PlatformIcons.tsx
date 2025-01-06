import React, { useMemo } from 'react';
import { PlatformType } from '@/types/content';
import PlatformIcon from './PlatformIcon';

interface PlatformIconsProps {
  platforms?: PlatformType[];
}

const PlatformIcons: React.FC<PlatformIconsProps> = ({ platforms = [] }) => {
  // Random bir platform seç
  const mainPlatform = useMemo(() => {
    if (platforms.length === 0) return null;
    if (platforms.length === 1) return platforms[0];
    const randomIndex = Math.floor(Math.random() * platforms.length);
    return platforms[randomIndex];
  }, [platforms]);

  const remaining = platforms.length > 1 ? platforms.length - 1 : 0;

  return (
    <div className="flex items-center">
      {mainPlatform && (
        <div className="relative">
          <PlatformIcon platform={mainPlatform} size="small" />
        </div>
      )}
      {remaining > 0 && (
        <div className="relative -ml-0.5 flex items-center justify-center w-4.5 h-4.5 bg-slate-100 dark:bg-slate-700 rounded-full">
          <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 px-1">
            +{remaining}
          </span>
        </div>
      )}
    </div>
  );
};

export default PlatformIcons;