"use client";
import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      <button
        onClick={() => onViewChange('grid')}
        className={`h-8 px-3 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
          view === 'grid'
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="hidden sm:inline">Grid</span>
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`h-8 px-3 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
          view === 'list'
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700'
        }`}
      >
        <List className="w-4 h-4" />
        <span className="hidden sm:inline">Liste</span>
      </button>
    </div>
  );
};

export default ViewToggle;