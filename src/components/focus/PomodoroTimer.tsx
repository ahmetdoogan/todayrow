"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useFocus } from "@/context/FocusContext";
import * as focusService from "@/services/focus";
import { motion } from "framer-motion";

export default function PomodoroTimer() {
  const t = useTranslations();
  const {
    activeTimerType,
    setActiveTimerType,
    timeLeft,
    setTimeLeft,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    activeTask,
    currentSession,
    // EKLENDİ:
    setIsRunning,
    settings,
  } = useFocus();

  // Mobil / Masaüstü ayrımı
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Hover/active tab state
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Hover effects
  const handleMouseEnter = (tab: "pomodoro" | "short_break" | "long_break") => {
    // Aktif olmayan tab üzerine gelince hover göster
    if (tab !== activeTimerType) {
      setHoveredTab(tab);
    }
  };

  const handleMouseLeave = () => {
    // Hover durumunu temizle
    setHoveredTab(null);
  };

  // Tıklama işleminde de hover durumunu temizle
  const handleTabChange = (tab: "pomodoro" | "short_break" | "long_break") => {
    setHoveredTab(null); // Hover durumunu temizle
    
    // Önce timerı durdurun
    setIsRunning(false);
    
    // Aktif tabı değiştirin
    setActiveTimerType(tab);
    
    // Mevcut tab değerine göre süreyi ayarlayın (async state güncelleme sorunundan kaynaklanmasın diye doğrudan tab parametresini kullanın)
    if (tab === "pomodoro") {
      setTimeLeft(settings.pomodoroLength * 60);
    } else if (tab === "short_break") {
      setTimeLeft(settings.shortBreakLength * 60);
    } else if (tab === "long_break") {
      setTimeLeft(settings.longBreakLength * 60);
    }
    
    // Aktif oturumu iptal edin (resetTimer'dan bu kısmı alıyoruz)
    if (currentSession) {
    focusService
    .cancelSession(currentSession.id)
    .then(() => {
      // Session iptal edildi, ana context'in durumu güncelleyecek
          console.log("Session canceled");
        })
        .catch((error) => console.error("Error canceling session:", error));
    }
  };

  // Tab metinleri - yardımcı fonksiyon
  const getTabText = (tab: string) => {
    if (isMobile) {
      switch (tab) {
        case "pomodoro":
          return "Pomo";
        case "short_break":
          return "Break";
        case "long_break":
          return "L.Break";
        default:
          return "";
      }
    } else {
      switch (tab) {
        case "pomodoro":
          return "Pomodoro";
        case "short_break":
          return "Short Break";
        case "long_break":
          return "Long Break";
        default:
          return "";
      }
    }
  };

  // Timer format
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
      {/* Sekmeler */}
      <div className="flex justify-center mb-5 sm:mb-8">
        <div className="relative rounded-xl shadow-inner bg-gray-100 dark:bg-gray-800/70 p-1 w-full max-w-md">
          {/* Sekme Arka Planı */}
          <div className="grid grid-cols-3 gap-1 relative tracking-tight">
            {/* Tab Highlight (Active/Selected) */}
            <div
              className="absolute inset-y-0.5 rounded-xl bg-white dark:bg-zinc-700 dark:border dark:border-zinc-600/50 shadow-sm
                         transition-all duration-200 ease-out"
              style={{
                left:
                  activeTimerType === "pomodoro"
                    ? "1%"
                    : activeTimerType === "short_break"
                    ? "34.3%"
                    : "67.6%",
                width: "31.5%",
              }}
            />

            {/* Hover Highlight */}
            {hoveredTab && hoveredTab !== activeTimerType && (
              <div
                className="absolute inset-y-0.5 rounded-xl bg-gray-300/70 dark:bg-gray-600/40
                           transition-all duration-150 ease-out"
                style={{
                  left:
                    hoveredTab === "pomodoro"
                      ? "1%"
                      : hoveredTab === "short_break"
                      ? "34.3%"
                      : "67.6%",
                  width: "31.5%",
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Tab Butonları */}
            <button
              className={`relative z-10 m-0.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl
                           flex items-center justify-center text-center
                         ${
                           activeTimerType === "pomodoro"
                             ? "text-gray-900 dark:text-white"
                             : "text-gray-600 dark:text-gray-400"
                         }`}
              onClick={() => handleTabChange("pomodoro")}
              onPointerEnter={() => handleMouseEnter("pomodoro")}
              onPointerLeave={handleMouseLeave}
            >
              {getTabText("pomodoro")}
            </button>

            <button
              className={`relative z-10 m-0.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl
                           flex items-center justify-center text-center
                         ${
                           activeTimerType === "short_break"
                             ? "text-gray-900 dark:text-white"
                             : "text-gray-600 dark:text-gray-400"
                         }`}
              onClick={() => handleTabChange("short_break")}
              onPointerEnter={() => handleMouseEnter("short_break")}
              onPointerLeave={handleMouseLeave}
            >
              {getTabText("short_break")}
            </button>

            <button
              className={`relative z-10 m-0.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl
                           flex items-center justify-center text-center
                         ${
                           activeTimerType === "long_break"
                             ? "text-gray-900 dark:text-white"
                             : "text-gray-600 dark:text-gray-400"
                         }`}
              onClick={() => handleTabChange("long_break")}
              onPointerEnter={() => handleMouseEnter("long_break")}
              onPointerLeave={handleMouseLeave}
            >
              {getTabText("long_break")}
            </button>
          </div>
        </div>
      </div>

      {/* Sayaç */}
      <div className="text-center mb-8">
        <motion.div
          className="text-7xl sm:text-8xl font-extralight mb-4 sm:mb-6 text-black dark:text-white tracking-tight"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {formatTime(timeLeft)}
        </motion.div>

        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {isRunning ? (
            <button
              onClick={pauseTimer}
              className="flex items-center justify-center bg-stone-800 hover:bg-stone-900 dark:bg-zinc-700 
                         dark:hover:bg-zinc-600 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 
                         transition-colors shadow-md hover:shadow-lg"
            >
              <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : (
            <button
              onClick={() => {
                try {
                  startTimer();
                } catch (err) {
                  console.error("startTimer error:", err);
                  // Fallback - sadece UI göster ama DB'ye kaydetme
                  setIsRunning(true);
                }
              }}
              className="flex items-center justify-center bg-stone-800 hover:bg-stone-900 dark:bg-zinc-700 
                         dark:hover:bg-zinc-600 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 
                         transition-colors shadow-md hover:shadow-lg"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 sm:ml-1" />
            </button>
          )}

          <button
            onClick={resetTimer}
            className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 
                      dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full w-12 h-12 sm:w-14 sm:h-14 
                      transition-colors shadow-md hover:shadow-lg"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </motion.div>
      </div>

      {/* Alt Kısım */}
      <motion.div
        className="text-center text-gray-600 dark:text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        {activeTimerType === "pomodoro" ? (
          <>
            #1 <br />
            {activeTask
              ? activeTask.title
              : t("focus.taskList.whatAreYouWorkingOn")}
          </>
        ) : activeTimerType === "short_break" ? (
          t("focus.tabs.shortBreak")
        ) : (
          t("focus.tabs.longBreak")
        )}
      </motion.div>
    </div>
  );
}
