"use client";

import React from 'react';
import { Trash2, Pin, CheckSquare } from "lucide-react";
import { toast } from "react-toastify";
import { supabase } from "@/utils/supabaseClient";
import BaseHeader from './BaseHeader';
import type { Note } from '@/services/notes';
import { useTranslations } from 'next-intl';

interface NotesHeaderProps {
  notes: Note[];
  setNotes: () => Promise<void>;
  isSelectionMode: boolean;
  setIsSelectionMode: (value: boolean) => void;
  selectedNotes: number[];
  setSelectedNotes: React.Dispatch<React.SetStateAction<number[]>>;
}

const NotesHeader: React.FC<NotesHeaderProps> = ({
  notes,
  setNotes,
  isSelectionMode,
  setIsSelectionMode,
  selectedNotes,
  setSelectedNotes,
}) => {
  const t = useTranslations();

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedNotes) {
        await supabase
          .from("Notes")
          .delete()
          .eq("id", id);
      }
      
      await setNotes();
      setSelectedNotes([]);
      setIsSelectionMode(false);
      
      toast.success(t('common.notes.notifications.deleteSuccess'));
    } catch (error) {
      console.error("Silme işlemi sırasında bir hata oluştu:", error);
      toast.error(t('common.notes.notifications.deleteError'));
    }
  };

  const handleBulkPin = async () => {
    try {
      for (const id of selectedNotes) {
        await supabase
          .from("Notes")
          .update({ is_pinned: true })
          .eq("id", id);
      }
      
      await setNotes();
      setSelectedNotes([]);
      setIsSelectionMode(false);
      
      toast.success(t('common.notes.notifications.pinSuccess'));
    } catch (error) {
      console.error("Sabitleme işlemi sırasında bir hata oluştu:", error);
      toast.error(t('common.notes.notifications.pinError'));
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
            title={isSelectionMode ? t('common.notes.cancelSelection') : t('common.notes.multiSelect')}
          >
            <CheckSquare className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline text-sm">
              {isSelectionMode ? t('common.notes.cancelSelection') : t('common.notes.multiSelect')}
            </span>
          </button>

          {isSelectionMode && selectedNotes.length > 0 && (
            <>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1 px-2 py-1 md:px-4 md:py-2 
                         bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 
                         text-white text-sm rounded-lg"
                title={t('common.notes.deleteSelected')}
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden md:inline">{t('common.notes.deleteButton')}</span>
                <span>({selectedNotes.length})</span>
              </button>
              
              <button
                onClick={handleBulkPin}
                className="flex items-center gap-1 px-2 py-1 md:px-4 md:py-2 
                         bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 
                         text-white text-sm rounded-lg"
                title={t('common.notes.pinSelected')}
              >
                <Pin className="w-4 h-4" />
                <span className="hidden md:inline">{t('common.notes.pinButton')}</span>
              </button>
            </>
          )}
        </div>
      }
      className="bg-stone-50"
      noPadding
      showThemeToggle={true}
    />
  );
};

export default NotesHeader;