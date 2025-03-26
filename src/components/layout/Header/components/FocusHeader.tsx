"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import BaseHeader from '@/components/layout/Header/components/BaseHeader';
import { Settings } from 'lucide-react';

interface FocusHeaderProps {
  onOpenSettings?: () => void;
}

export default function FocusHeader({ onOpenSettings }: FocusHeaderProps) {
  const t = useTranslations();

  return (
    <BaseHeader
      leftContent={null}
      middleContent={
        <h1 className="text-sm font-medium text-black dark:text-white">
          {t("focus.title", { defaultValue: "Focus" })}
        </h1>
      }
      rightContent={
        onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={t("focus.settings.title", { defaultValue: "Settings" })}
          >
            <Settings className="w-4 h-4" />
          </button>
        )
      }
      className="bg-stone-50"
      noPadding
      showThemeToggle={true}
    />
  );
}
