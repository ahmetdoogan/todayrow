"use client";

import React from 'react';
import { Trash2, Check, CheckSquare, Eye, EyeOff } from "lucide-react";
import { useContent } from '@/context/ContentContext';
import { toast } from "react-toastify";
import { supabase } from "@/utils/supabaseClient";
import BaseHeader from './BaseHeader';
import { useTranslations } from 'next-intl';

interface DashboardHeaderProps {
  setIsModalOpen: (value: boolean) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ setIsModalOpen }) => {
  const {
    selectedItems,
    isSelectionMode,
    setIsSelectionMode,
    setSelectedItems,
    hideCompleted,
    setHideCompleted,
    setContents
  } = useContent();

  const t = useTranslations();

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedItems) {
        await supabase
          .from("Content")
          .update({ is_deleted: true })
          .eq("id", id);
      }
      
      setContents((prev) => prev.filter((content) => !selectedItems.includes(content.id)));
      setSelectedItems([]);
      setIsSelectionMode(false);
      
      toast.success(t('common.dashboard.notifications.deleteSuccess'));
    } catch (error) {
      console.error("Silme işlemi sırasında bir hata oluştu:", error);
      toast.error(t('common.dashboard.notifications.deleteError'));
    }
  };

  const handleBulkComplete = async () => {
    try {
      for (const id of selectedItems) {
        await supabase
          .from("Content")
          .update({ is_completed: true })
          .eq("id", id);
      }
      
      setContents((prev) =>
        prev.map((content) =>
          selectedItems.includes(content.id)
            ? { ...content, is_completed: true }
            : content
        )
      );
      
      setSelectedItems([]);
      setIsSelectionMode(false);
      
      toast.success(t('common.dashboard.notifications.completeSuccess'));
    } catch (error) {
      console.error("Tamamlama işlemi sırasında bir hata oluştu:", error);
      toast.error(t('common.dashboard.notifications.completeError'));
    }
  };

  return (
    <BaseHeader
      leftContent={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            className={`
              group flex items-center justify-center transition-colors rounded-lg
              w-8 h-8 md:w-auto md:h-auto md:px-4 md:py-2
              border border-gray-200 dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-700
              ${isSelectionMode ? "bg-gray-100 dark:bg-gray-700" : ""}
            `}
            title={isSelectionMode ? t('common.dashboard.cancelSelection') : t('common.dashboard.multiSelect')}
          >
            <CheckSquare className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline text-sm">
              {isSelectionMode ? t('common.dashboard.cancelSelection') : t('common.dashboard.multiSelect')}
            </span>
          </button>

          <button
            onClick={() => setHideCompleted(prev => !prev)}
            className={`
              group flex items-center justify-center transition-colors rounded-lg
              w-8 h-8 md:w-auto md:h-auto md:px-4 md:py-2
              border border-gray-200 dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-700
              ${hideCompleted ? "bg-gray-100 dark:bg-gray-700" : ""}
            `}
            title={hideCompleted ? t('common.dashboard.showCompleted') : t('common.dashboard.hideCompleted')}
          >
            {hideCompleted ? (
              <>
                <EyeOff className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline text-sm">{t('common.dashboard.showCompleted')}</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline text-sm">{t('common.dashboard.hideCompleted')}</span>
              </>
            )}
          </button>
        </div>
      }
      rightContent={
        isSelectionMode && selectedItems.length > 0 ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 px-2 py-1 md:px-4 md:py-2 
                      bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 
                      text-white text-sm rounded-lg"
              title={t('common.dashboard.deleteSelected')}
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">{t('common.dashboard.deleteButton')}</span>
              <span>({selectedItems.length})</span>
            </button>
            
            <button
              onClick={handleBulkComplete}
              className="flex items-center gap-1 px-2 py-1 md:px-4 md:py-2 
                      bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 
                      text-white text-sm rounded-lg"
              title={t('common.dashboard.completeSelected')}
            >
              <Check className="w-4 h-4" />
              <span className="hidden md:inline">{t('common.dashboard.completeButton')}</span>
            </button>
          </div>
        ) : null
      }
      className="bg-stone-50"
      noPadding
      showThemeToggle={true}
    />
  );
};

export default DashboardHeader;