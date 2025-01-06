"use client";

import { useEffect, useState, useRef } from 'react';
import { getAllFolders, getAllTags, TagOrFolder } from '@/services/tags';
import { Folder, Tag, X, Check } from 'lucide-react';
import { useTranslations } from 'next-intl'; // useTranslations hook'unu ekledik

interface NotesFilterProps {
  onFilterChange: (filters: { folder?: string; tags: string[] }) => void;
}

export function NotesFilter({ onFilterChange }: NotesFilterProps) {
  const [folders, setFolders] = useState<TagOrFolder[]>([]);
  const [tags, setTags] = useState<TagOrFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFolders, setShowFolders] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const folderButtonRef = useRef<HTMLButtonElement>(null);
  const tagButtonRef = useRef<HTMLButtonElement>(null);
  const folderDropdownRef = useRef<HTMLDivElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("notesFilter"); // Çevirileri yükledik

  useEffect(() => {
    const loadFilters = async () => {
      setIsLoading(true);
      try {
        const [folderResults, tagResults] = await Promise.all([
          getAllFolders(),
          getAllTags()
        ]);
        setFolders(folderResults);
        setTags(tagResults);
      } catch (error) {
        console.error('Error loading filters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFilters();
  }, []);

  useEffect(() => {
    onFilterChange({
      folder: selectedFolder,
      tags: selectedTags
    });
  }, [selectedFolder, selectedTags, onFilterChange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (folderButtonRef.current && !folderButtonRef.current.contains(event.target as Node) &&
          folderDropdownRef.current && !folderDropdownRef.current.contains(event.target as Node)) {
        setShowFolders(false);
      }
      if (tagButtonRef.current && !tagButtonRef.current.contains(event.target as Node) &&
          tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setShowTags(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="h-8 flex items-center space-x-2">
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        {/* Folder Filter */}
        <div className="relative">
          <button
            ref={folderButtonRef}
            onClick={() => {
              setShowFolders(!showFolders);
              setShowTags(false);
            }}
            className={`
              flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors
              ${selectedFolder 
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}
            `}
          >
            <Folder className="w-4 h-4 mr-2" />
            {selectedFolder || t("folderPlaceholder")} {/* Çeviri anahtarı */}
          </button>

          {showFolders && (
            <div
              ref={folderDropdownRef}
              className="absolute mt-1 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[200px]"
            >
              {folders.map(folder => (
                <button
                  key={folder.name}
                  onClick={() => {
                    setSelectedFolder(selectedFolder === folder.name ? undefined : folder.name);
                    setShowFolders(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {folder.name === selectedFolder && <Check size={14} />}
                    {folder.name}
                  </span>
                  <span className="text-xs text-gray-500">{folder.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tag Filter */}
        <div className="relative">
          <button
            ref={tagButtonRef}
            onClick={() => {
              setShowTags(!showTags);
              setShowFolders(false);
            }}
            className={`
              flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors
              ${selectedTags.length > 0
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}
            `}
          >
            <Tag className="w-4 h-4 mr-2" />
            {selectedTags.length > 0 ? t("selectedTags", { count: selectedTags.length }) : t("tagsPlaceholder")} {/* Çeviri anahtarları */}
          </button>

          {showTags && (
            <div
              ref={tagDropdownRef}
              className="absolute mt-1 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[200px]"
            >
              {tags.map(tag => (
                <button
                  key={tag.name}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag.name)
                        ? prev.filter(t => t !== tag.name)
                        : [...prev, tag.name]
                    );
                  }}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {selectedTags.includes(tag.name) && <Check size={14} />}
                    {tag.name}
                  </span>
                  <span className="text-xs text-gray-500">{tag.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {(selectedFolder || selectedTags.length > 0) && (
          <button
            onClick={() => {
              setSelectedFolder(undefined);
              setSelectedTags([]);
            }}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {t("clearFilters")} {/* Çeviri anahtarı */}
          </button>
        )}
      </div>
    </div>
  );
}