"use client";

import React from 'react';
import { usePlanner } from '@/context/PlannerContext';
import PlannerHeader from "@/components/layout/Header/components/PlannerHeader";
import PlanList from '../PlanList';
import QuickPlans from '../QuickPlans';
import PlanModal from '../PlanModal';

const PlannerLayout = () => {
  const { isModalOpen } = usePlanner();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      {/* Header Bölümü */}
      <PlannerHeader />

      {/* Ana İçerik */}
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Planlar Listesi */}
          <div className="lg:col-span-9 space-y-6">
            <PlanList />
          </div>

          {/* Hazır Planlar */}
          <div className="hidden md:block md:col-span-3">
            <QuickPlans />
          </div>
        </div>
      </div>

      {/* Plan Modalı */}
      {isModalOpen && <PlanModal />}
    </div>
  );
};

export default PlannerLayout;