"use client";

import React, { useEffect, useState } from "react";
import { Plus, Calendar, Clock, Search, FileText, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from 'next-intl';

interface CustomCursorProps {
  x: number;
  y: number;
  isClicking: boolean;
  isDragging: boolean;
}

const CustomCursor = ({ x, y, isClicking, isDragging }: CustomCursorProps) => (
  <motion.div
    className="pointer-events-none fixed z-50"
    animate={{ x, y, scale: isClicking ? 0.9 : 1 }}
    transition={{
      duration: 0.9,
      ease: "easeInOut",
    }}
    style={{ originX: 0, originY: 0 }}
  >
    <div 
      className={`
        w-0 h-0
        border-l-[6px] border-l-transparent
        border-r-[6px] border-r-transparent
        border-b-[10px]
        ${isDragging ? "border-b-orange-300" : "border-b-orange-500"}
        rotate-[-45deg]
      `}
    />
    {isDragging && (
      <motion.div
        className="absolute top-0 left-4 w-20 h-10 bg-orange-400/20 rounded-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    )}
  </motion.div>
);

const PlanTutorialAnimation = () => {
  const t = useTranslations('welcome.animations.plan');
  
  const [step, setStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 60, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [stepMessage, setStepMessage] = useState("sidebar");

  useEffect(() => {
    let cancel = false;

    const steps = [
      {
        x: 34,
        y: 40,
        wait: 800,
        click: true,
        success: true,
        message: "sidebar"
      },
      {
        x: 180,
        y: 120,
        wait: 800,
        click: true,
        success: true,
        message: "timeline"
      },
      {
        x: 300,
        y: 80,
        wait: 600,
        dragStart: true,
        message: "quickplans"
      },
      {
        x: 180,
        y: 120,
        wait: 1000,
        dragEnd: true,
        success: true
      },
      {
        x: 34,
        y: 40,
        wait: 1000
      }
    ];

    const runSteps = async () => {
      while (!cancel) {
        for (const step of steps) {
          if (cancel) break;
          
          setMousePos({ x: step.x, y: step.y });
          if (step.message) setStepMessage(step.message);
          
          await new Promise(r => setTimeout(r, step.wait));
          
          if (step.click) {
            setIsClicking(true);
            await new Promise(r => setTimeout(r, 200));
            setIsClicking(false);
          }
          
          if (step.dragStart) setIsDragging(true);
          if (step.dragEnd) setIsDragging(false);
          
          if (step.success) {
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
        {/* Mobile & Desktop aynı görünüm - kare butonlar */}
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-900 dark:bg-gray-700 text-white flex items-center justify-center mb-3 shadow-sm">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />  
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
      </div>

      {/* Timeline */}
      <div className="absolute left-12 sm:left-20 right-16 sm:right-24 top-2 sm:top-2 h-60 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 sm:p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{t('labels.today')}</span>
          <Clock className="w-4 h-4 text-gray-400" />
        </div>
        {[...Array(6)].map((_, i) => (
          <motion.div 
            key={i}
            className="flex items-center mb-2.5 group"
            whileHover={{ scale: 1.01 }}
          >
            <div className="w-10 sm:w-14 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              {`${(i + 8).toString().padStart(2, "0")}:00`}
            </div>
            <div className={`relative flex-grow h-6 sm:h-8 rounded-md transition-all duration-300
              ${(step === 1 && i === 2)
                ? 'bg-blue-50 dark:bg-blue-900/20'
                : 'bg-gray-50 dark:bg-gray-700/50 group-hover:bg-gray-100 dark:group-hover:bg-gray-700'
              }
            `} />
          </motion.div>
        ))}
      </div>

      {/* Quick Plans */}
      <div className="absolute right-2 top-2 w-12 sm:w-20 h-60 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1 sm:p-2">
        <div className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 sm:mb-2 px-0.5 sm:px-1 text-center sm:text-left">
          {t('labels.quickPlans')}
        </div>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className={`h-8 sm:h-10 mb-1.5 sm:mb-2 rounded-md p-1 sm:p-2 transition-all duration-300 
              ${isDragging && i === 0 
                ? 'bg-blue-500 dark:bg-blue-600 scale-105'
                : 'bg-gray-100 dark:bg-gray-700'
              }
            `}
          >
            <div className="w-full h-full flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${
                isDragging && i === 0 ? 'bg-white' : 'bg-gray-400'
              }`} />
              <div className={`h-1 flex-grow rounded-full ${
                isDragging && i === 0 ? 'bg-white/60' : 'bg-gray-300'
              }`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Custom Cursor */}
      <CustomCursor 
        x={mousePos.x} 
        y={mousePos.y}
        isClicking={isClicking}
        isDragging={isDragging}
      />

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
};

export default PlanTutorialAnimation;