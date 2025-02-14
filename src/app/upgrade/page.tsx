"use client";

import React, { useState } from "react";
import PlannerHeader from "@/components/layout/Header/components/PlannerHeader";
import PricingModal from "@/components/modals/PricingModal";
import PlanList from "@/components/planner/PlanList";
import QuickPlans from "@/components/planner/QuickPlans";

export default function UpgradePage() {
  const [isPricingOpen, setIsPricingOpen] = useState(true);

  return (
    <div className="h-full flex flex-col relative">
      {/* Header - Dashboard gibi olsun */}
      <PlannerHeader />

      <div className="flex-1 overflow-hidden flex">
        {/* Sol tarafta PlanList (Normal Dashboard'taki gibi) */}
        <div className="flex-1 overflow-y-auto">
          <PlanList />
        </div>

        {/* Sağ tarafta QuickPlans */}
        <div className="hidden md:block w-64 xl:w-72 border-l border-gray-200 dark:border-gray-800 overflow-auto">
          <QuickPlans />
        </div>
      </div>

      {/* Pricing Modal */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </div>
  );
}
