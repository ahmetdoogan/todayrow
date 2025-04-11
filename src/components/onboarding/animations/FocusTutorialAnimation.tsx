"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, ListTodo, Layers } from "lucide-react";

// Özel Turuncu Fare İmleci
interface CustomCursorProps {
  x: number;
  y: number;
  isClicking: boolean;
}

const CustomCursor = ({ x, y, isClicking }: CustomCursorProps) => {
  return (
    <motion.div
      className="pointer-events-none fixed z-50"
      animate={{ x, y, scale: isClicking ? 0.9 : 1 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      style={{ originX: 0, originY: 0 }}
    >
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

const PomodoroTimerUI = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex justify-center mb-1 sm:mb-3">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 w-full max-w-[180px] sm:max-w-[220px] flex">
          <div className="bg-white dark:bg-gray-600 text-gray-800 dark:text-white rounded-md py-1 px-2 text-[10px] sm:text-xs font-medium flex-1 text-center shadow-sm">
            Pomodoro
          </div>
          <div className="text-gray-500 dark:text-gray-400 rounded-md py-1 px-2 text-[10px] sm:text-xs font-medium flex-1 text-center">
            Break
          </div>
        </div>
      </div>

      <div className="text-center mt-1 sm:mt-2 mb-1 sm:mb-3">
        <div className="text-2xl sm:text-4xl font-light mb-1 sm:mb-2 text-gray-900 dark:text-white">
          25:00
        </div>
        <div className="flex justify-center gap-2">
          <button className="bg-gray-800 dark:bg-gray-700 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shadow-sm">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <div className="h-0 w-0 border-l-[5px] sm:border-l-[6px] border-l-solid border-l-white ml-0.5 border-y-transparent border-y-[3px] sm:border-y-[4px] border-r-0" />
            </motion.div>
          </button>
          <button className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TasksUI = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-4 shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-1 sm:mb-2">
        <div className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white flex items-center">
          <ListTodo className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
          Tasks
        </div>
        <button className="text-[8px] sm:text-xs bg-gray-800 dark:bg-gray-700 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          >
            Add Task
          </motion.div>
        </button>
      </div>
      <div className="mt-1 sm:mt-2 border-t border-gray-100 dark:border-gray-700 pt-1 sm:pt-2">
        <div className="flex items-center py-1 sm:py-1.5">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-rose-400 mr-1 sm:mr-2" />
          <div className="text-[9px] sm:text-xs text-gray-700 dark:text-gray-300">Create focus timer UI</div>
        </div>
        <motion.div
          className="flex items-center py-1 sm:py-1.5"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center mr-1 sm:mr-2">
            <CheckCircle2 className="h-2 w-2 sm:h-3 sm:w-3 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 line-through">Update task status</div>
        </motion.div>
      </div>
      <div className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="text-[9px] sm:text-xs text-gray-600 dark:text-gray-400 flex items-center">
            <Layers className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 mr-0.5 sm:mr-1" />
            Projects
          </div>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-400 mr-1 sm:mr-1.5" />
            <span className="text-[9px] sm:text-xs text-gray-600 dark:text-gray-400">Todayrow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FocusTutorialAnimation() {
  const t = useTranslations("welcome.animations.focus");
  
  // Animation States
  const [step, setStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Mouse cursor animation
  const [cursorPosition, setCursorPosition] = useState({ x: 74, y: 74 });
  const [isClicking, setIsClicking] = useState(false);
  const [stepMessage, setStepMessage] = useState("sidebar");
  
  // Auto cycle through steps
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentStep = 0;
    let cancel = false;
    
    const steps = [
      // 1) Start at Focus icon in sidebar
      { pos: { x: 74, y: 74 }, delay: 1000, click: true },
      
      // 2) Move to Add Task button
      { pos: { x: 240, y: 150 }, delay: 1500, message: "sidebar", click: true, success: true },
      
      // 3) Move to Pomodoro timer play button
      { pos: { x: 150, y: 180 }, delay: 2000, message: "timer", click: true, success: true },
      
      // 4) Back to sidebar
      { pos: { x: 74, y: 74 }, delay: 1500, message: "sidebar" }
    ];
    
    const animateSteps = () => {
      if (cancel) return;
      
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        
        // Set cursor position and step message
        setCursorPosition(step.pos);
        if (step.message) setStepMessage(step.message);
        
        // Handle clicking animation
        if (step.click) {
          setTimeout(() => {
            if (cancel) return;
            setIsClicking(true);
            setTimeout(() => {
              if (cancel) return;
              setIsClicking(false);
            }, 200);
          }, 400);
        }
        
        // Handle success message
        if (step.success) {
          setTimeout(() => {
            if (cancel) return;
            setShowSuccess(true);
            setStep(currentStep === 1 ? 1 : 2); // Task or Timer message
          }, 800);
          
          setTimeout(() => {
            if (cancel) return;
            setShowSuccess(false);
          }, step.delay - 200);
        }
        
        // Move to next step
        timeoutId = setTimeout(() => {
          if (cancel) return;
          currentStep++;
          animateSteps();
        }, step.delay);
      } else {
        // Restart animation
        currentStep = 0;
        animateSteps();
      }
    };
    
    animateSteps();
    
    return () => {
      cancel = true;
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-48 sm:h-64 bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-10 sm:w-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-3">
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-900 dark:bg-gray-700 text-white flex items-center justify-center mb-3 shadow-sm">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
      </div>
      
      {/* Content */}
      <div className="absolute left-12 sm:left-20 right-2 sm:right-4 top-2 sm:top-4 bottom-2 sm:bottom-4 flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 pr-0 sm:pr-2 mb-2 sm:mb-0">
          <PomodoroTimerUI />
        </div>
        <div className="w-full sm:w-1/2 pl-0 sm:pl-2">
          <TasksUI />
        </div>
      </div>
      
      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            className="absolute right-28 top-4 bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-full shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {step === 1 ? t('steps.sidebar') : t('success')}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mouse Cursor */}
      <CustomCursor 
        x={cursorPosition.x} 
        y={cursorPosition.y} 
        isClicking={isClicking}
      />
      
      {/* Step Message */}
      <div className="absolute bottom-3 left-0 right-0 text-center">
        <motion.div 
          key={stepMessage}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block bg-gray-900/5 dark:bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full"
        >
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {step === 1 ? t('steps.sidebar') : step === 2 ? t('steps.timer') : t('steps.sidebar')}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
