"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { X, Check, ChevronDown } from 'lucide-react';
import { searchTagsAndFolders, TagOrFolder } from '@/services/tags';
import { useTranslations } from 'next-intl';

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isFolder?: boolean;
}

export function TagInput({ 
  value, 
  onChange, 
  placeholder, 
  isFolder = false 
}: TagInputProps) {
  const t = useTranslations('common');
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<string[]>(() => {
    return value ? value.split(',').map(t => t.trim()).filter(Boolean) : [];
  });
  const [suggestions, setSuggestions] = useState<TagOrFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newTags = value ? value.split(',').map(t => t.trim()).filter(Boolean) : [];
    setTags(newTags);
  }, [value]);

  const fetchSuggestions = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const results = await searchTagsAndFolders(
        searchTerm,
        isFolder ? 'folder' : 'tag'
      );
      setSuggestions(results.slice(0, 5));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [isFolder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showSuggestions) {
        fetchSuggestions(inputValue);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [inputValue, showSuggestions, fetchSuggestions]);

  const addTag = useCallback((newTag: string) => {
    if (newTag.trim()) {
      if (isFolder) {
        setTags([newTag.trim()]);
        onChange(newTag.trim());
      } else {
        if (!tags.includes(newTag.trim())) {
          const updatedTags = [...tags, newTag.trim()];
          setTags(updatedTags);
          onChange(updatedTags.join(', '));
        }
      }
    }
  }, [tags, isFolder, onChange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) && 
          dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateDropdownPosition = () => {
    if (inputRef.current && dropdownRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      dropdownRef.current.style.width = `${inputRect.width}px`;
      dropdownRef.current.style.position = 'fixed';
      dropdownRef.current.style.top = `${inputRect.bottom + 4}px`;
      dropdownRef.current.style.left = `${inputRect.left}px`;
      dropdownRef.current.style.zIndex = '9999';
    }
  };

  useEffect(() => {
    if (showSuggestions) {
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition);
      window.addEventListener('resize', updateDropdownPosition);
    }

    return () => {
      window.removeEventListener('scroll', updateDropdownPosition);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [showSuggestions]);

  return (
    <div ref={inputRef} className="space-y-2 relative">
      <div className="flex flex-wrap gap-2 min-h-[28px]">
        {tags.map(tag => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-1 text-sm rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => {
                const newTags = tags.filter(t => t !== tag);
                setTags(newTags);
                onChange(newTags.join(', '));
              }}
              className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      {(!isFolder || tags.length === 0) && (
        <div className="relative">
          <div className="flex items-center relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (inputValue.trim()) {
                    addTag(inputValue);
                    setInputValue('');
                    setShowSuggestions(false);
                  }
                } else if (e.key === ',' && !isFolder) {
                  e.preventDefault();
                  if (inputValue.trim()) {
                    addTag(inputValue);
                    setInputValue('');
                  }
                }
              }}
              placeholder={isFolder ? t('tagInput.folderPlaceholder') : t('tagInput.inputPlaceholder')}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-white pr-8"
            />
            <ChevronDown 
              className={`absolute right-3 w-4 h-4 text-gray-400 transition-transform duration-200 ${showSuggestions ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      )}

      {showSuggestions && (
        <div 
          ref={dropdownRef}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {isLoading ? (
            <div className="p-2 text-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white mx-auto" />
            </div>
          ) : suggestions.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              {suggestions.map(item => (
                <button
                  key={item.name}
                  onClick={() => {
                    addTag(item.name);
                    setInputValue('');
                    setShowSuggestions(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {tags.includes(item.name) && (
                      <Check size={14} className="text-green-500" />
                    )}
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-500">{item.count} {t('tagInput.usage')}</span>
                </button>
              ))}
            </div>
          ) : inputValue && (
            <div className="p-3 text-sm text-gray-500 dark:text-gray-400">
              {isFolder ? t('tagInput.newFolder', { inputValue }) : t('tagInput.newTag', { inputValue })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}