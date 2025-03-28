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
  // Type hatasını çözmek için eklediğimiz prop'lar:
  darkMode?: boolean;
  toggleTheme?: () => void;
}

const BaseHeader: React.FC<BaseHeaderProps> = ({
  leftContent,
  middleContent,
  rightContent,
  className = '',
  showThemeToggle = true,
  noPadding = false,
  darkMode,         // <-- Ekledik
  toggleTheme,      // <-- Ekledik
}) => {
  // Eğer parent darkMode/toggleTheme göndermediyse context'i kullan
  const { theme, toggleTheme: contextToggleTheme } = useTheme();
  const t = useTranslations();

  // Burada "dışarıdan gelen" varsa onu, yoksa context'i alır
  const isDark = darkMode ?? (theme === 'dark');
  const handleToggleTheme = toggleTheme ?? contextToggleTheme;

  return (
    <div className="sticky top-0 z-10">
      <div>
        <div className={!noPadding ? 'px-4' : ''}>
          <header
            className={`
              bg-stone-50 dark:bg-slate-800/50 shadow-sm 
              border border-gray-200 dark:border-gray-700
              rounded-xl text-black dark:text-white
              min-h-[48px]
              ${noPadding ? 'p-2' : 'p-4'}
              ${className}
            `}
          >
            <div className="flex justify-between items-center gap-4 relative">
              <div className="flex items-center gap-3">
                {leftContent}
              </div>

              <div className="absolute left-1/2 transform -translate-x-1/2">
                {middleContent}
              </div>

              <div className="flex items-center gap-3">
                {rightContent}

                {showThemeToggle && (
                  <button
                    onClick={handleToggleTheme}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-black dark:text-white"
                    aria-label={
                      isDark ? t('common.theme.toggleLight') : t('common.theme.toggleDark')
                    }
                  >
                    {isDark ? (
                      <Sun className="h-5 w-5 text-white hover:text-gray-300" />
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