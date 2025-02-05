"use client";

import React, { useEffect, useState } from "react";
import { PencilLine, FolderPlus, Tag, Settings, Calendar, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from 'next-intl';

const CustomCursor = ({ x, y, isClicking }) => (
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

const CreateNoteArea = ({ active, t }) => (
  <div className={`flex-1 py-20 ${active ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'} rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors duration-300`}>
    <div className="flex flex-col items-center justify-center gap-2">
      <PencilLine className="w-8 h-8 text-gray-400" />
      <p className="text-sm font-medium text-gray-500">{t('labels.createFirst')}</p>
      <p className="text-xs text-gray-400">{t('labels.clickToStart')}</p>
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
        pos: { x: 60, y: 40 },
        wait: 800,
        click: true,
        success: true,
        activeArea: "sidebar" as const
      },
      // 2) Ana alan
      {
        pos: { x: 280, y: 140 },
        wait: 800,
        click: true,
        success: true,
        activeArea: "main" as const
      },
      // 3) Filtreler
      {
        pos: { x: 100, y: 90 },
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
      className="relative w-full h-64 bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      {/* Sidebar */}
      <div className="absolute left-2 top-2 w-24 h-60 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          className={`w-full px-3 py-2.5 bg-gray-900 dark:bg-gray-800 mb-2 transition-all duration-300 rounded-lg ${
            activeArea === "sidebar" ? 'scale-[1.02]' : ''
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <PencilLine className="w-4 h-4 text-white" />
            <span className="text-xs font-medium text-white">{t('labels.createNote')}</span>
          </div>
        </motion.button>

        <div className="px-2 mb-2">
          <div className={`p-2 rounded-lg transition-colors duration-300 ${
            activeArea === "filter" ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-700/50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <FolderPlus className="w-4 h-4 text-gray-500" />
              <Tag className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-red-400" />
              <div className="h-2 w-2 rounded-full bg-yellow-400" />
              <div className="h-2 w-2 rounded-full bg-green-400" />
            </div>
          </div>
        </div>

        <div className="px-2 space-y-1.5">
          <div className="h-9 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center px-3">
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <div className="h-9 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center px-3">
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="h-9 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center px-3">
            <Settings className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="absolute left-28 right-2 top-2 h-60">
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