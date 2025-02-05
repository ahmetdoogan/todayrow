"use client";

import React, { useEffect, useState } from "react";
import { Plus, Calendar, Clock, Search, FileText, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from 'next-intl';

const CustomCursor = ({ x, y, isClicking, isDragging }) => (
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
        x: 60,
        y: 40,
        wait: 800,
        click: true,
        success: true,
        message: "sidebar"
      },
      {
        x: 200,
        y: 120,
        wait: 800,
        click: true,
        success: true,
        message: "timeline"
      },
      {
        x: 320,
        y: 80,
        wait: 600,
        dragStart: true,
        message: "quickplans"
      },
      {
        x: 200,
        y: 120,
        wait: 1000,
        dragEnd: true,
        success: true
      },
      {
        x: 60,
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
      className="relative w-full h-64 bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      {/* Sidebar */}
      <div className="absolute left-2 top-2 w-24 h-60 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          className="w-full px-3 rounded-lg py-2.5 bg-gray-900 dark:bg-gray-800 mb-2 transition-all duration-300"
        >
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 text-white" />
            <span className="text-xs font-medium text-white">{t('labels.createPlan')}</span>
          </div>
        </motion.button>

        <div className="px-2 space-y-1.5">
          <div className="h-9 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center px-3">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <div className="h-9 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center px-3">
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <div className="h-9 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center px-3">
            <FileText className="w-4 h-4 text-gray-400" />
          </div>
          <div className="h-9 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center px-3">
            <Settings className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="absolute left-28 right-24 top-2 h-60 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
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
            <div className="w-14 text-xs text-gray-500 dark:text-gray-400">
              {`${(i + 8).toString().padStart(2, "0")}:00`}
            </div>
            <div className={`relative flex-grow h-8 rounded-md transition-all duration-300
              ${(step === 1 && i === 2)
                ? 'bg-blue-50 dark:bg-blue-900/20'
                : 'bg-gray-50 dark:bg-gray-700/50 group-hover:bg-gray-100 dark:group-hover:bg-gray-700'
              }
            `} />
          </motion.div>
        ))}
      </div>

      {/* Quick Plans */}
      <div className="absolute right-2 top-2 w-20 h-60 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">
          {t('labels.quickPlans')}
        </div>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className={`h-10 mb-2 rounded-md p-2 transition-all duration-300 
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