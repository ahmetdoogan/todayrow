"use client";
import { motion } from "framer-motion";
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ShortcutsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShortcutsHelpModal({ isOpen, onClose }: ShortcutsHelpModalProps) {
  const t = useTranslations('common.shortcuts');

  const shortcuts = [
    { key: '⌘ K', win: 'Ctrl + K', desc: t('globalSearch') },
    { key: '⌥ 1', win: 'Alt + 1', desc: t('contents') },
    { key: '⌥ 2', win: 'Alt + 2', desc: t('notes') },
    { key: '⌥ 3', win: 'Alt + 3', desc: t('calendar') },
    { key: '⌥ 4', win: 'Alt + 4', desc: t('settings') },
    { key: '⌥ N', win: 'Alt + N', desc: t('newContent') },
    { key: '⌥ M', win: 'Alt + M', desc: t('newNote') },
    { key: '⌥ D', win: 'Alt + D', desc: t('darkMode') },
    { key: 'Shift + ?', win: 'Shift + ?', desc: t('shortcuts') }
  ];

  if (!isOpen) return null;

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md mx-4 rounded-2xl shadow-xl" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {t('title')}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.key}
                className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800"
              >
                <kbd className="px-2 py-1 text-sm bg-slate-100 dark:bg-slate-800 rounded-md">
                  {isMac ? shortcut.key : shortcut.win}
                </kbd>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {shortcut.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}