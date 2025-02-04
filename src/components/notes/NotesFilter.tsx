"use client";

import { useEffect, useState, useRef } from 'react';
import { getAllFolders, getAllTags, TagOrFolder, deleteFolder, deleteTag } from '@/services/tags';
import { Folder, Tag, Check, X, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useNotes } from '@/context/NotesContext';
import { toast } from 'react-toastify';

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

  const { updateFolderColor, getFolderColor } = useNotes();
  const t = useTranslations('notesFilter');

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

  useEffect(() => {
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
      if (
        folderButtonRef.current &&
        !folderButtonRef.current.contains(event.target as Node) &&
        folderDropdownRef.current &&
        !folderDropdownRef.current.contains(event.target as Node)
      ) {
        setShowFolders(false);
      }
      if (
        tagButtonRef.current &&
        !tagButtonRef.current.contains(event.target as Node) &&
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(event.target as Node)
      ) {
        setShowTags(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteFolder = async (folderName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t('notes.confirmDeleteFolder'))) {
      try {
        await deleteFolder(folderName);
        await loadFilters();
        if (selectedFolder === folderName) {
          setSelectedFolder(undefined);
        }
        toast.success(t('notes.folderDeleted'));
      } catch (error) {
        console.error('Error deleting folder:', error);
        toast.error(t('notes.folderDeleteError'));
      }
    }
  };

  const handleDeleteTag = async (tagName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t('notes.confirmDeleteTag'))) {
      try {
        await deleteTag(tagName);
        await loadFilters();
        setSelectedTags(prev => prev.filter(t => t !== tagName));
        toast.success(t('notes.tagDeleted'));
      } catch (error) {
        console.error('Error deleting tag:', error);
        toast.error(t('notes.tagDeleteError'));
      }
    }
  };

  const availableColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

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
            className={`flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors
              ${selectedFolder 
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            <Folder className="w-4 h-4 mr-2" />
            {selectedFolder || t('folderPlaceholder')}
          </button>

          {showFolders && (
            <div
              ref={folderDropdownRef}
              className="absolute mt-1 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[200px]"
            >
              {folders.map(folder => (
                <div
                  key={folder.name}
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 group"
                >
                  <button
                    onClick={() => {
                      setSelectedFolder(selectedFolder === folder.name ? undefined : folder.name);
                      setShowFolders(false);
                    }}
                    className="flex items-center gap-2 flex-1"
                  >
                    <Folder className="w-4 h-4" />
                    <span>{folder.name}</span>
                    <span className="text-xs text-gray-500">({folder.count})</span>
                  </button>
                  
                  <div className="flex items-center gap-1 ml-2">
                    {/* Renk seçici */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          className={`w-4 h-4 rounded-full ${color} transition-all
                            ${getFolderColor(folder.name) === color ? 'ring-2 ring-offset-2' : 'hover:scale-110'}
                          `}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateFolderColor(folder.name, color);
                          }}
                          title={t('notes.setFolderColor')}
                        />
                      ))}
                    </div>
                    {/* Silme butonu */}
                    <button
                      onClick={(e) => handleDeleteFolder(folder.name, e)}
                      className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title={t('deleteFolder')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
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
            className={`flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors
              ${selectedTags.length > 0
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            <Tag className="w-4 h-4 mr-2" />
            {selectedTags.length > 0 ? t('notes.selectedTags', { count: selectedTags.length }) : t('tagsPlaceholder')}
          </button>

          {showTags && (
            <div
              ref={tagDropdownRef}
              className="absolute mt-1 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[200px]"
            >
              {tags.map(tag => (
                <div
                  key={tag.name}
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 group"
                >
                  <button
                    onClick={() => {
                      setSelectedTags(prev => 
                        prev.includes(tag.name)
                          ? prev.filter(t => t !== tag.name)
                          : [...prev, tag.name]
                      );
                    }}
                    className="flex items-center gap-2 flex-1"
                  >
                    <span className="flex items-center gap-2">
                      {selectedTags.includes(tag.name) && <Check size={14} />}
                      {tag.name}
                    </span>
                    <span className="text-xs text-gray-500">({tag.count})</span>
                  </button>
                  
                  {/* Silme butonu */}
                  <button
                    onClick={(e) => handleDeleteTag(tag.name, e)}
                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title={t('notes.deleteTag')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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
            {t('notes.clearFilters')}
          </button>
        )}
      </div>
    </div>
  );
}