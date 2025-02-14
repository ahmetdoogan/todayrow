"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar"; // Sidebar'ı ekliyoruz
import Header from "@/components/layout/Header"; // Header'ı ekliyoruz
import PricingModal from "@/components/modals/PricingModal";

export default function UpgradePage() {
  const [isPricingOpen, setIsPricingOpen] = useState(true); // Sayfa açıldığında PricingModal otomatik açılacak

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* İçerik Alanı */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header darkMode={false} toggleTheme={() => {}} setIsModalOpen={() => {}} />

        {/* Sayfa İçeriği */}
        <div className="flex-1 flex justify-center items-center p-6">
          <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
        </div>
      </div>
    </div>
  );
}
