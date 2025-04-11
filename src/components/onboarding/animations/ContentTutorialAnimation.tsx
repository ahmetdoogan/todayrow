"use client";

import React, { useEffect, useState } from "react";
import { Layout, LineChart, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

//
// 1) Turuncu fare imleci
//
interface CustomCursorProps {
  x: number;
  y: number;
  isClicking: boolean;
}

const CustomCursor = ({ x, y, isClicking }: CustomCursorProps) => {
  return (
    <motion.div
      className="pointer-events-none fixed z-50"
      // Fare koordinatlarını pürüzsüz şekilde takip etsin
      animate={{ x, y, scale: isClicking ? 0.9 : 1 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      style={{ originX: 0, originY: 0 }}
    >
      {/* Turuncu ok ucu */}
      <div
        className={`
          w-0 h-0
          border-l-[6px] border-l-transparent
          border-r-[6px] border-r-transparent
          border-b-[10px]
          border-b-orange-500
          rotate-[-45deg]
        `}
      />
    </motion.div>
  );
};

//
// 2) Kart bileşeni
//
interface InfoCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  active: boolean;
}

const InfoCard = ({ icon: Icon, title, value, active }: InfoCardProps) => (
  <div
    className={`p-2 sm:p-3 ${active ? "bg-blue-50 dark:bg-blue-900/20" : "bg-white dark:bg-gray-800"
      } rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300`}
  >
    <div className="flex gap-1 sm:gap-2 mb-1 sm:mb-2">
      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
      <span className="text-[9px] sm:text-xs text-gray-500">{title}</span>
    </div>
    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{value}</div>
  </div>
);

//
// 3) Asıl animasyon bileşeni
//
export default function ContentTutorialAnimation() {
  // next-intl çeviri hook'u
  const t = useTranslations("welcome.animations.content");

  // Fare ve adım state'leri
  const [mousePos, setMousePos] = useState({ x: 60, y: 40 });
  const [isClicking, setIsClicking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [stepMessage, setStepMessage] = useState("create");

  //
  // 3.1) Animasyon adımları
  // pos: { x, y }, wait: bekleme ms, click/success: tıklama & başarı balonu
  // highlightCard: hangi kart vurgulanacak, message: çeviri için steps.create / steps.stats vb.
  //
  useEffect(() => {
    let cancel = false;

    const steps = [
      // 1) İçerik oluştur butonu
      {
        pos: { x: 34, y: 40 },
        wait: 800,
        click: true,
        success: true,
        message: "create",
      },
      // 2) Stats kartları
      {
        pos: { x: 100, y: 60 },
        wait: 800,
        message: "stats",
        highlightCard: 0,
      },
      {
        pos: { x: 280, y: 60 },
        wait: 800,
        highlightCard: 1,
      },
      {
        pos: { x: 460, y: 60 },
        wait: 800,
        highlightCard: 2,
      },
    ];

    // Sonsuz döngü şeklinde step’leri uygula
    const runSteps = async () => {
      while (!cancel) {
        for (const step of steps) {
          if (cancel) break;

          // Fare konumu güncelle
          setMousePos(step.pos);

          // Alt mesaj
          if (step.message) setStepMessage(step.message);

          // Kart vurgusu
          setActiveCard(step.highlightCard !== undefined ? step.highlightCard : null);

          // Bekleme
          await new Promise((r) => setTimeout(r, step.wait));
          if (cancel) break;

          // Tıkla
          if (step.click) {
            setIsClicking(true);
            await new Promise((r) => setTimeout(r, 200));
            setIsClicking(false);
          }

          // Başarı
          if (step.success) {
            setShowSuccess(true);
            await new Promise((r) => setTimeout(r, 1000));
            setShowSuccess(false);
          }
        }
        // Döngü bittiğinde en başa dön: fare sol butona
        setMousePos({ x: 34, y: 40 });
        setActiveCard(null);
      }
    };

    runSteps();

    return () => {
      cancel = true;
    };
  }, []);

  //
  // 4) Render
  //
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-48 sm:h-64 bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      {/* 4.1) Sol Sidebar - Mobile Optimized Kare Butonlar */}
      <div className="absolute left-0 top-0 h-full w-10 sm:w-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-3">
        {/* Mobile ve desktop aynı görünüm */}
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-900 dark:bg-gray-700 text-white flex items-center justify-center mb-3 shadow-sm">
          <Layout className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
      </div>

      {/* 4.2) İçerik Alanı */}
      <div className="absolute left-12 sm:left-20 right-2 sm:right-2 top-2 sm:top-2 h-44 sm:h-60">
        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-4">
          <InfoCard
            icon={Calendar}
            title={t("labels.monthlyTarget")}
            value={t("labels.targetCount")}
            active={activeCard === 0}
          />
          <InfoCard
            icon={LineChart}
            title={t("labels.activePlatform")}
            value={t("labels.platformName")}
            active={activeCard === 1}
          />
          <InfoCard
            icon={Calendar}
            title={t("labels.upcomingDeadline")}
            value={t("labels.deadlineCount")}
            active={activeCard === 2}
          />
        </div>

        {/* Boş içerik alanı */}
        <div className="flex items-center justify-center h-20 sm:h-32 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {t("labels.emptyState")}
          </div>
        </div>
      </div>

      {/* 4.3) Özel Fare */}
      <CustomCursor x={mousePos.x} y={mousePos.y} isClicking={isClicking} />

      {/* 4.4) “İçerik oluşturuldu!” bildirimi */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-28 top-4"
          >
            <div className="bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-full shadow-sm">
              {t("success")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4.5) Alt adım mesajı */}
      <div className="absolute bottom-3 left-0 right-0 text-center">
        <motion.div
          key={stepMessage}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block bg-gray-900/5 dark:bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full"
        >
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {t(`steps.${stepMessage}`)}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}