"use client";
import Sidebar from '@/components/layout/sidebar';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ContentModal from '@/components/content/ContentModal';
import NoteModal from '@/components/notes/NoteModal';
import PlanForm from '@/components/planner/PlanForm';
import { PlannerProvider } from '@/context/PlannerContext';
import { Note } from '@/services/notes';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabaseClient';
import { NotesProvider, useNotes } from '@/context/NotesContext';
import WelcomePopup from "@/components/onboarding/WelcomePopup";

/**
 * ----------------------------------------------------------------
 * 1) Child Component: Asıl "useNotes()" burada kullanıyoruz
 * ----------------------------------------------------------------
 */
function DashboardLayoutInner({
  children,
  isContentModalOpen,
  setIsContentModalOpen,
  isNoteModalOpen,
  setIsNoteModalOpen,
  isPlanModalOpen,
  setIsPlanModalOpen,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  showWelcome,
  setShowWelcome
}: {
  children: React.ReactNode;
  isContentModalOpen: boolean;
  setIsContentModalOpen: (v: boolean) => void;
  isNoteModalOpen: boolean;
  setIsNoteModalOpen: (v: boolean) => void;
  isPlanModalOpen: boolean;
  setIsPlanModalOpen: (v: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (v: boolean) => void;
  showWelcome: boolean;
  setShowWelcome: (v: boolean) => void;
}) {
  // Artık HATA vermeyecek, çünkü bu component Provider altında render ediliyor
  const { createNote } = useNotes();

  return (
    <div className="flex h-screen overflow-hidden bg-stone-100 dark:bg-gray-900">
      <Sidebar
        onNewContent={() => setIsContentModalOpen(true)}
        onNewNote={() => setIsNoteModalOpen(true)}
        onCollapse={setIsSidebarCollapsed}
        onNewPlan={() => setIsPlanModalOpen(true)}
      />
      <main
        className={`
          flex-1 overflow-auto
          transition-all duration-300
          p-4
        `}
      >
        {children}
      </main>

      {/* İçerik Modal */}
      <ContentModal
        isOpen={isContentModalOpen}
        onClose={() => setIsContentModalOpen(false)}
      />

      {/* Not Modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={async (noteData) => {
          try {
            // Burada artıık service çağırmak yerine, context fonksiyonunu kullan
            await createNote(noteData);
            setIsNoteModalOpen(false);
          } catch (error) {
            console.error('Error creating note:', error);
            throw error;
          }
        }}
      />

      {/* Plan Modal */}
      <PlanForm
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
      />

      {/* Hoş geldin popup */}
      {showWelcome && (
        <WelcomePopup onClose={() => setShowWelcome(false)} />
      )}
    </div>
  );
}

/**
 * ----------------------------------------------------------------
 * 2) Parent Component: Provider'ı saran kısım
 * ----------------------------------------------------------------
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Session kontrolü
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          window.location.href = '/auth/login';
          return;
        }

        const hasSeen = session.user.user_metadata?.has_seen_welcome;
        if (hasSeen === undefined || hasSeen === false) {
          setShowWelcome(true);
        }
        
        setIsChecking(false);
      } catch (error) {
        console.error('Session check error:', error);
        window.location.href = '/auth/login';
      }
    };

    checkSession();
  }, []);

  // Loading ekranı
  if (isChecking) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  // Artık buradaki Provider, alt tarafta DashboardLayoutInner'ı sarıyor
  return (
    <NotesProvider>
      <PlannerProvider>
        <DashboardLayoutInner
          children={children}
          isContentModalOpen={isContentModalOpen}
          setIsContentModalOpen={setIsContentModalOpen}
          isNoteModalOpen={isNoteModalOpen}
          setIsNoteModalOpen={setIsNoteModalOpen}
          isPlanModalOpen={isPlanModalOpen}
          setIsPlanModalOpen={setIsPlanModalOpen}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          showWelcome={showWelcome}
          setShowWelcome={setShowWelcome}
        />
      </PlannerProvider>
    </NotesProvider>
  );
}