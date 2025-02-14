"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import PricingModal from "@/components/modals/PricingModal";

export default function UpgradePage() {
  const [isPricingOpen, setIsPricingOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        onNewContent={() => console.log("New Content Clicked")} 
        onNewNote={() => console.log("New Note Clicked")} 
        onCollapse={(value) => console.log("Sidebar Collapsed:", value)} 
        onNewPlan={() => console.log("New Plan Clicked")}
      />

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
