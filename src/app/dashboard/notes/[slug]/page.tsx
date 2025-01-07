"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Note, updateNote, getNotes } from '@/services/notes';
import { useNotes } from '@/context/NotesContext';
import NoteDetailModal from '@/components/notes/NoteDetailModal';
import NoteModal from '@/components/notes/NoteModal';
import { toast } from 'react-toastify';

export default function NotePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { notes, toggleNotePin } = useNotes();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) {
      toast.error('Geçersiz not bağlantısı');
      router.push('/dashboard/notes');
      return;
    }

    if (notes.length > 0) {
      const foundNote = notes.find(n => n.slug === slug);
      if (foundNote) {
        setNote(foundNote);
      } else {
        toast.error('Not bulunamadı');
        router.push('/dashboard/notes');
      }
      setIsLoading(false);
    }
  }, [notes, slug, router]);

  const handleSave = async (noteData: Partial<Note>) => {
    try {
      if (note) {
        await updateNote(note.id, noteData);
        toast.success('Not başarıyla güncellendi');
        // Notları yeniden yükle
        const updatedNotes = await getNotes();
        const updatedNote = updatedNotes.find(n => n.id === note.id);
        if (updatedNote) {
          setNote(updatedNote);
        }
      }
      setIsEditModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Not güncellenirken hata oluştu');
      console.error('Error saving note:', error);
    }
  };

  if (isLoading || !note) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
      </div>
    );
  }

  return (
    <>
      <NoteDetailModal
        note={note}
        isOpen={true}
        onClose={() => router.push('/dashboard/notes')}
        onEdit={note => {
          setIsEditModalOpen(true);
        }}
        onTogglePin={toggleNotePin}
      />

      {/* Düzenleme modalı */}
      <NoteModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        initialNote={note}
      />
    </>
  );
}