"use client";

import { useState } from 'react';
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import ShortcutsModal from "./ShortcutsModal";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Parametreleri kaldırdık:
  useKeyboardShortcuts();

  return (
    <>
      {children}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </>
  );
}
