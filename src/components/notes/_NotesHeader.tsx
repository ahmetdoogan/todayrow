"use client";
import { Sun, Moon, Trash2, Check } from 'lucide-react';
import ViewToggle from '@/components/common/ViewToggle';

interface NotesHeaderProps {
  isSelectionMode: boolean;
  setIsSelectionMode: (value: boolean) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkPin: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export default function NotesHeader({ 
  isSelectionMode, 
  setIsSelectionMode, 
  selectedCount,
  onBulkDelete,
  onBulkPin,
  darkMode,
  toggleTheme,
  view,
  onViewChange,
}: NotesHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSelectionMode(!isSelectionMode)}
          className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {isSelectionMode ? "Seçimi İptal Et" : "Çoklu Seç"}
        </button>

        {isSelectionMode && selectedCount > 0 && (
          <>
            <button
              onClick={onBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-sm text-white rounded-lg hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Seçilenleri Sil ({selectedCount})
            </button>
            
            <button
              onClick={onBulkPin}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-sm text-white rounded-lg hover:bg-blue-600"
            >
              <Check className="w-4 h-4" />
              Seçilenleri Sabitle
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ViewToggle view={view} onViewChange={onViewChange} />
        
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}