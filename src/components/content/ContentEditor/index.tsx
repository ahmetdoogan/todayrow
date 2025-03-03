"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useContent } from '@/context/ContentContext';
import { Content } from '@/types/content';
import { Link, Info } from 'lucide-react';
import { contentService } from '@/services/contentService';
import { useTranslations } from 'next-intl';

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  contentId?: number;  // Hangi içeriğin düzenlendiğini bilmek için
  placeholder?: string;
  className?: string;
  required?: boolean;
}

interface Position {
  start: number;
  end: number;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  value,
  onChange,
  contentId,
  placeholder,
  className = '',
  required = false,
}) => {
  const { contents } = useContent();
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<Content[]>([]);
  const [cursorPosition, setCursorPosition] = useState<Position | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = useTranslations('common.editor');

  // İçerik aramayı güncelleyen fonksiyon
  const updateSearch = (text: string, cursorPos: number) => {
    const beforeCursor = text.slice(0, cursorPos);
    const searchStart = beforeCursor.lastIndexOf('[[');
    
    if (searchStart === -1) {
      setSuggestionsVisible(false);
      return;
    }

    const searchEnd = beforeCursor.indexOf(']]', searchStart);
    if (searchEnd !== -1 && searchEnd < cursorPos) {
      setSuggestionsVisible(false);
      return;
    }

    const searchText = beforeCursor.slice(searchStart + 2);
    if (searchText) {
      const filtered = contents.filter(content =>
        content.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setSuggestions(filtered);
      setSuggestionsVisible(filtered.length > 0);
      setSearchTerm(searchText);
      setCursorPosition({ start: searchStart, end: searchStart + 2 + searchText.length });
    } else {
      setSuggestionsVisible(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    updateSearch(newValue, e.target.selectionStart);
  };

  const insertLinkTemplate = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.slice(0, start) + '[[]]' + value.slice(end);
    
    onChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2);
    }, 0);
  };

  const handleSuggestionClick = (content: Content) => {
    if (!cursorPosition) return;

    const beforeText = value.slice(0, cursorPosition.start);
    const afterText = value.slice(cursorPosition.end);
    const newValue = beforeText + `[[${content.title}]]` + afterText;

    onChange(newValue);
    setSuggestionsVisible(false);
    setSearchTerm('');

    if (textareaRef.current) {
      const newCursorPos = beforeText.length + content.title.length + 4;
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2 items-start">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          placeholder={placeholder || t('placeholder')}
          className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent ${className}`}
          required={required}
        />
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={insertLinkTemplate}
            className="flex-shrink-0 p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            title={t('toolbarHints.link')}
          >
            <Link className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="group relative flex-shrink-0 p-2 text-slate-400 hover:text-slate-500"
            aria-label={t('toolbarHints.link')}
          >
            <Info className="w-3.5 h-3.5" />
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 text-xs text-center bg-slate-900 text-white rounded-lg shadow-lg z-20">
  {t('toolbarHints.tooltip')}
</div>
          </button>
        </div>
      </div>
      
      {suggestionsVisible && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          {suggestions.map(content => (
            <button
              key={content.id}
              type="button"
              onClick={() => handleSuggestionClick(content)}
              className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="font-medium text-slate-900 dark:text-white">
                {content.title}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                {content.details}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentEditor;