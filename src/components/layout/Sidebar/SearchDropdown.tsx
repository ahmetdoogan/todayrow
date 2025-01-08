"use client";
import React from 'react';
import { Search } from 'lucide-react';
import { Content } from '@/types/content';
import { Plan } from '@/types/planner';
import type { Note } from '@/types/notes';

type SearchResultType = 'content' | 'note' | 'plan'; // Bu satırı ekledik

type SearchResult =
  | (Content & { type: 'content' })
  | (Note & { type: 'note' })
  | (Plan & { type: 'plan' });

interface SearchDropdownProps {
  searchValue: string;
  searchResults: SearchResult[];
  onResultClick: (result: SearchResult) => void;
  className?: string;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ 
  searchValue, 
  searchResults, 
  onResultClick,
  className = ""
}) => {
  if (searchValue === "" || searchResults.length === 0) return null;

  const getBadgeStyle = (type: SearchResultType) => {
    switch(type) {
      case 'content':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200';
      case 'note':
        return 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-200';
      case 'plan':
        return 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-200';
      default:
        return '';
    }
  };

  const getTypeLabel = (type: SearchResultType) => {
    switch(type) {
      case 'content': return 'İçerik';
      case 'note':    return 'Not';
      case 'plan':    return 'Plan';
      default:        return type;
    }
  };

  return (
    <div
      className={`
        absolute left-0 right-0 mt-2 
        bg-white dark:bg-gray-800 
        rounded-lg shadow-lg 
        border border-gray-200 dark:border-gray-700 
        max-h-80 overflow-y-auto z-50 
        ${className}
      `}
    >
      <div className="p-2">
        {searchResults.map((result) => (
          <button
            key={result.id}
            onClick={() => onResultClick(result)}
            className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <div className="flex items-start space-x-3">
              <Search className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {result.title}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${getBadgeStyle(result.type)}`}>
                    {getTypeLabel(result.type)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                  {result.type === 'plan'
                    ? result.details
                    : result.content
                  }
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchDropdown;