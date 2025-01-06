"use client";

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ['⌘', 'K'], winKeys: ['Ctrl', 'K'], desc: 'Global arama' },
  { keys: ['⌥', '1'], winKeys: ['Alt', '1'], desc: 'İçerikler sayfası' },
  { keys: ['⌥', '2'], winKeys: ['Alt', '2'], desc: 'Notlar sayfası' },
  { keys: ['⌥', '3'], winKeys: ['Alt', '3'], desc: 'Takvim sayfası' },
  { keys: ['⌥', '4'], winKeys: ['Alt', '4'], desc: 'Ayarlar sayfası' },
  { keys: ['⌥', 'N'], winKeys: ['Alt', 'N'], desc: 'Yeni içerik ekle' },
  { keys: ['⌥', 'M'], winKeys: ['Alt', 'M'], desc: 'Yeni not ekle' },
  { keys: ['⌥', 'D'], winKeys: ['Alt', 'D'], desc: 'Dark mode geçiş' },
  { keys: ['Shift', '?'], winKeys: ['Shift', '?'], desc: 'Kısayol listesi' },
  { keys: ['Esc'], winKeys: ['Esc'], desc: 'Modalları kapat' },
];

const isMac = window.navigator.platform.includes('Mac');

export default function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

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
        className="bg-white dark:bg-slate-900 w-full max-w-lg mx-4 rounded-2xl shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Klavye Kısayolları
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {shortcuts.map((shortcut) => (
            <div 
              key={shortcut.desc} 
              className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 last:border-0"
            >
              <div className="flex gap-2">
                {(isMac ? shortcut.keys : shortcut.winKeys).map((key, idx) => (
                  <kbd 
                    key={idx}
                    className="px-2 py-1 text-sm bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {shortcut.desc}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}