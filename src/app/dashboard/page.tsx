"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import PlannerHeader from "@/components/layout/Header/components/PlannerHeader";
import PlanList from "@/components/planner/PlanList";
import QuickPlans from "@/components/planner/QuickPlans";
import { usePlanner } from "@/context/PlannerContext";
import { useRouter } from "next/navigation";
import { ListPlus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { sendEvent } from '@/lib/analytics/ga-manager';
import { SuccessModal } from "@/components/modals/SuccessModal"; // Mevcut SuccessModal bileşeni

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const { plans, setSelectedPlan, setIsModalOpen } = usePlanner();
  const router = useRouter();

  // Mobilde FAB'e basınca açılan QuickPlans modalı
  const [isQuickPlansOpen, setIsQuickPlansOpen] = useState(false);

  // Drag sürerken butona tıklama vs. engellemek için
  const [isDragging, setIsDragging] = useState(false);

  // SuccessModal için state
  const [showSuccess, setShowSuccess] = useState(false);
  const supabase = createClientComponentClient();

  // Welcome email kontrolü
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sendWelcomeEmail = async () => {
      try {
        console.log('Welcome email check started...');
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth error:', error);
          return;
        }
        
        if (!user) {
          console.log('No user found');
          return;
        }

        console.log('User found:', user.email);

        const { data: profile } = await supabase
          .from('profiles')
          .select('welcome_email_sent')
          .eq('id', user.id)
          .single();

        console.log('Profile data:', profile);

        // Eğer welcome email daha önce gönderilmemişse
        if (!profile?.welcome_email_sent) {
          console.log('Attempting to send welcome email...');
          const response = await fetch('/api/email/sendWelcome', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              email: user.email,
              name: user.user_metadata?.full_name || ''
            })
          });

          if (response.ok) {
            // Welcome email başarıyla gönderildiyse profiles tablosunu güncelle
            await supabase
              .from('profiles')
              .update({ welcome_email_sent: true })
              .eq('id', user.id);
            console.log('Welcome email sent and profile updated');
          }
        }
      } catch (error) {
        console.error('Error in welcome email process:', error);
      }
    };

    sendWelcomeEmail();
  }, []);

  // Ödeme başarılıysa SuccessModal'ı aç
  useEffect(() => {
    if (searchParams?.get("payment") === "success") {
      setShowSuccess(true);
    }
  }, [searchParams]);

  // Plan açma işlemi
  useEffect(() => {
    const openPlanId = searchParams?.get("openPlan");
    if (openPlanId) {
      const planToOpen = plans.find(
        (plan) => plan.id === parseInt(openPlanId)
      );
      if (planToOpen) {
        setSelectedPlan(planToOpen);
        setIsModalOpen(true);
        router.replace("/dashboard");
      }
    }
  }, [searchParams, plans, router, setSelectedPlan, setIsModalOpen]);

  // Drag başlarken tetiklenecek
  const handleDragStart = () => {
    setIsDragging(true);
    setIsQuickPlansOpen(false);
  };

  // Drag bittikten sonra tetiklenecek
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // QuickPlans açılınca izle
  const handleQuickPlansOpen = () => {
    if (!isDragging) {
      setIsQuickPlansOpen(true);
    }
  };

  // QuickPlans kapanınca izle
  const handleQuickPlansClose = () => {
    setIsQuickPlansOpen(false);
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
          onClick={handleQuickPlansOpen}
          className="fixed right-4 bottom-20 z-10 w-14 h-14
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
            className="fixed md:hidden inset-0 bg-black/50 backdrop-blur-sm flex items-end z-40"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleQuickPlansClose();
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
              <QuickPlans
                onClose={handleQuickPlansClose}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ödeme başarılıysa gösterilecek SuccessModal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}