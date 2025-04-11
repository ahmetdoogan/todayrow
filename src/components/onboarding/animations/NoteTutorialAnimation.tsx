"use client";

import React, { useEffect, useState } from "react";
import { FileText, FolderPlus, Tag, Settings, Calendar, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from 'next-intl';

interface CustomCursorProps {
  x: number;
  y: number;
  isClicking: boolean;
}

const CustomCursor = ({ x, y, isClicking }: CustomCursorProps) => (
  <motion.div
    className="pointer-events-none fixed z-50"
    animate={{ x, y, scale: isClicking ? 0.9 : 1 }}
    transition={{
      duration: 0.9,
      ease: "easeInOut"
    }}
    style={{ originX: 0, originY: 0 }}
  >
    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-orange-500 rotate-[-45deg]" />
  </motion.div>
);

interface CreateNoteAreaProps {
  active: boolean;
  t: (key: string) => string;
}

const CreateNoteArea = ({ active, t }: CreateNoteAreaProps) => (
  <div className={`flex-1 py-16 sm:py-20 ${active ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'} rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors duration-300`}>
    <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
      <p className="text-xs sm:text-sm font-medium text-gray-500 text-center px-2">{t('labels.createFirst')}</p>
      <p className="text-[10px] sm:text-xs text-gray-400 text-center px-2">{t('labels.clickToStart')}</p>
    </div>
  </div>
);

export default function NoteTutorialAnimation() {
  const t = useTranslations('welcome.animations.notes');

  const [mousePos, setMousePos] = useState({ x: 60, y: 40 });
  const [isClicking, setIsClicking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState(0);
  const [activeArea, setActiveArea] = useState<"sidebar" | "main" | "filter" | null>(null);

  useEffect(() => {
    let cancel = false;

    const steps = [
      // 1) Sidebar butonu
      {
        pos: { x: 34, y: 40 },
        wait: 800,
        click: true,
        success: true,
        activeArea: "sidebar" as const
      },
      // 2) Ana alan
      {
        pos: { x: 240, y: 140 },
        wait: 800,
        click: true,
        success: true,
        activeArea: "main" as const
      },
      // 3) Filtreler
      {
        pos: { x: 34, y: 110 },
        wait: 800,
        click: true,
        activeArea: "filter" as const
      }
    ];

    const runSteps = async () => {
      while (!cancel) {
        for (let i = 0; i < steps.length; i++) {
          setStep(i);
          setMousePos(steps[i].pos);
          setActiveArea(steps[i].activeArea);
          
          await new Promise(r => setTimeout(r, steps[i].wait));
          if (cancel) return;

          if (steps[i].click) {
            setIsClicking(true);
            await new Promise(r => setTimeout(r, 200));
            setIsClicking(false);
          }

          if (steps[i].success) {
            setShowSuccess(true);
            await new Promise(r => setTimeout(r, 1000));
            setShowSuccess(false);
          }
        }
      }
    };

    runSteps();
    return () => { cancel = true };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-48 sm:h-64 bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      {/* Sidebar - Mobile Optimized Kare Butonlar */}
      <div className="absolute left-0 top-0 h-full w-10 sm:w-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-3">
        {/* Mobile & Desktop - aynı görünüm */}
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-900 dark:bg-gray-700 text-white flex items-center justify-center mb-3 shadow-sm">
          <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
      </div>

      {/* Main Area */}
      <div className="absolute left-12 sm:left-20 right-2 top-2 h-60">
        <CreateNoteArea active={activeArea === "main"} t={t} />
      </div>

      {/* Custom Cursor */}
      <CustomCursor x={mousePos.x} y={mousePos.y} isClicking={isClicking} />

      {/* Success Badge */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-28 top-4"
          >
            <div className="bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-full shadow-sm">
              {t('success')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Message */}
      <div className="absolute bottom-3 left-0 right-0 text-center">
        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block bg-gray-900/5 dark:bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full"
        >
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {t(`steps.${step === 0 ? 'sidebar' : step === 1 ? 'dragdrop' : 'filters'}`)}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}