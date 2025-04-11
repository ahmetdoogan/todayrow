"use client";

import React, { useEffect, useState } from "react";
import { Moon, User, Globe, MessageCircle, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from 'next-intl';

interface CustomCursorProps {
  x: number;
  y: number;
}

const CustomCursor = ({ x, y }: CustomCursorProps) => (
  <motion.div
    className="pointer-events-none fixed z-50"
    animate={{ x, y }}
    transition={{
      duration: 0.9,
      ease: "easeInOut"
    }}
    style={{ originX: 0, originY: 0 }}
  >
    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-orange-500 rotate-[-45deg]" />
  </motion.div>
);

interface SettingsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  type: string;
  active: boolean;
  t: (key: string) => string;
}

const SettingsCard = ({ icon: Icon, type, active, t }: SettingsCardProps) => (
  <div className={`p-2 sm:p-3 ${active ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'} rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300`}>
    <div className="flex gap-1.5 sm:gap-2.5">
      <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-500 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="text-[10px] sm:text-xs font-medium text-gray-900 dark:text-gray-100">{t(`cards.${type}.title`)}</h3>
        <p className="text-[9px] sm:text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{t(`cards.${type}.description`)}</p>
      </div>
    </div>
  </div>
);

export default function SettingsTutorialAnimation() {
  const t = useTranslations('welcome.animations.settings');
  
  const [mousePos, setMousePos] = useState({ x: 60, y: 40 });
  const [stepMessage, setStepMessage] = useState("theme");
  const [activeCard, setActiveCard] = useState<number | null>(0);

  const settingsCards = [
    { icon: Moon, type: 'theme' },
    { icon: Globe, type: 'language' },
    { icon: User, type: 'profile' },
    { icon: MessageCircle, type: 'contact' }
  ];

  useEffect(() => {
    let cancel = false;

    const animateCards = async () => {
      // First set mouse to sidebar button
      setMousePos({ x: 34, y: 90 });
      await new Promise(r => setTimeout(r, 800));
      if (cancel) return;
      
      while (!cancel) {
        for (let i = 0; i < settingsCards.length; i++) {
          if (cancel) break;

          setActiveCard(i);
          // Adjust mouse position based on screen size
          const posX = window.innerWidth < 640 ? 150 : 240;
          const offsetY = window.innerWidth < 640 ? 45 : 65;
          setMousePos({ x: posX, y: 50 + i * offsetY }); 
          setStepMessage(settingsCards[i].type);
          await new Promise(r => setTimeout(r, 1500));
        }
        
        // Return to sidebar button after cycling through all cards
        if (!cancel) {
          setMousePos({ x: 34, y: 90 });
          setActiveCard(null);
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    };

    animateCards();
    return () => { cancel = true };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-48 sm:h-64 bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      {/* Sidebar - Mobile Optimized with Navigation Buttons */}
      <div className="absolute left-0 top-0 h-full w-10 sm:w-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-3">
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 mb-3" />
        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gray-900 dark:bg-gray-700 text-white flex items-center justify-center mb-3 shadow-sm">
          <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      </div>

      {/* Settings Area */}
      <div className="absolute left-12 sm:left-20 right-2 sm:right-4 top-2 sm:top-4 bottom-2 sm:bottom-4 space-y-1.5 overflow-hidden p-1">
        {settingsCards.map((card, index) => (
          <SettingsCard
            key={index}
            icon={card.icon}
            type={card.type}
            active={activeCard === index}
            t={t}
          />
        ))}
      </div>

      {/* Custom Cursor */}
      <CustomCursor x={mousePos.x} y={mousePos.y} />

      {/* Step Message */}
      <div className="absolute bottom-3 left-0 right-0 text-center">
        <motion.div 
          key={stepMessage}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block bg-gray-900/5 dark:bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full"
        >
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{t(`steps.${stepMessage}`)}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}