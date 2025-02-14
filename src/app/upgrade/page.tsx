"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import PricingModal from "@/components/modals/PricingModal";
import Sidebar from "@/components/layout/Sidebar";
import PlannerHeader from "@/components/layout/Header/components/PlannerHeader";
import PlanList from "@/components/planner/PlanList";
import QuickPlans from "@/components/planner/QuickPlans";
import { PlannerProvider } from "@/context/PlannerContext"; 

export default function UpgradePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isPricingOpen, setIsPricingOpen] = useState(true);

  // Kullanıcı giriş yapmamışsa login'e yönlendir
  useEffect(() => {
    if (!user) {
      router.push(`/auth/login?redirect=/upgrade`);
    }
  }, [user, router]);

  // Kullanıcı login sayfasına yönlendirildiyse boş bir ekran göster
  if (!user) {
    return null;
  }

  return (
    <PlannerProvider> {/* Normal Dashboard gibi aynı yapıda olmalı */}
      <div className="h-screen flex">
        {/* Sidebar, her sayfada olduğu gibi olacak */}
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {/* Header, Dashboard'ta nasıl görünüyorsa öyle olacak */}
          <PlannerHeader />

          <div className="flex-1 overflow-hidden flex">
            {/* Sol tarafta PlanList (Normal Dashboard'taki gibi) */}
            <div className="flex-1 overflow-y-auto">
              <PlanList />
            </div>

            {/* Sağ tarafta QuickPlans (Normal Dashboard'taki gibi) */}
            <div className="hidden md:block w-64 xl:w-72 border-l border-gray-200 dark:border-gray-800 overflow-auto">
              <QuickPlans />
            </div>
          </div>

          {/* Pricing Modal Açık Olacak, Kapatınca Dashboard'a Gidecek */}
          <PricingModal isOpen={isPricingOpen} onClose={() => router.push("/dashboard")} />
        </div>
      </div>
    </PlannerProvider>
  );
}
