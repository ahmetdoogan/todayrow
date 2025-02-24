"use client";
import { useState, useMemo, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import type { Note } from '@/types/notes';
import { PlusCircle, FileText } from 'lucide-react';
import NotesList from '@/components/notes/NotesList';
import NoteModal from '@/components/notes/NoteModal';
import NoteDetailModal from '@/components/notes/NoteDetailModal';
import NotesHeader from '@/components/layout/Header/components/NotesHeader';
import { NotesFilter } from '@/components/notes/NotesFilter';
import DeleteConfirmModal from '@/components/notes/DeleteConfirmModal';
import PricingModal from '@/components/modals/PricingModal';
import { useNotes } from '@/context/NotesContext';
import { useTheme } from '@/components/providers/ThemeProvider';

interface Filters {
  folder?: string;
  tags: string[];
}

export default function NotesPage() {
  const searchParams = useSearchParams();
  const { 
    notes, 
    fetchNotes, 
    isLoading, 
    selectedNote,
    setSelectedNote, 
    setIsEditingNote,
    isEditingNote,
    viewingNote,
    setViewingNote,
    createNote,
    updateNote,
    deleteNote,
    toggleNotePin
  } = useNotes();
  
  const { isPro, isTrialing, status } = useSubscription(); // Güncellendi
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<number[]>([]);
  const [filters, setFilters] = useState<Filters>({ tags: [] });
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    id?: number;
    isBulk?: boolean;
  }>({ isOpen: false });

  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const t = useTranslations('common.notes');

  useEffect(() => {
    if (!searchParams) return;
    const openNoteId = searchParams?.get('openNote');
    if (openNoteId) {
      const noteToOpen = notes.find(note => note.id === parseInt(openNoteId));
      if (noteToOpen) {
        setViewingNote(noteToOpen);
      }
    }
  }, [searchParams, notes]);

  const handleSave = async (noteData: Partial<Note>) => {
    try {
      if (selectedNote) {
        await updateNote(selectedNote.id, noteData);
      } else {
        await createNote(noteData);
      }
      setIsModalOpen(false);
      setIsEditingNote(false);
      setSelectedNote(null);
    } catch (error: any) {
      console.error('Error saving note:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNote(id);
      setSelectedNote(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleTogglePin = async (id: number, isPinned: boolean) => {
    try {
      await toggleNotePin(id, isPinned);
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedNotes) {
        await deleteNote(id);
      }
      setSelectedNotes([]);
      setIsSelectionMode(false);
    } catch (error) {
      console.error('Error bulk deleting notes:', error);
    }
  };

  const handleBulkPin = async () => {
    try {
      for (const id of selectedNotes) {
        await toggleNotePin(id, false);
      }
      setSelectedNotes([]);
      setIsSelectionMode(false);
    } catch (error) {
      console.error('Error bulk pinning notes:', error);
    }
  };

  const handleNoteSelect = (id: number) => {
    setSelectedNotes(prev => {
      if (prev.includes(id)) {
        return prev.filter(noteId => noteId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const confirmDelete = (id: number) => {
    setDeleteConfirm({ isOpen: true, id, isBulk: false });
  };

  const confirmBulkDelete = () => {
    setDeleteConfirm({ isOpen: true, isBulk: true });
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      if (filters.folder && note.folder_path !== filters.folder) {
        return false;
      }
      if (filters.tags.length > 0) {
        const noteTags = note.tags ? note.tags.split(',').map(t => t.trim()) : [];
        const hasMatchingTag = filters.tags.some(tag => noteTags.includes(tag));
        if (!hasMatchingTag) {
          return false;
        }
      }
      return true;
    });
  }, [notes, filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
      </div>
    );
  }

  return (
    <div className="h-full">
      <NotesHeader
        notes={notes}
        setNotes={fetchNotes}
        isSelectionMode={isSelectionMode}
        setIsSelectionMode={setIsSelectionMode}
        selectedNotes={selectedNotes}
        setSelectedNotes={setSelectedNotes}
        darkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      <NotesFilter onFilterChange={setFilters} />

      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
          <div className="relative group w-full max-w-md">
            <div className="absolute inset-0 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl transition-all group-hover:border-indigo-500" />
            <button
              onClick={() => {
                if (!isPro && !isTrialing && ['expired', 'cancelled'].includes(status || '')) {
                  setIsPricingModalOpen(true);
                  return;
                }
                setIsModalOpen(true);
                setIsEditingNote(true);
              }}
              className="relative z-10 flex flex-col items-center justify-center w-full h-64 dark:bg-slate-800/50 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-slate-800/70 transition-all shadow-sm hover:shadow-md"
            >
              <FileText className="w-10 h-12 text-black dark:text-white mb-4" strokeWidth={1.5} />
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {t('emptyState.title')}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {t('emptyState.subtitle')}
              </p>
            </button>
          </div>
        </div>
      ) : (
        <NotesList
          notes={filteredNotes}
          onEdit={note => {
            setSelectedNote(note);
            setIsEditingNote(true);
            setViewingNote(null);
          }}
          onDelete={confirmDelete}
          onTogglePin={handleTogglePin}
          onNoteClick={note => {
            setViewingNote(note);
            setIsEditingNote(false);
          }}
          isSelectionMode={isSelectionMode}
          selectedNotes={selectedNotes}
          onNoteSelect={handleNoteSelect}
          viewType={view}
        />
      )}

      <NoteDetailModal 
        note={viewingNote!}
        isOpen={!!viewingNote}
        onClose={() => setViewingNote(null)}
        onEdit={(note) => {
          setSelectedNote(note);
          setIsEditingNote(true);
          setViewingNote(null);
        }}
        onTogglePin={handleTogglePin}
      />

      <NoteModal
        isOpen={isModalOpen || isEditingNote}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditingNote(false);
          setSelectedNote(null);
        }}
        onSave={handleSave}
        initialNote={selectedNote || undefined}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        isTrialEnded={true}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={async () => {
          if (deleteConfirm.isBulk) {
            await handleBulkDelete();
          } else if (deleteConfirm.id) {
            await handleDelete(deleteConfirm.id);
          }
          setDeleteConfirm({ isOpen: false });
        }}
        titleKey={deleteConfirm.isBulk ? "bulkDelete" : "singleDelete"}
      />
    </div>
  );
}