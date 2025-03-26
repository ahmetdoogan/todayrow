"use client";

import React, { useState, useEffect } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { FocusProvider } from "@/context/FocusContext";
import FocusHeader from "@/components/layout/Header/components/FocusHeader";
import PomodoroTimer from "@/components/focus/PomodoroTimer";
import TaskList from "@/components/focus/TaskList";
import ProjectSelector from "@/components/focus/ProjectSelector";
import StatsDisplay from "@/components/focus/StatsDisplay";
import SettingsModal from "@/components/focus/SettingsModal";
import PricingModal from "@/components/modals/PricingModal";
import { motion, AnimatePresence } from "framer-motion";

/** Focus sayfası, tüm Pomodoro verilerini FocusProvider ile sarmalıyor. */
export default function FocusPage() {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const { isPro, isTrialing, status } = useSubscription();

  useEffect(() => {
    if (!isPro && !isTrialing && ["expired", "cancelled"].includes(status || "")) {
      setIsPricingModalOpen(true);
    }
  }, [isPro, isTrialing, status]);
  
  // Redirect non-pro users who try to close the pricing modal
  const handleClosePricingModal = () => {
    if (!isPro && !isTrialing && ["expired", "cancelled"].includes(status || "")) {
      // If they try to close it, redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      setIsPricingModalOpen(false);
    }
  };

  return (
    <FocusProvider>
      <div className="h-full flex flex-col">
        <div>
          <FocusHeader onOpenSettings={() => setIsSettingsModalOpen(true)} />
        </div>

        <div className="flex-1 overflow-auto mt-4 pb-8">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4">
            {/* Mobil için düz sıralama */}
            <div className="block lg:hidden space-y-4">
              {/* 1. Pomodoro Timer */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <PomodoroTimer />
              </motion.div>

              {/* 2. Tasks */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <TaskList />
              </motion.div>

              {/* 3. Projects */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <ProjectSelector />
              </motion.div>

              {/* 4. Statistics */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <StatsDisplay />
              </motion.div>
            </div>

            {/* Masaüstü için iki kolonlu görünüm */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-6">
              {/* Sol kolon */}
              <div className="lg:col-span-5 space-y-4">
                {/* Pomodoro Timer */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, x: -20 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <PomodoroTimer />
                </motion.div>

                {/* Statistics */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, x: -20 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <StatsDisplay />
                </motion.div>
              </div>

              {/* Sağ kolon */}
              <div className="lg:col-span-7 space-y-4">
                {/* Tasks */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, x: 20 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <TaskList />
                </motion.div>

                {/* Projects */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, x: 20 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <ProjectSelector />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <PricingModal
          isOpen={isPricingModalOpen}
          onClose={handleClosePricingModal}
          isTrialEnded={["expired"].includes(status || "")}
          subscriptionStatus={status}
        />
        
        <AnimatePresence>
          {isSettingsModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FocusProvider>
  );
}
