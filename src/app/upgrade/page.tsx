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
import { NotesProvider } from "@/context/NotesContext"; // EKLEDİK ✅

export default function UpgradePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isPricingOpen, setIsPricingOpen] = useState(true);

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
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
    <PlannerProvider> {/* Dashboard gibi yapı oluşturuyoruz */}
      <NotesProvider> {/* NotesProvider EKLEDİK ✅ */}
        <div className="h-screen flex">
          {/* Sidebar bileşenine props'ları vererek çağırıyoruz */}
          <Sidebar
            onNewContent={() => {}}
            onNewNote={() => {}}
            onCollapse={() => {}}
            onNewPlan={() => {}}
          />

          <div className="flex-1 flex flex-col">
            {/* Header, Dashboard'taki gibi olacak */}
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
      </NotesProvider>
    </PlannerProvider>
  );
}
