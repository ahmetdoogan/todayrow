"use client";
import React, { useState } from "react";
import DashboardHeader from "@/components/layout/Header/components/DashboardHeader";
import ContentCard from "@/components/content/ContentCard";
import ContentDetailPopup from "@/components/content/ContentDetailPopup";
import ContentModal from "@/components/content/ContentModal";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ViewToggle from "@/components/common/ViewToggle";
import { useContent } from "@/context/ContentContext";
import { motion } from "framer-motion";

export default function ContentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { filteredContents, selectedContent, setSelectedContent } = useContent(); // setSelectedContent ekledik

  // Liste ve Grid view için CSS sınıfları
  const contentContainerClasses = view === 'grid'
    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6"
    : "flex flex-col gap-3";

  const handleViewChange = (newView: 'grid' | 'list') => {
    const container = document.getElementById('content-container');
    if (container) {
      container.style.opacity = '0';
      setTimeout(() => {
        setView(newView);
        container.style.opacity = '1';
      }, 200);
    } else {
      setView(newView);
    }
  };

  return (
    <>
      <DashboardHeader
        setIsModalOpen={setIsModalOpen}
      />

      {/* Dashboard Stats */}
      <DashboardStats />

      {/* View Toggle & Separator */}
      <div className="flex items-center gap-4 px-4 md:px-6 lg:px-8 mb-8">
        <ViewToggle view={view} onViewChange={handleViewChange} />
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent flex-1" />
      </div>

      {/* Content Grid/List */}
      <div 
        id="content-container"
        className={`${contentContainerClasses} px-4 md:px-6 lg:px-8`}
        style={{ transition: 'opacity 0.2s ease-in-out' }}
      >
        {filteredContents.map((content, index) => (
          <motion.div
            key={content.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <ContentCard content={content} viewType={view} />
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      {selectedContent && (
        <ContentDetailPopup
          isOpen={true}
          onClose={() => setSelectedContent(null)} // Popup kapatıldığında selectedContent'i null yap
          selectedContent={selectedContent}
        />
      )}
      <ContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}