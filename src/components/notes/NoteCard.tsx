"use client";
import { useDrag } from 'react-dnd';
import type { Note } from '@/types/notes';
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
  folderColor?: string;
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
  viewType = 'grid',
  folderColor,
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
      router.push(`/dashboard/notes/${slug}`);
    } else if (onClick) {
      onClick(note);
    }
  };

  const cardBaseClasses = `
    relative flex ${viewType === 'grid' ? 'flex-col' : 'items-center gap-4'}
    bg-white dark:bg-slate-800/50 
    border border-slate-200/80 dark:border-slate-700/50
    shadow-sm hover:shadow-lg dark:hover:shadow-slate-700/10 
    transition-all duration-200 
    ${viewType === 'grid' ? 'p-6' : 'p-4'} rounded-2xl backdrop-blur-sm
    ${isSelected ? 'ring-2 ring-indigo-500/50' : ''}
    ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
    cursor-pointer
    active:cursor-grabbing
    max-h-[600px]
    group
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div
        ref={drag}
        onClick={handleClick}
        className={cardBaseClasses}
        style={{
          transform: isDragging ? 'rotate(-2deg)' : undefined,
        }}
      >
        {/* Folder Color Bar */}
        {folderColor && (
          <div
            className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${folderColor}`}
          />
        )}

        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className={`absolute top-4 left-4 z-10 ${viewType === 'list' ? 'relative top-0 left-0' : ''}`}>
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
            absolute ${viewType === 'grid' ? 'top-4 right-4' : 'right-4'}
            p-2 rounded-lg
            hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors
            ${is_pinned ? 'text-indigo-500' : 'text-slate-400'}
            ${isSelectionMode ? 'hidden' : ''}
          `}
          title={is_pinned ? t('unpin') : t('pin')}
        >
          <Pin size={viewType === 'grid' ? 16 : 14} className={is_pinned ? 'fill-current' : ''} />
        </button>

        {/* Main Content */}
        <div className={`flex-1 min-w-0 ${isSelectionMode ? 'pl-8' : ''} ${viewType === 'grid' ? 'mt-2' : ''}`}>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {title}
            </h3>
          </div>

          {folder_path && (
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
              <FolderOpen size={12} className="mr-1 flex-shrink-0" />
              <span className="truncate">{folder_path}</span>
            </div>
          )}

          <div className={`text-slate-600 dark:text-slate-300 text-sm ${viewType === 'grid' ? 'mb-3' : ''}`}>
            <NoteContent content={content || ''} isPreview={true} />
          </div>
        </div>

        {/* Footer / Actions */}
        <div className={`
          flex items-center 
          ${viewType === 'grid' 
            ? 'justify-between pt-4 mt-auto border-t border-slate-200/50 dark:border-slate-700/50' 
            : 'gap-4 flex-shrink-0'
          }
        `}>
          <span className="text-xs text-slate-500 dark:text-slate-400">
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
                <Edit size={viewType === 'grid' ? 16 : 14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg"
                title={t('delete')}
              >
                <Trash2 size={viewType === 'grid' ? 16 : 14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}