"use client";

import React from 'react';
import BaseHeader from './BaseHeader';
import { Settings } from "lucide-react";
import { useTranslations } from 'next-intl';

const SettingsHeader = () => {
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
      showThemeToggle={true}
    />
  );
};

export default SettingsHeader;