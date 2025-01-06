"use client";
import React from 'react';
import { motion } from 'framer-motion';
import SettingsHeader from '@/components/layout/Header/components/SettingsHeader';
import { useTheme } from '@/components/providers/ThemeProvider';
import ProfileSettings from '@/components/settings/ProfileSettings';

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <>
      <SettingsHeader 
        darkMode={theme === 'dark'}
        toggleTheme={toggleTheme}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto px-4 space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Profil Bilgileri</h2>
          <ProfileSettings />
        </motion.div>
      </motion.div>
    </>
  );
}