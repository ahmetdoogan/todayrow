"use client";
import React, { useState } from "react";
import Link from 'next/link';
import { Calendar, PlusCircle } from 'lucide-react';
import DashboardHeader from "@/components/layout/Header/components/DashboardHeader";
import ContentCard from "@/components/content/ContentCard";
import ContentDetailPopup from "@/components/content/ContentDetailPopup";
import ContentModal from "@/components/content/ContentModal";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ViewToggle from "@/components/common/ViewToggle";
import { useContent } from "@/context/ContentContext";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";

export default function ContentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { filteredContents, selectedContent, setSelectedContent } = useContent();
  const t = useTranslations();

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
    <DashboardHeader setIsModalOpen={setIsModalOpen} />

    {/* Dashboard Stats - HER ZAMAN GÖSTER */}
    <DashboardStats />

    {/* View Toggle & Calendar - HER ZAMAN GÖSTER */}
    <div className="flex items-center gap-4 px-4 md:px-6 lg:px-8 mb-8">
      <div className="flex items-center gap-2">
        <ViewToggle view={view} onViewChange={handleViewChange} />
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent flex-1" />
      <Link
        href="/dashboard/calendar"
        className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 
                  bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-xs"
      >
        <Calendar className="w-4 h-4" />
        <span className="hidden md:block">
          {t('common.viewToggle.calendar')}
        </span>
      </Link>
    </div>

    {/* İçerik yoksa gösterilecek alan */}
{filteredContents.length === 0 ? (
  <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] py-8">
    <p className="text-gray-500 dark:text-gray-400 mb-4">
      {t('common.content.emptyState')}
    </p>
    <button
      onClick={() => setIsModalOpen(true)}
      className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-black/70 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-xl transition-all duration-200 font-medium text-sm"
    >
      <PlusCircle className="w-4 h-4" />
      <span>{t('common.sidebar.newContent')}</span>
    </button>
  </div>
) : (
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
    )}

    {/* Modals */}
    {selectedContent && (
      <ContentDetailPopup
        isOpen={true}
        onClose={() => setSelectedContent(null)}
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