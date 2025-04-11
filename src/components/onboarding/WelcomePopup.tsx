"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image"; // Image bileşenini import ediyoruz
import {
  LayoutDashboard,
  Layout,
  CalendarCheck,
  Settings,
  Clock,
  User,
  FileText
} from "lucide-react";
import { supabase } from "@/utils/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/ui/logo";
import { useTranslations } from 'next-intl';
import PlanTutorialAnimation from './animations/PlanTutorialAnimation';
import ContentTutorialAnimation from './animations/ContentTutorialAnimation';
import NoteTutorialAnimation from './animations/NoteTutorialAnimation';
import FocusTutorialAnimation from './animations/FocusTutorialAnimation';
import SettingsTutorialAnimation from './animations/SettingsTutorialAnimation';

interface Tab {
  id: string;
  icon: any;
  title: string;
  description: string;
  content: string;
}

interface WelcomePopupProps {
  onClose: () => void;
}

export default function WelcomePopup({ onClose }: WelcomePopupProps) {
  const { user } = useAuth();
  const [userName, setUserName] = useState("");
  const [selectedTab, setSelectedTab] = useState("plan");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const t = useTranslations('welcome');

  useEffect(() => {
    if (user?.user_metadata) {
      const fullName = user.user_metadata.full_name || "";
      setUserName(fullName.split(" ")[0]);
      setAvatarUrl(user.user_metadata.avatar_url);
    }
  }, [user]);

  const tabs: Tab[] = [
    {
      id: "plan",
      icon: LayoutDashboard,
      title: t('tabs.plan.title'),
      description: t('tabs.plan.description'),
      content: t('tabs.plan.content')
    },
    {
      id: "focus",
      icon: Clock,
      title: t('tabs.focus.title', { fallback: 'Focus' }),
      description: t('tabs.focus.description', { fallback: 'Stay focused with Pomodoro timer' }),
      content: t('tabs.focus.content', { fallback: 'Use the Pomodoro technique to manage your time. Create deep work sessions with the built-in timer, manage tasks and projects, and track your progress with detailed statistics.' })
    },
    {
      id: "notes",
      icon: FileText,
      title: t('tabs.notes.title'),
      description: t('tabs.notes.description'),
      content: t('tabs.notes.content')
    },
    {
      id: "content",
      icon: Layout,
      title: t('tabs.content.title'),
      description: t('tabs.content.description'),
      content: t('tabs.content.content')
    },
    {
      id: "settings",
      icon: Settings,
      title: t('tabs.settings.title'),
      description: t('tabs.settings.description'),
      content: t('tabs.settings.content')
    }
  ];

  const handleClose = async () => {
    try {
      // Popup kapandı bilgisini localStorage'a kaydedelim
      localStorage.setItem('has_seen_welcome', 'true');
      
      // Opsiyonel: Supabase'e de kaydedelim (gerekli değil ama ekstra önlem)
      await supabase.auth.updateUser({
        data: { has_seen_welcome: true }
      });
    } catch (error) {
      console.error('Error closing welcome popup:', error);
      // Hata olsa bile localStorage'a yazalım
      localStorage.setItem('has_seen_welcome', 'true');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 welcome-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <motion.div
          className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden max-h-[85vh] sm:max-h-none"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4 sm:gap-8 pr-4">
              <Logo className="h-5 sm:h-6 w-auto" />
              <div>
                <h2 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {userName ? t('title', { name: userName }) : t('titleGeneric')}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-[200px] sm:max-w-none">
                  {t('subtitle')}
                </p>
              </div>
            </div>
            {avatarUrl && (
              <Image
                src={avatarUrl}
                alt="Profile"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col sm:flex-row min-h-[40vh] sm:min-h-[400px] overflow-auto">
            {/* Left sidebar - Tabs (Desktop) */}
            <div className="hidden sm:block w-full sm:w-64 border-r border-gray-200 dark:border-gray-800 sm:p-4">
              <div className="flex flex-col gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                        ${selectedTab === tab.id 
                          ? 'bg-stone-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-stone-50 dark:hover:bg-gray-800/50'
                        }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium">{tab.title}</div>
                        <div className="text-xs mt-0.5 hidden sm:block text-gray-500 dark:text-gray-400">
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Tabs */}
            <div className="sm:hidden w-full p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-center gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`p-2 rounded-lg transition-colors
                        ${selectedTab === tab.id 
                          ? 'bg-stone-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                          : 'text-gray-600 dark:text-gray-400'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right content */}
            <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
              <div className="max-w-2xl mx-auto sm:mx-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center sm:text-left">
                  {tabs.find(t => t.id === selectedTab)?.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 text-center sm:text-left px-2 sm:px-0">
                  {tabs.find(t => t.id === selectedTab)?.content}
                </p>

                {/* Tutorial Animation Area - adjusting height for mobile */}
                <div className="h-48 sm:h-64">
                  {selectedTab === "plan" && <PlanTutorialAnimation />}
                  {selectedTab === "focus" && <FocusTutorialAnimation />}
                  {selectedTab === "content" && <ContentTutorialAnimation />}
                  {selectedTab === "notes" && <NoteTutorialAnimation />}
                  {selectedTab === "settings" && <SettingsTutorialAnimation />}
                  {selectedTab !== "plan" && selectedTab !== "focus" && selectedTab !== "content" && selectedTab !== "notes" && selectedTab !== "settings" && (
                    <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-600">
                      Çok yakında...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>


<div className="flex justify-between items-center gap-4 p-3 sm:p-6 border-t border-gray-200 dark:border-gray-800">
  {/* Sol tarafa bilgilendirici not ekle */}
  <p className="text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 flex-shrink">
    {t('reopenHint')}
  </p>

  {/* Sağ tarafa "Başlayalım" butonunu ekle */}
  <button
    onClick={handleClose}
    className="px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors whitespace-nowrap"
  >
    {t('buttons.start')}
  </button>
</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}