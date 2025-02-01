"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionBadge } from '@/components/subscription/SubscriptionBadge';
import { Button } from "@/components/ui/button";
import PricingModal from '@/components/modals/PricingModal';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Layout,
  Calendar,
  Settings,
  PlusCircle,
  LogOut,
  User,
  Search,
  ChevronLeft,
  FileText,
  CalendarCheck,
  BadgeCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';
import { useNotes } from '@/context/NotesContext';
import { usePlanner } from '@/context/PlannerContext';
import { fuzzySearchInText } from '@/utils/fuzzySearch';
import { Logo } from '@/components/ui/logo';
import type { Plan } from '@/types/planner';
import { useTranslations } from 'next-intl';

interface SidebarProps {
  onNewContent: () => void;
  onNewNote: () => void;
  onCollapse: (value: boolean) => void;
  onNewPlan: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onNewContent,
  onNewNote,
  onCollapse,
  onNewPlan
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const t = useTranslations();

  const { user, signOut } = useAuth();
  const { contents, setSelectedContent } = useContent();
  const { notes } = useNotes();
  const {
    plans,
    setSelectedPlan,
    setIsModalOpen,
    setDraggedPlan,
    setIsEditingPlan,
    selectedDate
  } = usePlanner();

  // useSubscription hook'undan isVerifiedUser'ı da alıyoruz
  const { trialDaysLeft, status, isPro, loading, isTrialing, isVerifiedUser } = useSubscription();

  console.log("Subscription data in Sidebar:", {
    trialDaysLeft,
    status,
    isTrialing,
    isPro,
    loading,
    isVerifiedUser
  });

  const sidebarT = useTranslations('common.sidebar');

  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Yeni: Kullanıcının güncellenmiş profil verilerini (ilk/son isim gibi) tutacağımız state
  const [profile, setProfile] = useState<any>(null);

  const navItems = [
    { label: t('common.sidebar.menu.plans'), icon: CalendarCheck, href: '/dashboard' },
    { label: t('common.sidebar.menu.contents'), icon: Layout, href: '/dashboard/contents' },
    { label: t('common.sidebar.menu.notes'), icon: FileText, href: '/dashboard/notes' },
    { label: t('common.sidebar.menu.calendar'), icon: Calendar, href: '/dashboard/calendar' },
    { label: t('common.sidebar.menu.settings'), icon: Settings, href: '/dashboard/settings' }
  ];

  useEffect(() => {
    setHydrated(true);
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setIsCollapsed(mobile);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    onCollapse?.(isCollapsed);
  }, [isCollapsed, onCollapse]);

  // Yeni: Kullanıcının güncellenmiş profil bilgilerini Supabase'den çekiyoruz.
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      }
    };
    fetchProfile();
  }, [user, supabase]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePlanCreate = () => {
    setDraggedPlan(null);
    const now = new Date();
    const planStartTime = new Date(selectedDate);
    planStartTime.setHours(now.getHours(), now.getMinutes(), 0, 0);
    const planEndTime = new Date(planStartTime);
    planEndTime.setHours(planEndTime.getHours() + 1);

    const newPlan: Plan = {
      id: 0,
      title: '',
      details: '',
      start_time: planStartTime.toISOString(),
      end_time: planEndTime.toISOString(),
      is_completed: false,
      plan_type: 'regular',
      order: 0,
      user_id: user?.id || 0,
      color: '#000000',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setSelectedPlan(newPlan);
    setIsEditingPlan(false);
    setIsModalOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (!value.trim()) {
        setSearchResults([]);
        return;
      }

      const searchTerm = value.toLowerCase();
      const exactTitleMatches: any[] = [];
      const contentMatches: any[] = [];

      contents.forEach(content => {
        const isExactTitleMatch = content.title.toLowerCase() === searchTerm;
        const isTitleMatch = fuzzySearchInText(content.title, value);
        const isContentMatch = fuzzySearchInText(content.details || '', value);

        if (isExactTitleMatch) {
          exactTitleMatches.push({ ...content, type: 'content' });
        } else if (isTitleMatch || isContentMatch) {
          contentMatches.push({ ...content, type: 'content' });
        }
      });

      notes.forEach(note => {
        const isExactTitleMatch = note.title.toLowerCase() === searchTerm;
        const isTitleMatch = fuzzySearchInText(note.title, value);
        const isContentMatch = fuzzySearchInText(note.content || '', value);

        if (isExactTitleMatch) {
          exactTitleMatches.push({ ...note, type: 'note', details: note.content });
        } else if (isTitleMatch || isContentMatch) {
          contentMatches.push({ ...note, type: 'note', details: note.content });
        }
      });

      plans.forEach(plan => {
        const isExactTitleMatch = plan.title.toLowerCase() === searchTerm;
        const isTitleMatch = fuzzySearchInText(plan.title, value);
        const isDetailsMatch = fuzzySearchInText(plan.details || '', value);

        if (isExactTitleMatch) {
          exactTitleMatches.push({ ...plan, type: 'plan' });
        } else if (isTitleMatch || isDetailsMatch) {
          contentMatches.push({ ...plan, type: 'plan' });
        }
      });

      const allResults = [...exactTitleMatches, ...contentMatches].slice(0, 5);
      setSearchResults(allResults);
    }, 300);
  };

  const handleSearchResultClick = async (result: any) => {
    if (result.type === 'content') {
      setSelectedContent(result);
      router.push('/dashboard/contents');
    } else if (result.type === 'note') {
      router.push(`/dashboard/notes?openNote=${result.id}`);
    } else if (result.type === 'plan') {
      setSelectedPlan(result);
      setIsModalOpen(true);
      router.push(`/dashboard?openPlan=${result.id}`);
    }
    setSearchValue('');
    if (isMobile) setIsCollapsed(true);
  };

  const openPricingModal = () => {
    setIsPricingOpen(true);
  };

  if (!hydrated) return null;

  // loading durumunda Sidebar'ı render etme
  if (loading) {
    return null;
  }

  return (
    <>
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      <aside
        className={`
          ${isMobile ? 'fixed left-0' : 'sticky'} top-0 
          transition-all duration-300 ease-in-out
          m-3
          ${isCollapsed ? 'w-16' : 'w-64'}
          bg-stone-50 dark:bg-slate-800/50
          rounded-2xl border border-gray-200 dark:border-gray-700
          z-40
        `}
      >
        <div className="flex flex-col h-full relative p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-[#0D1117] border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-50"
          >
            <ChevronLeft className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>

          <div>
            <div className="flex-shrink-0 h-12 flex items-center px-2">
              <Logo collapsed={isCollapsed} className="h-6 w-auto" />
            </div>

            <div className="space-y-2 mt-2">
              <button
                onClick={handlePlanCreate}
                className="w-full h-10 flex items-center gap-2 px-3 bg-zinc-900 hover:bg-black/70 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-xl transition-all duration-200 font-medium text-sm"
              >
                <CalendarCheck className="w-4 h-4 flex-shrink-0" />
                <span className={isCollapsed ? 'hidden' : 'block'}>{t('common.sidebar.createPlan')}</span>
              </button>

              <div className={`grid ${isCollapsed ? 'grid-rows-2 gap-2' : 'grid-cols-2 gap-2'}`}>
                <button
                  onClick={onNewContent}
                  className="flex items-center gap-2 px-3 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl transition-colors text-xs"
                >
                  <PlusCircle className="w-4 h-4 flex-shrink-0" />
                  <span className={isCollapsed ? 'hidden' : 'block'}>{t('common.sidebar.newContent')}</span>
                </button>

                <button
                  onClick={onNewNote}
                  className="flex items-center gap-2 px-3 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl transition-colors text-xs"
                >
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span className={isCollapsed ? 'hidden' : 'block'}>{t('common.sidebar.newNote')}</span>
                </button>
              </div>
            </div>

            <div className="mt-3">
              <div className="relative">
                <button
                  onClick={() => {
                    if (isCollapsed) {
                      setIsCollapsed(false);
                      setTimeout(() => {
                        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                        if (input) input.focus();
                      }, 300);
                    }
                  }}
                  className={`absolute w-4 h-9 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-200 ${isCollapsed ? 'left-1/2 -translate-x-1/2' : 'pointer-events-none left-3'} top-1/2 -translate-y-1/2`}
                >
                  <Search className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  placeholder={isCollapsed ? "" : t('common.sidebar.search.placeholder')}
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    if (isCollapsed) setIsCollapsed(false);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsSearchFocused(false);
                      setSearchValue('');
                      setSearchResults([]);
                    }, 200);
                  }}
                  className={`h-9 rounded-lg text-xs bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 text-gray-600 dark:text-gray-300 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200 ${isCollapsed ? 'w-9 cursor-pointer' : 'w-full pl-9 pr-3'}`}
                />
              </div>

              {searchValue && searchResults.length > 0 && (
                <div className="absolute left-4 right-4 mt-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSearchResultClick(result)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      <div className="flex items-start">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1 flex justify-between items-center gap-2">
                            <span className="truncate">{result.title}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              result.type === 'content'
                                ? 'bg-blue-500/20 text-blue-500'
                                : result.type === 'note'
                                  ? 'bg-green-500/20 text-green-500'
                                  : 'bg-violet-500/20 text-violet-500'
                            }`}>
                              {t(`common.sidebar.search.resultTypes.${result.type}`)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                            {result.details || result.content}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 mb-3 border-t border-gray-200/50 dark:border-gray-700/50" />

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => isMobile && setIsCollapsed(true)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      isActive ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : ''
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className={`${isCollapsed ? 'hidden' : 'block'} transition-[width] duration-200`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Profile Section */}
          {user && (
            <div className="mt-auto">
              {/* Trial Badge */}
              {isTrialing && (
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                </div>
              )}
              {!isPro && !isCollapsed && (
  <div className="mb-3">
    <SubscriptionBadge />
    <Button
      variant="default"
      className="w-full mt-2"
      onClick={() => setIsPricingOpen(true)}
    >
      {sidebarT('trial.upgrade')}
    </Button>
  </div>
)}
              <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between px-2">
                  <Link
                    href="/dashboard/settings/profile"
                    className={`flex items-center min-w-0 gap-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group ${isCollapsed ? 'w-8 justify-center' : ''}`}
                  >
                    <div className="relative w-8 h-8 flex-shrink-0">
                      {user?.user_metadata?.avatar_url ? (
                        <>
                          <Image
                            src={user.user_metadata.avatar_url}
                            alt={user.user_metadata.name || 'Profile'}
                            width={32}
                            height={32}
                            className="w-full h-full rounded-full object-cover"
                          />
                          {isVerifiedUser && (
                            <div className="absolute -bottom-0.5 -right-0.5">
                              <div className="rounded-full bg-white dark:bg-slate-900 p-[2px]">
                                <BadgeCheck className="w-3.5 h-3.5 text-blue-500 dark:text-white" />
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                          {user?.email?.substring(0, 2).toUpperCase()}
                          {isVerifiedUser && (
                            <div className="absolute -bottom-0.5 -right-0.5">
                              <div className="rounded-full bg-white dark:bg-slate-900 p-[2px]">
                                <BadgeCheck className="w-3.5 h-3.5 text-blue-500 dark:text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {!isCollapsed && (
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-gray-900 dark:group-hover:text-white">
                          {profile && (profile.first_name || profile.last_name)
                            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                            : (user?.user_metadata?.name || user?.email?.split('@')[0])
                          }
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate group-hover:text-gray-700 dark:group-hover:text-gray-300">
                          {user?.email}
                        </div>
                      </div>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
                    title={t('common.sidebar.logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      <div className={`${isMobile ? 'w-16' : ''} flex-shrink-0`} />
    </>
  );
};

export default Sidebar;
