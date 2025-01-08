"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getNotes,
  deleteNote,
  updateNote,
  toggleNotePin,
  createNote
} from '@/services/notes';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import type { Note } from '@/types/notes'; // Note tipini buradan import ediyoruz

interface NotesContextType {
  notes: Note[];
  fetchNotes: () => Promise<void>;
  isLoading: boolean;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  isEditingNote: boolean;
  setIsEditingNote: (isEditing: boolean) => void;
  viewingNote: Note | null;
  setViewingNote: (note: Note | null) => void;
  toggleNotePin: (id: number, isPinned: boolean) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  updateNote: (id: number, note: Partial<Note>) => Promise<Note>;
  createNote: (note: Partial<Note>) => Promise<Note>; // Partial<Note> olarak güncellendi
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);

  const t = useTranslations('common.notes.notifications');

  const fetchNotes = useCallback(async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast.error(t('loadError'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleTogglePin = async (id: number, isPinned: boolean) => {
    try {
      await toggleNotePin(id, isPinned);
      toast.success(isPinned ? t('unpinSuccess') : t('pinSuccess'));
      await fetchNotes();
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error(t('pinError'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNote(id);
      toast.success(t('deleteSuccess'));
      await fetchNotes();
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setIsEditingNote(false);
      }
      if (viewingNote?.id === id) {
        setViewingNote(null);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error(t('deleteError'));
    }
  };

  const handleUpdate = async (id: number, noteData: Partial<Note>) => {
    try {
      const updated = await updateNote(id, noteData);
      toast.success(t('updateSuccess'));
      await fetchNotes();
      return updated;
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error(t('updateError'));
      throw error;
    }
  };

  const handleCreate = async (noteData: Partial<Note>) => {
    try {
      const created = await createNote(noteData);
      toast.success(t('createSuccess'));
      setNotes(prevNotes => [created, ...prevNotes]);
      await fetchNotes();
      return created;
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error(t('createError'));
      throw error;
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        fetchNotes,
        isLoading,
        selectedNote,
        setSelectedNote,
        isEditingNote,
        setIsEditingNote,
        viewingNote,
        setViewingNote,
        toggleNotePin: handleTogglePin,
        deleteNote: handleDelete,
        updateNote: handleUpdate,
        createNote: handleCreate
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}