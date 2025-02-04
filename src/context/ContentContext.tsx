"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from "react-toastify";
import { contentService } from '@/services/contentService';
import { Content, ContentUpdateData } from '@/types/content';
import { useAuth } from './AuthContext';
import { useTranslations } from 'next-intl';
import { supabase } from '@/utils/supabaseClient';

interface ContentContextType {
  contents: Content[];
  selectedContent: Content | null;
  selectedDate: Date | null;
  selectedMonth: string;
  hideCompleted: boolean;
  searchQuery: string;
  months: string[];
  selectedItems: number[];
  isSelectionMode: boolean;
  filteredContents: Content[];
  modalStack: Content[];
  monthlyTarget: number;
  setContents: React.Dispatch<React.SetStateAction<Content[]>>;
  setSelectedContent: React.Dispatch<React.SetStateAction<Content | null>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
  setHideCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: (id: number) => Promise<void>;
  handleMarkAsCompleted: (id: number) => Promise<void>;
  handleMarkAsIncomplete: (id: number) => Promise<void>;
  handleUpdate: (id: number, updatedData: ContentUpdateData) => Promise<Content | null>;
  handleAddContent: (newContent: Content) => void;
  formatDate: (dateString: string) => string;
  findContentByTitle: (title: string) => Content | undefined;
  pushToModalStack: (content: Content) => void;
  popFromModalStack: () => void;
  clearModalStack: () => void;
  getActivePlatform: () => { platform: string; count: number };
  getMonthlyProgress: () => { target: number; completed: number };
  getUpcomingDeadlines: () => number;
  getWeeklyPlans: () => { thisWeek: number; nextWeek: number; emptyDays: string[] };
  getContentStats: () => {
    mostProductiveDay: string;
    preferredFormat: string;
    monthlyAverage: number;
    completionRate: number;
  };
  updateMonthlyTarget: (target: number) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations('common');
  const locale = t('locales.dateFormat');
  const { user } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [months, setMonths] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [modalStack, setModalStack] = useState<Content[]>([]);
  const [monthlyTarget, setMonthlyTarget] = useState(10);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('monthly_target')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        if (data) {
          setMonthlyTarget(data.monthly_target);
        }
      } catch (error) {
        console.error('Error fetching monthly target:', error);
      }
    };

    fetchProfile();
  }, [user]);

  const findContentByTitle = (title: string) => {
    return contents.find(content => 
      content.title.toLowerCase() === title.toLowerCase()
    );
  };

  const pushToModalStack = (content: Content) => {
    setModalStack(prevStack => [...prevStack, content]);
    setSelectedContent(content);
  };

  const popFromModalStack = () => {
    setModalStack(prevStack => {
      const newStack = prevStack.slice(0, -1);
      setSelectedContent(newStack[newStack.length - 1] || null);
      return newStack;
    });
  };

  const clearModalStack = () => {
    setModalStack([]);
    setSelectedContent(null);
  };

  useEffect(() => {
    const fetchContents = async () => {
      if (!user) {
        setContents([]);
        return;
      }

      try {
        const data = await contentService.getAllContents(user.id);
        if (!data) {
          setContents([]);
          return;
        }
        
        setContents(data.map(content => ({
          ...content,
          platforms: content.platforms || ['LINKEDIN'],
          references_to: [],
          referenced_by: []
        })));
      } catch (error: any) {
        console.error("İçerikler alınırken bir hata oluştu:", error);
        toast.error(t('content.notifications.fetchError'));
        setContents([]);
      }
    };

    fetchContents();
  }, [user, t]);

  useEffect(() => {
    const uniqueMonths = Array.from(
      new Set(
        contents
          .filter(content => content.date)
          .map((content) => {
            const date = new Date(content.date);
            return isNaN(date.getTime()) ? null :
              `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          })
          .filter((month): month is string => month !== null)
      )
    );
    setMonths(uniqueMonths);
  }, [contents]);

  const handleDelete = async (id: number) => {
    if (!user) return;

    try {
      await contentService.deleteContent(id, user.id);
      setContents((prev) => prev.filter((content) => content.id !== id));
      setSelectedContent(null);
      clearModalStack();
      toast.success(t('content.notifications.deleteSuccess'));
    } catch (error) {
      console.error("Silme işlemi sırasında bir hata oluştu:", error);
      toast.error(t('content.notifications.deleteError'));
    }
  };

  const updateMonthlyTarget = async (target: number) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ monthly_target: target })
        .eq('id', user.id);

      if (error) throw error;
      setMonthlyTarget(target);
      toast.success(t('profile.notifications.targetUpdateSuccess'));
    } catch (error) {
      console.error('Error updating monthly target:', error);
      toast.error(t('profile.notifications.targetUpdateError'));
    }
  };

  const handleMarkAsCompleted = async (id: number) => {
    if (!user) return;

    try {
      await contentService.updateCompletionStatus(id, true, user.id);
      setContents((prev) =>
        prev.map((content) =>
          content.id === id ? { ...content, is_completed: true } : content
        )
      );
      setSelectedContent(null);
      clearModalStack();
      toast.success(t('content.notifications.completeSuccess'));
    } catch (error) {
      console.error("Tamamlanma güncellenemedi:", error);
      toast.error(t('content.notifications.completeError'));
    }
  };

  const handleMarkAsIncomplete = async (id: number) => {
    if (!user) return;

    try {
      await contentService.updateCompletionStatus(id, false, user.id);
      setContents((prev) =>
        prev.map((content) =>
          content.id === id ? { ...content, is_completed: false } : content
        )
      );
      setSelectedContent(null);
      clearModalStack();
      toast.success(t('content.notifications.undoSuccess'));
    } catch (error) {
      console.error("Geri alma işlemi sırasında bir hata oluştu:", error);
      toast.error(t('content.notifications.undoError'));
    }
  };

  const handleUpdate = async (id: number, updatedData: ContentUpdateData) => {
    if (!user) return null;

    try {
      await contentService.updateContent(id, updatedData, user.id);
      const updatedContent = { ...selectedContent, ...updatedData, id } as Content;
      
      setContents((prev) =>
        prev.map((content) =>
          content.id === id ? updatedContent : content
        )
      );
      
      toast.success(t('content.notifications.updateSuccess'));
      return updatedContent;
    } catch (error) {
      toast.error(t('content.notifications.updateError'));
      return null;
    }
  };

  const handleAddContent = (newContent: Content) => {
    setContents((prev) => [newContent, ...prev]);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return t('content.date.noDate');
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, options);
  };

  const filteredContents = useMemo(() => {
    return contents
      .filter((content) => {
        if (hideCompleted && content.is_completed) return false;
        
        if (selectedMonth && content.date) {
          const date = new Date(content.date);
          const contentMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          if (contentMonth !== selectedMonth) return false;
        }
        
        if (selectedDate && content.date) {
          const contentDate = new Date(content.date).toDateString();
          const selectedDateStr = selectedDate.toDateString();
          if (selectedDateStr !== contentDate) return false;
        }
        
        if (searchQuery) {
          const lowerCaseQuery = searchQuery.toLowerCase();
          return (
            content.title.toLowerCase().includes(lowerCaseQuery) ||
            content.details.toLowerCase().includes(lowerCaseQuery)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [contents, hideCompleted, selectedMonth, selectedDate, searchQuery]);

  const getActivePlatform = () => {
    const platformCounts = contents.reduce((acc, content) => {
      content.platforms.forEach(platform => {
        acc[platform] = (acc[platform] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const mostActive = Object.entries(platformCounts)
      .sort(([, a], [, b]) => b - a)[0] || ['', 0];

    return { platform: mostActive[0], count: mostActive[1] };
  };

  const getMonthlyProgress = () => {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const thisMonthContents = contents.filter(content => {
      const contentDate = new Date(content.date);
      return `${contentDate.getFullYear()}-${String(contentDate.getMonth() + 1).padStart(2, '0')}` === currentMonth;
    });

    return {
      target: monthlyTarget,
      completed: thisMonthContents.filter(content => content.is_completed).length
    };
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return contents.filter(content => {
      const contentDate = new Date(content.date);
      return !content.is_completed && contentDate >= today && contentDate <= nextWeek;
    }).length;
  };

  const getWeeklyPlans = () => {
    const today = new Date();
    const nextWeekStart = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextWeekEnd = new Date(nextWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    const thisWeekCount = contents.filter(content => {
      const contentDate = new Date(content.date);
      return contentDate >= today && contentDate < nextWeekStart;
    }).length;

    const nextWeekCount = contents.filter(content => {
      const contentDate = new Date(content.date);
      return contentDate >= nextWeekStart && contentDate < nextWeekEnd;
    }).length;

    const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'];
    const contentDays = contents
      .filter(content => {
        const contentDate = new Date(content.date);
        return contentDate >= today && contentDate < nextWeekStart;
      })
      .map(content => new Date(content.date).getDay());

    const emptyDays = weekDays.filter((_, index) => !contentDays.includes(index + 1));

    return { thisWeek: thisWeekCount, nextWeek: nextWeekCount, emptyDays };
  };

  const getContentStats = () => {
    const dayCount = contents.reduce((acc, content) => {
      const day = new Date(content.date).getDay();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const mostProductiveDay = Object.entries(dayCount)
      .sort(([, a], [, b]) => b - a)[0] || [0, 0];

    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    
    const formatCount = contents.reduce((acc, content) => {
      acc[content.format] = (acc[content.format] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const preferredFormat = Object.entries(formatCount)
      .sort(([, a], [, b]) => b - a)[0] || ['', 0];

    const months = contents.reduce((acc, content) => {
      const month = content.date.substring(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyAverage = Object.values(months).reduce((a, b) => a + b, 0) / Object.keys(months).length;

    const completionRate = (contents.filter(c => c.is_completed).length / contents.length) * 100;

    return {
      mostProductiveDay: days[Number(mostProductiveDay[0])],
      preferredFormat: preferredFormat[0],
      monthlyAverage: Math.round(monthlyAverage * 10) / 10,
      completionRate: Math.round(completionRate)
    };
  };

  const value = {
    contents,
    selectedContent,
    selectedDate,
    selectedMonth,
    hideCompleted,
    searchQuery,
    months,
    selectedItems,
    isSelectionMode,
    filteredContents,
    modalStack,
    monthlyTarget,
    setContents,
    setSelectedContent,
    setSelectedDate,
    setSelectedMonth,
    setHideCompleted,
    setSearchQuery,
    setSelectedItems,
    setIsSelectionMode,
    handleDelete,
    handleMarkAsCompleted,
    handleMarkAsIncomplete,
    handleUpdate,
    handleAddContent,
    formatDate,
    findContentByTitle,
    pushToModalStack,
    popFromModalStack,
    clearModalStack,
    getActivePlatform,
    getMonthlyProgress,
    getUpcomingDeadlines,
    getWeeklyPlans,
    getContentStats,
    updateMonthlyTarget
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}