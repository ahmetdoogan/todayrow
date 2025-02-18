"use client";
import React, { useState } from 'react';
import { Sun, Moon, Bell, User, Lock, HelpCircle, Languages, Mail, ListPlus } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';
import WelcomePopup from "@/components/onboarding/WelcomePopup";
import ChangePasswordModal from '@/components/auth/ChangePasswordModal';
import { useTranslations } from 'next-intl';

const SettingsLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const t = useTranslations('common');

  const handleShowWelcome = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { has_seen_welcome: false }
      });

      if (error) throw error;
      setShowWelcome(true);
    } catch (error) {
      console.error("Error updating user metadata:", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 px-4"
    >
      {/* Görünüm Ayarları */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
          {t('settings.sections.appearance.title')}
        </h2>
        
        <div className="space-y-px">
          {/* Karanlık Mod */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 first:rounded-t-2xl last:rounded-b-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? 
                  <Moon className="w-5 h-5 text-slate-700 dark:text-slate-400" /> : 
                  <Sun className="w-5 h-5 text-slate-700 dark:text-slate-400" />
                }
                <span className="text-slate-700 dark:text-slate-300 text-sm">{t('settings.theme')}</span>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-700"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Dil Seçimi */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 first:rounded-t-2xl last:rounded-b-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 text-slate-700 dark:text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300 text-sm">{t('settings.language')}</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'tr' | 'en')}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm px-3 py-1.5"
              >
                <option value="tr">{t('settings.languages.tr')}</option>
                <option value="en">{t('settings.languages.en')}</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bildirimler */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
          {t('settings.sections.notifications.title')}
        </h2>
        
        <div className="space-y-px">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 first:rounded-t-2xl last:rounded-b-2xl p-4 opacity-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-700 dark:text-slate-400" />
                <div>
                  <div className="text-sm text-slate-700 dark:text-slate-300">
                    {t('settings.sections.notifications.email.title')}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('settings.sections.notifications.email.description')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hesap ve Güvenlik */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
          {t('settings.sections.accountSecurity.title')}
        </h2>
        
        <div className="space-y-px">
          <Link 
            href="/dashboard/settings/profile"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 first:rounded-t-2xl last:rounded-b-2xl p-4 block hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-700 dark:text-slate-400" />
                <div>
                  <div className="text-sm text-slate-700 dark:text-slate-300">
                    {t('settings.sections.accountSecurity.profile.title')}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('settings.sections.accountSecurity.profile.description')}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Şifre Değiştirme */}
          {user?.app_metadata?.providers?.includes('email') && (
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 first:rounded-t-2xl last:rounded-b-2xl p-4 w-full text-left block hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-slate-700 dark:text-slate-400" />
                  <div>
                    <div className="text-sm text-slate-700 dark:text-slate-300">
                      {t('settings.sections.accountSecurity.security.title')}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('settings.sections.accountSecurity.security.description')}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          )}
        </div>
      </motion.div>

      {/* Yardım ve Destek */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
          {t('settings.sections.helpSupport.title')}
        </h2>
        
        <div className="space-y-px">
          {/* Hoşgeldin Rehberi */}
          <button 
            onClick={handleShowWelcome}
            className="w-full text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 first:rounded-t-2xl last:rounded-b-2xl p-4 block hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-slate-700 dark:text-slate-400" />
                <div>
                  <div className="text-sm text-slate-700 dark:text-slate-300">
                    {t('settings.sections.helpSupport.guide.title')}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('settings.sections.helpSupport.guide.description')}
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* İletişim Butonu */}
          <a 
            href="mailto:hello@todayrow.app"
            className="w-full text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 block hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-700 dark:text-slate-400" />
                <div>
                  <div className="text-sm text-slate-700 dark:text-slate-300">
                    {t('settings.sections.helpSupport.contact.title')}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('settings.sections.helpSupport.contact.description')}
                  </div>
                </div>
              </div>
            </div>
          </a>

          {/* Özellik Talepleri Butonu */}
          <Link 
            href="/dashboard/feature-requests"
            className="w-full text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 last:rounded-b-2xl p-4 block hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ListPlus className="w-5 h-5 text-slate-700 dark:text-slate-400" />
                <div>
                  <div className="text-sm text-slate-700 dark:text-slate-300">
                    {t('settings.sections.helpSupport.featureRequests.title')}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('settings.sections.helpSupport.featureRequests.description')}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Bilgi Notu */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 text-sm text-slate-500 dark:text-slate-400"
      >
        <p className="mb-1">• {t('settings.info.active')}</p>
        <p className="mb-1">• {t('settings.info.coming')}</p>
        <p>• {t('settings.info.withAuth')}</p>
      </motion.div>

      {/* Welcome Popup */}
      {showWelcome && (
        <WelcomePopup onClose={() => setShowWelcome(false)} />
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </motion.div>
  );
};

export default SettingsLayout;