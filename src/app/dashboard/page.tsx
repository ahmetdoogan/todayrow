"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PlannerHeader from "@/components/layout/Header/components/PlannerHeader";
import PlanList from "@/components/planner/PlanList";
import QuickPlans from "@/components/planner/QuickPlans";
import { usePlanner } from "@/context/PlannerContext";
import { useRouter } from "next/navigation";
import { ListPlus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const { plans, setSelectedPlan, setIsModalOpen } = usePlanner();
  const router = useRouter();

  // Mobilde FAB'e basınca açılan QuickPlans modalı
  const [isQuickPlansOpen, setIsQuickPlansOpen] = useState(false);

  // Drag sürerken butona tıklama vs. engellemek için
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const openPlanId = searchParams.get("openPlan");
    if (openPlanId) {
      const planToOpen = plans.find(
        (plan) => plan.id === parseInt(openPlanId)
      );
      if (planToOpen) {
        setSelectedPlan(planToOpen);
        setIsModalOpen(true);
        // URL'i temizle
        router.replace("/dashboard");
      }
    }
  }, [searchParams, plans, router, setSelectedPlan, setIsModalOpen]);

  // Drag başlarken tetiklenecek
  const handleDragStart = () => {
  setIsDragging(true);
  setIsQuickPlansOpen(false); // Modalı anında kapat
};

  // Drag bittikten sonra tetiklenecek
  const handleDragEnd = () => {
    setIsDragging(false);
    // Eğer drop başarıyla olduysa QuickPlans'ı kapatmak istiyorsak:
    // setIsQuickPlansOpen(false);
  };

  return (
    <div className="h-full flex flex-col relative">
      <PlannerHeader />

      <div className="flex-1 overflow-hidden flex">
        {/* Sol tarafta PlanList */}
        <div className="flex-1 overflow-y-auto">
          <PlanList />
        </div>

        {/* Masaüstünde sağ panel */}
        <div className="hidden md:block w-64 xl:w-72 border-l border-gray-200 dark:border-gray-800 overflow-auto">
          <QuickPlans />
        </div>
      </div>

      {/* Mobil için Floating Action Button */}
      <div className="md:hidden">
        <button
          // Drag sürerken tıklamayı engellemek için basit kontrol
          onClick={() => !isDragging && setIsQuickPlansOpen(true)}
          className="fixed right-4 bottom-20 z-[1000] w-14 h-14
                     bg-zinc-900 hover:bg-black/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-full
                     shadow-lg hover:shadow-xl flex items-center justify-center
                     transition-all duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <ListPlus size={24} />
        </button>
      </div>

      {/* Mobilde Modal olarak açılan QuickPlans */}
      <AnimatePresence>
        {isQuickPlansOpen && (
          <motion.div
            key="quickplans-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed md:hidden inset-0 bg-black/50 backdrop-blur-sm flex items-end z-[1000]"
            onClick={(e) => {
              // Modal dışına tıklayınca kapat
              if (e.target === e.currentTarget) setIsQuickPlansOpen(false);
            }}
          >
            <motion.div
              key="quickplans-modal"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="w-full bg-white dark:bg-gray-800 rounded-t-2xl
                         max-h-[80vh] overflow-auto touch-pan-y"
            >
              {/* QuickPlans'a drag callback'leri veriyoruz */}
              <QuickPlans
                onClose={() => setIsQuickPlansOpen(false)}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
