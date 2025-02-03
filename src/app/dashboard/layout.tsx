"use client";

import Sidebar from '@/components/layout/Sidebar';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ContentModal from '@/components/content/ContentModal';
import NoteModal from '@/components/notes/NoteModal';
import PlanForm from '@/components/planner/PlanForm';
import { PlannerProvider } from '@/context/PlannerContext';
import { useNotes, NotesProvider } from '@/context/NotesContext';
import WelcomePopup from "@/components/onboarding/WelcomePopup";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabaseClient';
import { useSubscription } from '@/hooks/useSubscription';
import { Content } from '@/types/content'; // Eğer Content tipi varsa

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
  const { createNote } = useNotes();

  // Düzenlenecek içeriği tutan state ekliyoruz.
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  // Örneğin; kullanıcı içeriğe tıkladığında düzenleme modunu açmak için:
  const handleEditContent = (content: Content) => {
    setSelectedContent(content);
    setIsContentModalOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-stone-100 dark:bg-gray-900">
      <Sidebar
        onNewContent={() => {
          // Yeni içerik eklerken seçili içeriği temizleyelim.
          setSelectedContent(null);
          setIsContentModalOpen(true);
        }}
        onNewNote={() => setIsNoteModalOpen(true)}
        onCollapse={setIsSidebarCollapsed}
        onNewPlan={() => setIsPlanModalOpen(true)}
      />
      <main className="flex-1 overflow-auto transition-all duration-300 p-4">
        {children}
        {/* Örnek: İçerik kartlarında düzenleme butonuna tıklandığında handleEditContent çağrılabilir.
            Eğer içerik kartlarınız Dashboard içinde render ediliyorsa,
            ilgili düzenleme butonunda aşağıdaki gibi çağırın:
            
            <button onClick={() => handleEditContent(content)}>Düzenle</button>
        */}
      </main>

      {/* ContentModal'u, düzenleme modunda açarken contentId prop'unu geçiyoruz.
          Eğer selectedContent null ise bu mod yeni içerik ekleme modunu çalıştırır,
          aksi halde selectedContent.id güncelleme (update) modunu tetikler. */}
      <ContentModal
        isOpen={isContentModalOpen}
        onClose={() => setIsContentModalOpen(false)}
        contentId={selectedContent ? selectedContent.id : undefined}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={async (noteData) => {
          try {
            await createNote(noteData);
            setIsNoteModalOpen(false);
          } catch (error) {
            console.error('Error creating note:', error);
            throw error;
          }
        }}
      />

      <PlanForm />

      {showWelcome && (
        <WelcomePopup onClose={() => setShowWelcome(false)} />
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  const { loading, isExpired } = useSubscription();

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

  useEffect(() => {
    if (!loading && isExpired) {
      router.replace('/paywall');
    }
  }, [loading, isExpired, router]);

  if (isChecking || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <NotesProvider>
      <PlannerProvider>
        <DashboardLayoutInner
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
        >
          {children}
        </DashboardLayoutInner>
      </PlannerProvider>
    </NotesProvider>
  );
}
