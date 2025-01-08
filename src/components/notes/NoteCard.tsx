"use client";
import { useDrag } from 'react-dnd';
import type { Note } from '@/types/notes'; // Değişiklik burada
import { useDateFormatter } from '@/utils/dateUtils';
import { Pin, Trash2, Edit, FolderOpen } from 'lucide-react';
import { ItemTypes } from '@/utils/constants';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NoteContent from './NoteContent';
import { useNotes } from '@/context/NotesContext';
import { useTranslations } from 'next-intl';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onTogglePin: (id: number, isPinned: boolean) => void;
  onClick?: (note: Note) => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
  index: number;
  viewType?: 'grid' | 'list';
}

export default function NoteCard({ 
  note, 
  onEdit, 
  onDelete, 
  onTogglePin,
  onClick,
  isSelectionMode,
  isSelected,
  onSelect,
  index,
  viewType = 'grid'
}: NoteCardProps) {
  const { id, title, content, is_pinned, folder_path, created_at, slug } = note;
  const router = useRouter();
  const { setViewingNote } = useNotes();
  const t = useTranslations('common.notes');
  const formatDate = useDateFormatter();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.NOTE,
    item: { id, is_pinned },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !isSelectionMode,
  }));

  const handleClick = async (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && (
      e.target.tagName === 'BUTTON' || 
      e.target.closest('button') || 
      e.target.tagName === 'svg' || 
      e.target.tagName === 'path'
    )) {
      return;
    }

    if (isSelectionMode && onSelect) {
      onSelect(id);
    } else if (slug) {
      setViewingNote(note);
      router.push(`/dashboard/notes/${slug}`);
    } else if (onClick) {
      onClick(note);
    }
  };

  if (viewType === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <div
          ref={drag}
          onClick={handleClick}
          className={`
            relative flex items-center gap-4
            bg-white dark:bg-slate-800/50 
            border border-slate-200/80 dark:border-slate-700/50
            shadow-sm hover:shadow-lg dark:hover:shadow-slate-700/10 
            transition-all duration-200 
            p-4 rounded-2xl backdrop-blur-sm
            ${isSelected ? 'ring-2 ring-indigo-500/50' : ''}
            ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
            cursor-pointer
            active:cursor-grabbing
            max-h-[600px]
            group
          `}
          style={{
            transform: isDragging ? 'rotate(-2deg)' : undefined,
          }}
        >
          {isSelectionMode && (
            <div className="flex-shrink-0">
              <div 
                className={`
                  w-4 h-4 border-2 rounded-lg
                  ${isSelected 
                    ? 'border-indigo-500 bg-indigo-500' 
                    : 'border-slate-300 dark:border-slate-600'
                  }
                `}
              >
                {isSelected && (
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="w-3 h-3 text-white"
                    stroke="currentColor" 
                    strokeWidth="4"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {title}
              </h3>
              {is_pinned && (
                <Pin size={14} className="text-indigo-500 fill-current flex-shrink-0" />
              )}
            </div>

            {folder_path && (
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
                <FolderOpen size={12} className="mr-1 flex-shrink-0" />
                <span className="truncate">{folder_path}</span>
              </div>
            )}

            <div className="text-sm text-slate-600 dark:text-slate-300">
              <NoteContent content={content || ''} isPreview={true} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formatDate(created_at)}
            </span>
            
            {!isSelectionMode && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(id, is_pinned);
                  }}
                  className={`
                    p-2 rounded-lg
                    hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors
                    ${is_pinned ? 'text-indigo-500' : 'text-slate-400'}
                  `}
                  title={is_pinned ? t('unpin') : t('pin')}
                >
                  <Pin size={14} className={is_pinned ? 'fill-current' : ''} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(note);
                  }}
                  className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg"
                  title={t('edit')}
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                  }}
                  className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg"
                  title={t('delete')}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid görünümü
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div
        ref={drag}
        onClick={handleClick}
        className={`
          relative flex flex-col group
          bg-white dark:bg-slate-800/50 
          border border-slate-200/80 dark:border-slate-700/50
          shadow-sm hover:shadow-lg dark:hover:shadow-slate-700/10
          transition-all duration-200 
          p-6 rounded-2xl backdrop-blur-sm
          ${isSelected ? 'ring-2 ring-indigo-500/50' : ''}
          ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
          cursor-pointer
          active:cursor-grabbing
          max-h-[600px]
        `}
        style={{
          transform: isDragging ? 'rotate(-2deg)' : undefined,
        }}
      >
        {isSelectionMode && (
          <div className="absolute top-4 left-4 z-10">
            <div 
              className={`
                w-4 h-4 border-2 rounded-lg
                ${isSelected 
                  ? 'border-indigo-500 bg-indigo-500' 
                  : 'border-slate-300 dark:border-slate-600'
                }
              `}
            >
              {isSelected && (
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="w-3 h-3 text-white"
                  stroke="currentColor" 
                  strokeWidth="4"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>
        )}

        {/* Pin Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(id, is_pinned);
          }}
          className={`
            absolute top-4 right-4 p-2 rounded-lg
            hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors
            ${is_pinned ? 'text-indigo-500' : 'text-slate-400'}
            ${isSelectionMode ? 'hidden' : ''}
          `}
          title={is_pinned ? t('unpin') : t('pin')}
        >
          <Pin size={16} className={is_pinned ? 'fill-current' : ''} />
        </button>

        {/* Title and Folder Path */}
        <div className={`mb-3 ${isSelectionMode ? 'pl-8' : ''} mt-2`}>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
            {title}
          </h3>
          {folder_path && (
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
              <FolderOpen size={14} className="mr-1 flex-shrink-0" />
              <span className="truncate">{folder_path}</span>
            </div>
          )}
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-hidden mb-3">
          <div className="text-slate-600 dark:text-slate-300 text-sm">
            <NoteContent content={content || ''} isPreview={true} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm pt-4 mt-auto border-t border-slate-200/50 dark:border-slate-700/50">
          <span className="text-slate-500 dark:text-slate-400">
            {formatDate(created_at)}
          </span>
          
          {!isSelectionMode && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(note);
                }}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg"
                title={t('edit')}
              >
                <Edit size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg"
                title={t('delete')}
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}