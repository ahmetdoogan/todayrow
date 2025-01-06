"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';

interface UseKeyboardShortcutsProps {
  onEscapePress?: () => void;  // Yeni eklendi
}

export const useKeyboardShortcuts = ({ onEscapePress }: UseKeyboardShortcutsProps = {}) => {
  const router = useRouter();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape tuşu - callback'i çağır
      if (e.key === 'Escape' && onEscapePress) {
        e.preventDefault();
        onEscapePress();
      }

      // Command/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchBox = document.querySelector('input[type="text"][placeholder*="Ara"]') as HTMLInputElement;
        if (searchBox) searchBox.focus();
      }

      // Option (Alt) tuşu ile olan kısayollar
      if ((window.navigator.platform.includes('Mac') ? e.altKey : e.altKey) && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        switch (e.code) {
          case 'Digit1':
            e.preventDefault();
            router.push('/dashboard');
            break;
          case 'Digit2':
            e.preventDefault();
            router.push('/dashboard/notes');
            break;
          case 'Digit3':
            e.preventDefault();
            router.push('/dashboard/calendar');
            break;
          case 'Digit4':
            e.preventDefault();
            router.push('/dashboard/settings');
            break;
          case 'KeyN':
            e.preventDefault();
            const newContentBtn = document.querySelector('[data-new-content]') as HTMLButtonElement;
            if (newContentBtn) newContentBtn.click();
            break;
          case 'KeyM':
            e.preventDefault();
            const newNoteBtn = document.querySelector('[data-new-note]') as HTMLButtonElement;
            if (newNoteBtn) newNoteBtn.click();
            break;
          case 'KeyD':
            e.preventDefault();
            toggleTheme();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, toggleTheme, onEscapePress]);
};