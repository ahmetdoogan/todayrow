"use client";
import { useState, useEffect } from 'react';
import { Note, getNoteBacklinks } from '@/services/notes';
import { X, Edit, Pin, FolderOpen, Tag, Calendar, Link } from 'lucide-react';
import { useDateFormatter } from '@/utils/dateUtils'; // Doğru import
import { motion } from 'framer-motion';
import NoteContent from './NoteContent';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/context/NotesContext';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

export default function NoteDetailModal() {
  const { 
    selectedNote,
    setSelectedNote,
    setIsEditingNote,
    toggleNotePin,
    viewingNote,
    setViewingNote
  } = useNotes();

  const [activeTab, setActiveTab] = useState<'content' | 'backlinks'>('content');
  const [backlinks, setBacklinks] = useState<Note[]>([]);
  const [isLoadingBacklinks, setIsLoadingBacklinks] = useState(false);
  const router = useRouter();
  const t = useTranslations("noteDetailModal");
  const formatDate = useDateFormatter(); // formatDate fonksiyonunu kullan

  useEffect(() => {
    if (viewingNote) {
      loadBacklinks();
      
      // Sosyal medya scriptlerini yükle
      const loadSocialScripts = async () => {
        // Twitter/X
        if (viewingNote.content.includes('twitter.com') || viewingNote.content.includes('x.com')) {
          const script = document.createElement('script');
          script.src = 'https://platform.twitter.com/widgets.js';
          script.async = true;
          script.charset = 'utf-8';
          await document.body.appendChild(script);

          // Twitter widget'larını yeniden render et
          if (window.twttr && window.twttr.widgets) {
            window.twttr.widgets.load();
          }
        }

        // Instagram
        if (viewingNote.content.includes('instagram.com')) {
          const script = document.createElement('script');
          script.src = '//www.instagram.com/embed.js';
          script.async = true;
          await document.body.appendChild(script);

          // Instagram widget'larını yeniden render et
          if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
          }
        }
      };

      loadSocialScripts();
    }

    // Cleanup
    return () => {
      const scripts = document.querySelectorAll('script[src*="twitter"], script[src*="instagram"]');
      scripts.forEach(script => script.remove());
    };
  }, [viewingNote]);

  const loadBacklinks = async () => {
    if (!viewingNote) return;
    
    setIsLoadingBacklinks(true);
    try {
      const links = await getNoteBacklinks(viewingNote.title);
      setBacklinks(links);
    } catch (error) {
      console.error('Error loading backlinks:', error);
    } finally {
      setIsLoadingBacklinks(false);
    }
  };

  const handleClose = () => {
    setViewingNote(null);
    router.push('/dashboard/notes');
  };

  const handleEdit = () => {
    if (viewingNote) {
      setSelectedNote(viewingNote);
      setIsEditingNote(true);
      setViewingNote(null);
      router.push('/dashboard/notes');  // Notlar sayfasına yönlendir
    }
  };

  const handleTogglePin = async () => {
    if (!viewingNote) return;
    try {
      await toggleNotePin(viewingNote.id, !viewingNote.is_pinned);
      toast.success(viewingNote.is_pinned ? t("unpinSuccess") : t("pinSuccess"));
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error(t("pinError"));
    }
  };

  if (!viewingNote) return null;

  return (
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
        className="bg-white dark:bg-slate-900 w-full max-w-3xl mx-4 rounded-2xl shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{viewingNote.title}</h2>
            <button
              onClick={handleTogglePin}
              className={`p-1.5 rounded-lg transition-colors ${
                viewingNote.is_pinned 
                  ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={viewingNote.is_pinned ? t("unpinTooltip") : t("pinTooltip")}
            >
              <Pin size={16} className={viewingNote.is_pinned ? 'fill-current' : ''} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t("editTooltip")}
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="px-6 pb-2 pt-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'content'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {t("contentTab")}
            </button>
            <button
              onClick={() => setActiveTab('backlinks')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'backlinks'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Link size={16} />
              {t("backlinksTab")}
              {backlinks.length > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {backlinks.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <div className="space-y-2 mb-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(viewingNote.created_at)}</span>
            </div>
            {viewingNote.folder_path && (
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                <span>{viewingNote.folder_path}</span>
              </div>
            )}
            {viewingNote.tags && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>{viewingNote.tags}</span>
              </div>
            )}
          </div>

          {activeTab === 'content' && (
            <div className="prose dark:prose-invert max-w-none prose-slate prose-headings:scroll-mt-28">
              <NoteContent content={viewingNote.content} />
            </div>
          )}

          {activeTab === 'backlinks' && (
            <div className="space-y-4">
              {isLoadingBacklinks ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-white" />
                </div>
              ) : backlinks.length > 0 ? (
                backlinks.map((link) => (
                  <div
                    key={link.id}
                    className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => {
                      if (link.slug) {
                        router.push(`/dashboard/notes/${link.slug}`);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        {link.title}
                      </h3>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(link.created_at)}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                      <NoteContent content={link.content} isPreview={true} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  {t("noBacklinksMessage")}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}