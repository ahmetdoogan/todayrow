"use client";
import React from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import SettingsHeader from '@/components/layout/Header/components/SettingsHeader';
import SettingsLayout from '@/components/settings/SettingsLayout';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <SettingsHeader 
        darkMode={theme === 'dark'}
        toggleTheme={toggleTheme}
      />

      <div className="max-w-4xl mx-auto">
        <SettingsLayout />
      </div>
    </>
  );
}