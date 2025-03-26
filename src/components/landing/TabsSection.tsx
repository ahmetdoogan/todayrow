import React from "react";
import {
  Calendar,
  Clock,
  Bell,
  Clipboard,
  Check,
  Plus,
  Play,
  RotateCcw,
} from "lucide-react";
import { VercelTabs } from "@/components/ui/vercel-tabs";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface Tab {
  id: string;
  label: string;
  content: string;
  icon?: JSX.Element;
}

interface TabsSectionProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

export default function TabsSection({
  tabs,
  activeTab,
  setActiveTab,
}: TabsSectionProps) {
  const t = useTranslations();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Sekme başlıkları */}
      <div
        className="px-6 pt-4 border-b border-gray-200 dark:border-gray-700 flex whitespace-nowrap relative overflow-x-auto overflow-y-hidden"
      >
        <VercelTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId)}
          className="mx-auto"
        />
      </div>

      {/* Sekme içerikleri */}
      <div className="p-6 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 max-w-5xl mx-auto">
          {/* Soldaki metinler */}
          <motion.div
            className="w-full md:w-1/2"
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
              {t(`landing.newLanding.tabs.${activeTab}.title`)}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm">
              {t(`landing.newLanding.tabs.${activeTab}.content`)}
            </p>

            <ul className="space-y-3">
              {/* PLANNING */}
              {activeTab === "planning" && (
                <>
                  <li className="flex items-start gap-3 p-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <Check className="w-4 h-4 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {t("landing.newLanding.tabs.planning.items.prioritize.title")}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t("landing.newLanding.tabs.planning.items.prioritize.description")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <Check className="w-4 h-4 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {t("landing.newLanding.tabs.planning.items.planTomorrow.title")}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t("landing.newLanding.tabs.planning.items.planTomorrow.description")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <Check className="w-4 h-4 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {t("landing.newLanding.tabs.planning.items.reduceMental.title")}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t("landing.newLanding.tabs.planning.items.reduceMental.description")}
                      </p>
                    </div>
                  </li>
                </>
              )}

              {/* FOCUS */}
              {activeTab === "focus" && (
                <>
                  <li className="flex items-start gap-3 p-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <Check className="w-4 h-4 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {t("landing.newLanding.tabs.focus.items.interface.title")}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t("landing.newLanding.tabs.focus.items.interface.description")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <Check className="w-4 h-4 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {t("landing.newLanding.tabs.focus.items.timer.title")}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t("landing.newLanding.tabs.focus.items.timer.description")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <Check className="w-4 h-4 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {t("landing.newLanding.tabs.focus.items.tracking.title")}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t("landing.newLanding.tabs.focus.items.tracking.description")}
                      </p>
                    </div>
                  </li>
                </>
              )}

              {/* REMINDERS */}
              {activeTab === "reminders" && (
                <>
                  <li className="flex items-start gap-3 p-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <Check className="w-4 h-4 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {t("landing.newLanding.tabs.reminders.items.smart.title")}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t("landing.newLanding.tabs.reminders.items.smart.description")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <Check className="w-4 h-4 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {t("landing.newLanding.tabs.reminders.items.browser.title")}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t("landing.newLanding.tabs.reminders.items.browser.description")}
                      </p>
                    </div>
                  </li>
                  {/* Üçüncü item (timing) çıkarıldı */}
                </>
              )}

              {/* NOTES */}
              {activeTab === "notes" && (
                <>
                  <li className="flex items-start gap-3 p-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <Check className="w-4 h-4 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {t("landing.newLanding.tabs.notes.items.capture.title")}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t("landing.newLanding.tabs.notes.items.capture.description")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <Check className="w-4 h-4 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {t("landing.newLanding.tabs.notes.items.connected.title")}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t("landing.newLanding.tabs.notes.items.connected.description")}
                      </p>
                    </div>
                  </li>
                  {/* Üçüncü item (organization) çıkarıldı */}
                </>
              )}
            </ul>
          </motion.div>

          {/* Sağdaki “kart” örnekleri, md ve üstü ekranlarda sabit 520px yükseklik */}
          <motion.div
            className="w-full md:w-1/2 rounded-xl relative border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-center h-auto md:h-[520px] p-4"
            key={`${activeTab}-screen`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dekoratif daireler */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-gray-100/60 to-gray-100/30 dark:from-gray-700/30 dark:to-gray-700/10 rounded-full -z-10 blur-xl opacity-70" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-tl from-gray-100/60 to-gray-100/30 dark:from-gray-700/30 dark:to-gray-700/10 rounded-full -z-10 blur-xl opacity-70" />

            {/* Asıl iç kart */}
            {/* PLANNING UI */}
            {activeTab === "planning" && (
              <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-medium text-gray-700 dark:text-gray-300 text-base">
                    {t("landing.newLanding.tabs.planning.ui.today")}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t("landing.newLanding.tabs.planning.ui.date")}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg border-l-4 border-indigo-500 dark:border-indigo-400 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-5 h-5 border border-gray-300 dark:border-gray-600 rounded-full bg-indigo-500 dark:bg-indigo-400 text-white">
                        <Check className="w-3 h-3" />
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {t("landing.newLanding.tabs.planning.ui.finishProject")}
                      </div>
                    </div>
                    <div className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
                      {t("landing.newLanding.tabs.planning.ui.high")}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg border-l-4 border-blue-500 dark:border-blue-400 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-5 h-5 border border-gray-300 dark:border-gray-600 rounded-full" />
                      <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {t("landing.newLanding.tabs.planning.ui.teamMeeting")}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      15:00 - 16:00
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg border-l-4 border-gray-300 dark:border-gray-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-5 h-5 border border-gray-300 dark:border-gray-600 rounded-full" />
                      <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {t("landing.newLanding.tabs.planning.ui.reviewAnalytics")}
                      </div>
                    </div>
                    <div className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      {t("landing.newLanding.tabs.planning.ui.low")}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="font-medium text-gray-700 dark:text-gray-300 mb-2 text-base">
                      {t("landing.newLanding.tabs.planning.ui.tomorrow")}
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg border-l-4 border-yellow-500 dark:border-yellow-400 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-5 h-5 border border-gray-300 dark:border-gray-600 rounded-full" />
                        <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {t("landing.newLanding.tabs.planning.ui.clientPresentation")}
                        </div>
                      </div>
                      <div className="px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">
                        {t("landing.newLanding.tabs.planning.ui.medium")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FOCUS UI */}
            {activeTab === "focus" && (
              <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden p-6 flex flex-col items-center justify-center">
                {/* Pomodoro / Mola butonları */}
                <div className="mb-5 w-full">
                  <div className="relative rounded-xl bg-gray-100 dark:bg-gray-800/70 p-1 w-full max-w-md mx-auto shadow-inner">
                    <div className="grid grid-cols-3 gap-1 relative tracking-tight">
                      {/* Seçili sekme highlight'ı */}
                      <div className="absolute inset-y-0.5 left-[1%] w-[31.5%] rounded-xl bg-white dark:bg-zinc-700 border border-gray-100 dark:border-zinc-600/50 shadow transition-all duration-200" />
                      <button className="relative z-10 m-0.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl flex items-center justify-center text-gray-900 dark:text-white">
                        {t("landing.newLanding.tabs.focus.ui.pomodoro")}
                      </button>
                      <button className="relative z-10 m-0.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400">
                        {t("landing.newLanding.tabs.focus.ui.shortBreak")}
                      </button>
                      <button className="relative z-10 m-0.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400">
                        {t("landing.newLanding.tabs.focus.ui.longBreak")}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Timer */}
                <div className="text-center mb-8">
                  <div className="text-7xl font-extralight mb-4 text-black dark:text-white tracking-tight">
                    25:00
                  </div>
                  <div className="flex justify-center gap-4">
                    <button className="flex items-center justify-center bg-stone-800 hover:bg-stone-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-full w-12 h-12 transition-colors shadow hover:shadow-lg">
                      <Play className="w-4 h-4 ml-0.5" />
                    </button>
                    <button className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full w-12 h-12 transition-colors shadow hover:shadow-lg">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Alt kısım */}
                <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
                  #1 <br />
                  {t("landing.newLanding.tabs.focus.ui.whatWorking")}
                </div>
              </div>
            )}

            {/* REMINDERS UI */}
            {activeTab === "reminders" && (
              <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden p-6">
                {/* Başlık (ikon ve Pro Feature kaldırıldı) */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-base font-medium text-gray-700 dark:text-gray-300">
                    {t("landing.newLanding.tabs.reminders.title")}
                  </div>
                </div>
                {/* İki örnek hatırlatıcı */}
                <div className="space-y-4">
                  <div className="rounded-lg border-l-4 border-gray-300 dark:border-gray-600 border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                        {t("landing.newLanding.tabs.reminders.ui.teamMeeting")}
                      </div>
                      {/* Toggle Switch */}
                      <div className="relative inline-flex h-5 w-10 items-center rounded-full bg-gray-200 dark:bg-gray-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-5" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 rounded">
                        {`30${t("landing.newLanding.tabs.reminders.ui.before")}`}
                      </span>
                      <span>{t("landing.newLanding.tabs.reminders.ui.todayTime")}</span>
                    </div>
                  </div>

                  <div className="rounded-lg border-l-4 border-gray-300 dark:border-gray-600 border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                        {t("landing.newLanding.tabs.reminders.ui.clientPresentation")}
                      </div>
                      <div className="relative inline-flex h-5 w-10 items-center rounded-full bg-gray-200 dark:bg-gray-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-5" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 rounded">
                        {`10${t("landing.newLanding.tabs.reminders.ui.before")}`}
                      </span>
                      <span>{t("landing.newLanding.tabs.reminders.ui.tomorrowTime")}</span>
                    </div>
                  </div>
                </div>

                {/* Alt tarafta “Yeni bildirim ayarla” butonu */}
                <div className="mt-4 flex justify-center">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors">
                    <Plus className="w-4 h-4" />
                    {t("landing.newLanding.tabs.reminders.ui.setupNotification")}
                  </button>
                </div>
              </div>
            )}

            {/* NOTES UI */}
            {activeTab === "notes" && (
              <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden p-6">
                {/* Başlık (ikon kaldırıldı) */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-base font-medium text-gray-700 dark:text-gray-300">
                    {t("landing.newLanding.tabs.notes.title")}
                  </div>
                  <button className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                {/* İki not örneği */}
                <div className="space-y-4">
                  <div className="rounded-lg border-l-4 border-gray-300 dark:border-gray-600 border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100/50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-start gap-2">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {t("landing.newLanding.tabs.notes.ui.projectIdeas")}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {t("landing.newLanding.tabs.notes.ui.projectIdeaContent")}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 rounded">
                            {t("landing.newLanding.tabs.notes.ui.project")}
                          </span>
                          <span>{t("landing.newLanding.tabs.notes.ui.hoursAgo")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border-l-4 border-gray-300 dark:border-gray-600 border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100/50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-start gap-2">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {t("landing.newLanding.tabs.notes.ui.meetingAgenda")}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {t("landing.newLanding.tabs.notes.ui.meetingAgendaContent")}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 rounded">
                            {t("landing.newLanding.tabs.notes.ui.meeting")}
                          </span>
                          <span>{t("landing.newLanding.tabs.notes.ui.today")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Üçüncü not çıkarıldı */}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
