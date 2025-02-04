"use client";
import { useDrop } from 'react-dnd';
import type { Note } from '@/types/notes';
import NoteCard from './NoteCard';
import { ItemTypes } from '@/utils/constants';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useNotes } from '@/context/NotesContext';

interface NotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onTogglePin: (id: number, isPinned: boolean) => void;
  onNoteClick: (note: Note) => void;
  isSelectionMode: boolean;
  selectedNotes: number[];
  onNoteSelect: (id: number) => void;
  viewType?: 'grid' | 'list';
}

/** 
 * DragItem: Sürüklenen nesnenin tipi (bizde { id, is_pinned }).
 * DropResult: Yoksa 'void'.
 * CollectedProps: collect fonksiyonunda dönen tip ({ isOver, canDrop }).
 */
type DragItem = { id: number; is_pinned: boolean };
type DropResult = void;
type CollectedProps = { isOver: boolean; canDrop: boolean };

interface DropZoneProps {
  isPinned: boolean;
  onTogglePin: (id: number, currentIsPinned: boolean) => void;
  children: React.ReactNode;
  isSelectionMode: boolean;
}

function DropZone({ isPinned, onTogglePin, children, isSelectionMode }: DropZoneProps) {
  // useDrop generics:
  const [{ isOver, canDrop }, drop] = useDrop<DragItem, DropResult, CollectedProps>({
    accept: ItemTypes.NOTE,
    canDrop: (item) => item.is_pinned !== isPinned,
    drop: (item) => {
      onTogglePin(item.id, item.is_pinned);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={!isSelectionMode ? drop : null}
      className={`
        transition-colors duration-200 rounded-lg
        ${isOver && canDrop ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
        ${canDrop ? 'outline-2 outline-dashed outline-blue-200 dark:outline-blue-800' : ''}
        min-h-[200px]
      `}
    >
      {children}
    </div>
  );
}

const containerAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    }
  }
};

const groupAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    }
  }
};

export default function NotesList({
  notes,
  onEdit,
  onDelete,
  onTogglePin,
  onNoteClick,
  isSelectionMode,
  selectedNotes,
  onNoteSelect,
  viewType = 'grid'
}: NotesListProps) {
  const t = useTranslations('common.notes');
  const { getFolderColor } = useNotes();

  const pinnedNotes = notes.filter(note => note.is_pinned);
  const unpinnedNotes = notes.filter(note => !note.is_pinned);

  const gridClasses = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2";
  const listClasses = "flex flex-col gap-3 p-2";

  const renderNote = (note: Note, index: number) => (
    <NoteCard
      key={note.id}
      note={note}
      onEdit={onEdit}
      onDelete={onDelete}
      onTogglePin={onTogglePin}
      onClick={onNoteClick}
      isSelectionMode={isSelectionMode}
      isSelected={selectedNotes.includes(note.id)}
      onSelect={onNoteSelect}
      index={index}
      viewType={viewType}
      folderColor={note.folder_path ? getFolderColor(note.folder_path) : undefined}
    />
  );

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerAnimation}
      className="space-y-8"
    >
      {/* Pinlenmiş Notlar */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white pl-1">
            {t('pinnedNotes')}
          </h2>
          <DropZone isPinned={true} onTogglePin={onTogglePin} isSelectionMode={isSelectionMode}>
            <motion.div variants={groupAnimation} className={gridClasses}>
              {pinnedNotes.map((note, index) => renderNote(note, index))}
            </motion.div>
          </DropZone>
        </div>
      )}

      {/* Diğer Notlar */}
      <div className="space-y-4">
        {pinnedNotes.length > 0 && (
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white pl-1">
            {t('otherNotes')}
          </h2>
        )}
        <DropZone isPinned={false} onTogglePin={onTogglePin} isSelectionMode={isSelectionMode}>
          <motion.div
            variants={groupAnimation}
            className={viewType === 'grid' ? gridClasses : listClasses}
          >
            {unpinnedNotes.map((note, index) => renderNote(note, index))}
          </motion.div>
        </DropZone>
      </div>
    </motion.div>
  );
}
