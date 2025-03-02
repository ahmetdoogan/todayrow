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
import { Content } from '@/types/content';

// Soft paywall modal
import PricingModal from '@/components/modals/PricingModal';

// React-Toastify (tüm projede de bu kullanılıyor)
import { toast } from 'react-toastify';

interface DashboardLayoutInnerProps {
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
}

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
}: DashboardLayoutInnerProps) {

  // Not oluşturma fonksiyonunu context'ten alıyoruz
  const { createNote } = useNotes();

  // İçerik düzenlemek için state
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  // Soft paywall modal
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // Abonelik durumu
  const { loading, isExpired } = useSubscription();

  // Basit bir fonksiyon: abone değilse PricingModal aç, yoksa callback'i çalıştır
  const handleAction = (action: () => void) => {
    if (isExpired) {
      setIsPricingModalOpen(true);
      return;
    }
    action();
  };

  // (Opsiyonel) içerik düzenlemesi örneği
  const handleEditContent = (content: Content) => {
    setSelectedContent(content);
    setIsContentModalOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-stone-100 dark:bg-gray-900">
      <Sidebar
        onNewContent={() => handleAction(() => {
          setSelectedContent(null);
          setIsContentModalOpen(true);
        })}
        onNewNote={() => handleAction(() => setIsNoteModalOpen(true))}
        onCollapse={setIsSidebarCollapsed}
        onNewPlan={() => handleAction(() => setIsPlanModalOpen(true))}
      />

      <main className="flex-1 overflow-auto transition-all duration-300 p-4">
        {children}
      </main>

      {/* ContentModal */}
      <ContentModal
        isOpen={isContentModalOpen}
        onClose={() => setIsContentModalOpen(false)}
        contentId={selectedContent ? selectedContent.id : undefined}
      />

      {/* NoteModal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={async (noteData) => {
          try {
            await createNote(noteData);
            setIsNoteModalOpen(false);
          } catch (error) {
            console.error('Error creating note:', error);
            // Şu an sabit Türkçe:
            toast.error('Not oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
            // Eğer i18n kullanacaksanız:
            // toast.error(t('createNote'));
            throw error;
          }
        }}
      />

      <PlanForm />

      {showWelcome && (
        <WelcomePopup onClose={() => setShowWelcome(false)} />
      )}

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        isTrialEnded={isExpired} // Trial bitti mi?
      />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Modal state'leri
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  const { loading, isExpired } = useSubscription();

  // Oturum kontrolü
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          window.location.href = '/auth/login';
          return;
        }
        
        // Önce localStorage'ı kontrol et (daha hızlı)
        let hasSeenLocalStorage = localStorage.getItem('has_seen_welcome') === 'true';
        
        // Yeni kullanıcı girişinde localStorage'ı temizle
        // Profilden veya oturumdan alınan bilgiler yoksa yeni kullanıcı olarak kabul edelim
        if (Object.keys(session.user.user_metadata || {}).length <= 3) { // Sadece email, sub gibi temel bilgiler var
          console.log('New user detected, clearing localStorage welcome flag');
          localStorage.removeItem('has_seen_welcome');
          // hasSeenLocalStorage değişkenini güncelle
          hasSeenLocalStorage = false; // Şimdi false olarak güncelledik
        }
        
        // Supabase'den de kontrol et
        const hasSeen = session.user.user_metadata?.has_seen_welcome;
        
        console.log('Welcome popup debug:', {
          hasSeenLocalStorage,
          hasSeenMetadata: hasSeen === true,
          shouldShow: !(hasSeenLocalStorage || hasSeen === true)
        });

        // İkisinden biri true ise popup'ı gösterme (VEYA operatörü)
        if (hasSeenLocalStorage || hasSeen === true) {
          setShowWelcome(false);
        } else {
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

  // eğer user yoksa login'e at
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [loading, user, router]);

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
