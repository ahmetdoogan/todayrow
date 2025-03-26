"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Clock,
  Calendar,
  BarChart2,
  CheckCircle,
  Target,
  Award,
} from "lucide-react";
import { useFocus } from "@/context/FocusContext";

export default function StatsDisplay() {
  const t = useTranslations();
  const { stats, isLoadingStats, tasks, projects } = useFocus();

  // İstatistik durumları
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [totalTasksCount, setTotalTasksCount] = useState(0);
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [mostActiveProject, setMostActiveProject] = useState<{
    title: string;
    color: string;
  } | null>(null);

  // Genişletme/daraltma durumu
  const [isExpanded, setIsExpanded] = useState(false);

  // Görev ve proje sayıları hesaplama
  useEffect(() => {
    if (tasks) {
      setCompletedTasksCount(tasks.filter((t) => t.is_completed).length);
      setTotalTasksCount(tasks.length);
    }

    if (projects) {
      setActiveProjectsCount(projects.length);

      // En çok görevi olan projeyi bul
      const projectTaskCounts = projects.map((project) => {
        const tasksInProject = tasks.filter(
          (task) => task.project_id === project.id
        );
        return {
          project,
          count: tasksInProject.length,
        };
      });

      const mostActive = projectTaskCounts.sort((a, b) => b.count - a.count)[0];
      if (mostActive && mostActive.count > 0) {
        setMostActiveProject({
          title: mostActive.project.title,
          color: mostActive.project.color,
        });
      }
    }
  }, [tasks, projects]);

  // Görev tamamlama yüzdesi
  const getTaskCompletionRate = () => {
    if (totalTasksCount === 0) return 0;
    return Math.round((completedTasksCount / totalTasksCount) * 100);
  };

  // Yükleniyorsa
  if (isLoadingStats) {
    return (
      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          {t("common.loading")}
        </p>
      </div>
    );
  }

  // Veri yoksa
  if (!stats) {
    return null;
  }

  // Günleri focus.stats.daysShort altından okuyalım:
  const daysOfWeek = [
    t("focus.stats.daysShort.mon"),
    t("focus.stats.daysShort.tue"),
    t("focus.stats.daysShort.wed"),
    t("focus.stats.daysShort.thu"),
    t("focus.stats.daysShort.fri"),
    t("focus.stats.daysShort.sat"),
    t("focus.stats.daysShort.sun"),
  ];

  // Bu fonksiyon artık gerekli değil, doğrudan JSX içinde kullanıyoruz

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 shadow-sm">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          {t("focus.stats.title")}
        </h2>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      <AnimatePresence initial={false}>
        {!isExpanded ? (
          <motion.div
            key="summary"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-4 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4">
            {/* Özet istatistikler - Sol */}
            <div className="space-y-2">
            <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
            {t("common.today")}:
            </span>
            <span className="text-sm font-medium md:hidden text-gray-800 dark:text-gray-200">
            {stats.today.pomodoros}
            </span>
            <span className="text-sm font-medium hidden md:inline text-gray-800 dark:text-gray-200">
            {stats.today.pomodoros} pomodoro
            </span>
              </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("focus.stats.totalLabel")}:
                  </span>
                  <span className="text-sm font-medium md:hidden text-gray-800 dark:text-gray-200">
                    {stats.allTime.pomodoros}
                  </span>
                  <span className="text-sm font-medium hidden md:inline text-gray-800 dark:text-gray-200">
                    {stats.allTime.pomodoros} pomodoro
                  </span>
                </div>
              </div>

              {/* Özet istatistikler - Sağ */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("focus.stats.completedTasks")}:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {completedTasksCount}/{totalTasksCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("focus.stats.activeProjects")}:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {activeProjectsCount}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-4 overflow-hidden"
          >
            <div className="space-y-3">
              {/* Kart 1: Zaman Takibi */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-200 dark:border-gray-600/90">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-500" />
                  {t("focus.stats.timeTracking")}
                </h3>
                <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-600/90 mt-3">
                  <table className="w-full text-sm text-gray-800 dark:text-gray-200">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-600/90 bg-white dark:bg-gray-800/80">
                        <th className="p-1 text-left"></th>
                        <th className="p-1 text-center">
                          {t("focus.stats.todayPomodoros")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 dark:border-gray-600/90">
                        <td className="p-1 font-medium">{t("common.today")}</td>
                        <td className="p-1 text-center">
                          {stats.today.pomodoros}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1 font-medium">
                          {t("focus.stats.totalLabel")}
                        </td>
                        <td className="p-1 text-center">
                          {stats.allTime.pomodoros}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Kart 2: Görev İlerlemesi */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-200 dark:border-gray-600/90">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                  {t("focus.stats.taskProgress")}
                </h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {t("focus.stats.completedTasks")}
                      </span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {completedTasksCount}/{totalTasksCount}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${getTaskCompletionRate()}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {t("focus.stats.activeProjects")}:
                      </span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {activeProjectsCount}
                      </span>
                    </div>
                    {mostActiveProject && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {t("focus.stats.mostActiveProject")}:
                        </span>
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-1 flex-shrink-0"
                            style={{ backgroundColor: mostActiveProject.color }}
                          ></div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                            {mostActiveProject.title}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Kart 3: Başarımlar */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-200 dark:border-gray-600/90">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-gray-500" />
                  {t("focus.stats.achievements")}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {/* İlk Pomodoro Başarımı - dinamik olarak kontrol ediliyor */}
                  {stats.allTime.pomodoros > 0 && (
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-md border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                          {t("focus.stats.firstPomodoro")}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t("focus.stats.completed")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Weekly Overview kaldırıldı */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
