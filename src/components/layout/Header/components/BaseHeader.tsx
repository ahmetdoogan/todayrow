"use client";

import React from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Sun, Moon } from "lucide-react";
import { useTranslations } from 'next-intl';

interface BaseHeaderProps {
  leftContent?: React.ReactNode;
  middleContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
  showThemeToggle?: boolean;
  noPadding?: boolean;
}

const BaseHeader: React.FC<BaseHeaderProps> = ({
  leftContent,
  middleContent,
  rightContent,
  className = '',
  showThemeToggle = true,
  noPadding = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations();
  const isDark = theme === 'dark';

  return (
    <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div className="py-3">
        <div className={!noPadding ? 'px-4' : ''}>
          <header className={`
            bg-stone-50 dark:bg-slate-800/50 -mt-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-700
            rounded-xl
            ${noPadding ? 'p-2' : 'p-4'}
            ${className}
          `}>
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                {leftContent}
              </div>

              <div className="flex-1 flex justify-center">
                {middleContent}
              </div>

              <div className="flex items-center gap-3">
                {rightContent}
                
                {showThemeToggle && (
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={isDark ? t('common.theme.toggleLight') : t('common.theme.toggleDark')}
                  >
                    {isDark ? (
                      <Sun className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Moon className="h-5 w-5 text-gray-600 hover:text-gray-700" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </header>
        </div>
      </div>
    </div>
  );
};

export default BaseHeader;