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

// 2) Bileşeni bu prop'ları alacak şekilde güncelliyoruz
const SettingsHeader: React.FC<SettingsHeaderProps> = ({ darkMode, toggleTheme }) => {
  const t = useTranslations();

  return (
    <BaseHeader
      leftContent={null}
      middleContent={
        <h1 className="text-sm font-medium text-black dark:text-white">
          {t('common.settings.title')}
        </h1>
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