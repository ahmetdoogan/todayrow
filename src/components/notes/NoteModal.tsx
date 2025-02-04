"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import type { Note } from '@/types/notes';
import { X } from 'lucide-react';
import MarkdownEditor from './MarkdownEditor';
import { TagInput } from './TagInput';
import { useTranslations } from 'next-intl';
import ConfirmModal from '@/components/modals/ConfirmModal';
import { toast } from 'react-toastify';

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

  const [initialFormData, setInitialFormData] = useState<Partial<Note>>({
    title: '',
    content: '',
    folder_path: '',
    tags: '',
    is_pinned: false,
    format_settings: {},
    parent_id: null,
    order_index: 0
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (initialNote) {
      setNote(initialNote);
      setInitialFormData(initialNote);
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
      setInitialFormData({
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

  const hasChanges = () => {
    return (
      note.title !== initialFormData.title ||
      note.content !== initialFormData.content ||
      note.folder_path !== initialFormData.folder_path ||
      note.tags !== initialFormData.tags ||
      note.is_pinned !== initialFormData.is_pinned
    );
  };

  const handleClose = () => {
    if (hasChanges()) {
      setIsConfirmModalOpen(true); // Değişiklik varsa ConfirmModal'ı göster
    } else {
      onClose(); // Değişiklik yoksa direkt kapat
    }
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    onClose();
    toast.info(t('notes.notifications.undoSuccess'));
  };

  const handleCancelClose = () => {
    setIsConfirmModalOpen(false);
  };

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
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
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
              onClick={handleClose}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder={t('notes.titlePlaceholder')}
                  value={note.title || ''}
                  onChange={(e) => setNote((prev: Partial<Note>) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                />
              </div>

              <div className="min-h-[200px] border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <MarkdownEditor
                  value={note.content || ''}
                  onChange={(content) => setNote((prev: Partial<Note>) => ({ ...prev, content }))}
                  placeholder={t('notes.contentPlaceholder')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-700 dark:text-slate-300 mb-1 block">
                    {t('notes.folder')}
                  </label>
                  <TagInput
                    value={note.folder_path || ''}
                    onChange={(folder_path) => setNote((prev: Partial<Note>) => ({ ...prev, folder_path }))}
                    isFolder={true}
                    placeholder={t('notes.folderPlaceholder')}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-700 dark:text-slate-300 mb-1 block">
                    {t('notes.tags')}
                  </label>
                  <TagInput
                    value={note.tags || ''}
                    onChange={(tags) => setNote((prev: Partial<Note>) => ({ ...prev, tags }))}
                    placeholder={t('notes.tagsPlaceholder')}
                  />
                </div>
              </div>
            </div>

           

            <div className="flex gap-3 justify-between items-center mt-6">
  {/* İpucu metni */}
  <div className="text-xs text-slate-500 dark:text-slate-400">
    {t('notes.hint')}
  </div>
  <div className="flex gap-3">
    <button
      type="button"
      onClick={handleClose}
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
</div>
          </form>
        </motion.div>
      </motion.div>

      {/* ConfirmModal'ı ekleyin */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        message={t('confirmCloseMessage')}
      />
    </>
  );
}