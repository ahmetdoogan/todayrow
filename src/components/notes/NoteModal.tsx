"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Note } from '@/services/notes';
import { X } from 'lucide-react';
import MarkdownEditor from './MarkdownEditor';
import { TagInput } from './TagInput';
import { useTranslations } from 'next-intl';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note>) => Promise<void>;
  initialNote?: Note;
}

export default function NoteModal({ isOpen, onClose, onSave, initialNote }: NoteModalProps) {
  const t = useTranslations('common');
  const [note, setNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    folder_path: '',
    tags: '',
    is_pinned: false,
    format_settings: {},
    parent_id: null,
    order_index: 0
  });

  useEffect(() => {
    if (initialNote) {
      setNote(initialNote);
    } else {
      setNote({
        title: '',
        content: '',
        folder_path: '',
        tags: '',
        is_pinned: false,
        format_settings: {},
        parent_id: null,
        order_index: 0
      });
    }
  }, [initialNote, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.title?.trim()) {
      alert(t('notes.enterTitle'));
      return;
    }
    try {
      await onSave(note);
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
      alert(t('notes.saveError'));
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl mx-4 rounded-2xl shadow-xl" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {initialNote ? t('notes.editNote') : t('notes.newNote')}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <input
                type="text"
                placeholder={t('notes.titlePlaceholder')}
                value={note.title || ''}
                onChange={(e) => setNote(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
              />
            </div>

            <div className="min-h-[200px] border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <MarkdownEditor
                value={note.content || ''}
                onChange={(content) => setNote(prev => ({ ...prev, content }))}
                placeholder={t('notes.contentPlaceholder')}
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                  {t('notes.folder')}
                </label>
                <TagInput
                  value={note.folder_path || ''}
                  onChange={(folder_path) => setNote(prev => ({ ...prev, folder_path }))}
                  isFolder={true}
                />
              </div>
              <div>
                <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                  {t('notes.tags')}
                </label>
                <TagInput
                  value={note.tags || ''}
                  onChange={(tags) => setNote(prev => ({ ...prev, tags }))}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {initialNote ? t('save') : t('notes.create')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}