"use client";

import React from 'react';
import BaseHeader from './BaseHeader';
import { Settings } from "lucide-react";
import { useTranslations } from 'next-intl';

// 1) Burada interface yazarak darkMode ve toggleTheme prop'larını tanımlıyoruz
interface SettingsHeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

// 2) Bileşeni bu prop’ları alacak şekilde güncelliyoruz
const SettingsHeader: React.FC<SettingsHeaderProps> = ({ darkMode, toggleTheme }) => {
  const t = useTranslations();

  return (
    <BaseHeader
      leftContent={
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">{t('common.settings.title')}</span>
        </div>
      }
      className="bg-stone-50"
      noPadding
      // 3) BaseHeader'a da istersen bu prop'ları aynen iletebilirsin
      // Eğer BaseHeader "darkMode" ve "toggleTheme" ile bir şey yapıyorsa
      // BaseHeader'da da bu prop'ları tip olarak tanımlamalısın.
      darkMode={darkMode}
      toggleTheme={toggleTheme}
      showThemeToggle={true}
    />
  );
};

export default SettingsHeader;
