"use client";

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Bold, Italic, List, Heading2, Link as LinkIcon, 
  Minus, Quote, Code, Eye, EyeOff
} from 'lucide-react';
import { NOTE_LINK_REGEX } from '@/utils/noteUtils';
import { useTranslations } from 'next-intl';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Özelleştirilmiş ReactMarkdown bileşeni için Link componenti
const NoteLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
  if (NOTE_LINK_REGEX.test(href)) {
    const slug = href.slice(2, -2); // [[slug]] -> slug
    return (
      <a 
        href={`/dashboard/notes/${slug}`}
        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
      >
        {children}
      </a>
    );
  }
  
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
};

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = useTranslations('common.notes');

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(start, end);
    const lines = selectedText.split('\n');
    
    if (lines.length > 1 && prefix === '- ') {
      const newLines = lines.map(line => prefix + line).join('\n');
      const newText = text.substring(0, start) + newLines + text.substring(end);
      onChange(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length,
          start + newLines.length
        );
      }, 0);
    } else {
      const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
      onChange(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          selectedText ? start : start + prefix.length,
          selectedText ? end + prefix.length + suffix.length : start + prefix.length
        );
      }, 0);
    }
  };

  const handleTab = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertMarkdown('  ');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          type="button"
          onClick={() => insertMarkdown('**', '**')}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title={t('bold')}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('*', '*')}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title={t('italic')}
        >
          <Italic size={16} />
        </button>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
        <button
          type="button"
          onClick={() => insertMarkdown('## ')}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title={t('heading')}
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('- ')}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title={t('list')}
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('> ')}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title={t('quote')}
        >
          <Quote size={16} />
        </button>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
        <button
          type="button"
          onClick={() => insertMarkdown('---\n')}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title={t('divider')}
        >
          <Minus size={16} />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('`', '`')}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title={t('code')}
        >
          <Code size={16} />
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          title={showPreview ? t('preview.hideButton') : t('preview.button')}
        >
          {showPreview ? (
            <>
              <EyeOff size={16} />
              <span>{t('preview.hideButton')}</span>
            </>
          ) : (
            <>
              <Eye size={16} />
              <span>{t('preview.button')}</span>
            </>
          )}
        </button>
      </div>

      {/* Editor + Preview */}
      <div className="flex-1 min-h-0 flex">
        <div className={`h-full transition-all duration-200 ${showPreview ? 'w-1/2 border-r border-gray-200 dark:border-gray-700' : 'w-full'}`}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleTab}
            placeholder={placeholder}
            className="w-full h-full p-4 bg-white dark:bg-gray-800 border-0 resize-none focus:ring-0 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        {showPreview && (
          <div className="w-1/2 h-full overflow-auto p-4 bg-white dark:bg-gray-800">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown components={{
                a: NoteLink as any
              }}>
                {value || t('preview.visibleText')}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}