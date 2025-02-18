"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from "react-toastify";
import { plannerService } from '@/services/plannerService';
import { useAuth } from './AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useTranslations } from 'next-intl';
import type { Plan, QuickPlan, NewPlanData, PlanUpdateData, NewQuickPlanData, User } from '@/types/planner';

interface PlannerContextType {
  isPricingModalOpen: boolean;
  setIsPricingModalOpen: (isOpen: boolean) => void;
  user: User;
  plans: Plan[];
  quickPlans: QuickPlan[];
  selectedDate: Date;
  selectedPlan: Plan | null;
  isModalOpen: boolean;
  isQuickPlanModalOpen: boolean;
  draggedPlan: { quickPlan: QuickPlan; dropTime: string } | null;
  isEditingPlan: boolean;
  isSelectionMode: boolean;
  selectedPlanIds: number[];
  hiddenSystemPlans: number[];
  toggleSystemPlanVisibility: (planId: number) => void;

  // CRUD
  createPlan: (data: NewPlanData) => Promise<void>;
  updatePlan: (id: number, data: PlanUpdateData) => Promise<void>;
  deletePlan: (id: number) => Promise<void>;
  completePlan: (id: number) => Promise<void>;
  markPlanAsIncomplete: (id: number) => Promise<void>;
  
  // QuickPlans
  createQuickPlan: (data: NewQuickPlanData) => Promise<void>;
  deleteQuickPlan: (id: number) => Promise<void>;
  handleQuickPlanDrop: (quickPlan: QuickPlan, dropTime: string) => Promise<void>;

  // UI
  setSelectedDate: (date: Date) => void;
  setSelectedPlan: (plan: Plan | null) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setIsQuickPlanModalOpen: (isOpen: boolean) => void;
  setDraggedPlan: (data: { quickPlan: QuickPlan; dropTime: string } | null) => void;
  setIsEditingPlan: (isEditing: boolean) => void;
  setIsSelectionMode: (mode: boolean) => void;
  setSelectedPlanIds: (ids: number[]) => void;
  togglePlanSelection: (id: number) => void;
  bulkDeletePlans: (ids: number[]) => Promise<void>;
  bulkCompletePlans: (ids: number[]) => Promise<void>;
  fetchPlans: () => Promise<void>;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

const compareDate = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { isExpired } = useSubscription();
  const t = useTranslations('common.planner.notifications');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [quickPlans, setQuickPlans] = useState<QuickPlan[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickPlanModalOpen, setIsQuickPlanModalOpen] = useState(false);
  const [draggedPlan, setDraggedPlan] = useState<{ quickPlan: QuickPlan; dropTime: string } | null>(null);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedPlanIds, setSelectedPlanIds] = useState<number[]>([]);
  const [hiddenSystemPlans, setHiddenSystemPlans] = useState<number[]>([]);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  useEffect(() => {
    const loadHiddenPlans = async () => {
      if (user) {
        try {
          const hiddenPlanIds = await plannerService.getHiddenQuickPlans(user.id);
          setHiddenSystemPlans(hiddenPlanIds);
        } catch (error) {
          console.error('Error loading hidden plans:', error);
        }
      }
    };

    loadHiddenPlans();
  }, [user]);

  const toggleSystemPlanVisibility = async (planId: number) => {
    if (!user) return;

    try {
      if (hiddenSystemPlans.includes(planId)) {
        await plannerService.showQuickPlan(planId, user.id);
        setHiddenSystemPlans(prev => prev.filter(id => id !== planId));
      } else {
        await plannerService.hideQuickPlan(planId, user.id);
        setHiddenSystemPlans(prev => [...prev, planId]);
      }
    } catch (error) {
      console.error('Error toggling plan visibility:', error);
    }
  };

  const togglePlanSelection = (id: number) => {
    setSelectedPlanIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const bulkDeletePlans = async (ids: number[]) => {
    if (!user) return;
    try {
      for (const planId of ids) {
        await plannerService.deletePlan(planId, user.id);
      }
      toast.success(t('bulkDeleteSuccess'));
      await fetchPlans();
      setSelectedPlanIds([]);
      setIsSelectionMode(false);
    } catch (error) {
      console.error('Toplu silme hatası:', error);
      toast.error(t('bulkDeleteError'));
    }
  };

  const bulkCompletePlans = async (ids: number[]) => {
    if (!user) return;
    try {
      for (const planId of ids) {
        const plan = plans.find(p => p.id === planId);
        if (plan) {
          await plannerService.updatePlan(planId, { ...plan, is_completed: true }, user.id);
        }
      }
      toast.success(t('bulkCompleteSuccess'));
      await fetchPlans();
      setSelectedPlanIds([]);
      setIsSelectionMode(false);
    } catch (error) {
      console.error('Toplu tamamlama hatası:', error);
      toast.error(t('bulkCompleteError'));
    }
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = compareDate(selectedDate, today);
  const isTomorrow = compareDate(selectedDate, tomorrow);
  const canEdit = isToday || isTomorrow;

  const fetchPlans = useCallback(async () => {
    if (!user) return;
    try {
      const fetchedPlans = await plannerService.getPlansByDate(selectedDate, user.id);
      setPlans(fetchedPlans || []);
    } catch (error) {
      console.error('Planlar alınırken hata:', error);
      toast.error(t('loadError'));
    }
  }, [user, selectedDate, t]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans, selectedDate]);

  useEffect(() => {
    if (!isSelectionMode) {
      setSelectedPlanIds([]);
    }
  }, [isSelectionMode]);

  const createPlan = async (data: NewPlanData) => {
    if (!user || !canEdit) return;
    if (isExpired) {
      setIsPricingModalOpen(true);
      return;
    }
    try {
      await plannerService.createPlan(data, user.id);
      toast.success(t('createSuccess'));
      await fetchPlans();
    } catch (error) {
      console.error('Plan oluşturulurken hata:', error);
      toast.error(t('createError'));
    }
  };

  const updatePlan = async (id: number, data: PlanUpdateData) => {
    if (!user || !canEdit) return;
    try {
      await plannerService.updatePlan(id, data, user.id);
      toast.success(t('updateSuccess'));
      await fetchPlans();
      setSelectedPlan(null);
      setIsModalOpen(false);
      setIsEditingPlan(false);
    } catch (error) {
      console.error('Plan güncellenirken hata:', error);
      toast.error(t('updateError'));
    }
  };

  const deletePlan = async (id: number) => {
    if (!user || !canEdit) return;
    try {
      await plannerService.deletePlan(id, user.id);
      toast.success(t('deleteSuccess'));
      await fetchPlans();
      setSelectedPlan(null);
      setIsModalOpen(false);
      setIsEditingPlan(false);
    } catch (error) {
      console.error('Plan silinirken hata:', error);
      toast.error(t('deleteError'));
    }
  };

  const completePlan = async (id: number) => {
    if (!user) return;
    try {
      const updatedPlan = plans.find(p => p.id === id);
      if (updatedPlan) {
        await plannerService.updatePlan(id, { ...updatedPlan, is_completed: true }, user.id);
        toast.success(t('completeSuccess'));
        await fetchPlans();
        setSelectedPlan(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Tamamlarken hata:', error);
      toast.error(t('completeError'));
    }
  };

  const markPlanAsIncomplete = async (id: number) => {
    if (!user) return;
    try {
      const updatedPlan = plans.find(p => p.id === id);
      if (updatedPlan) {
        await plannerService.updatePlan(id, { ...updatedPlan, is_completed: false }, user.id);
        toast.success(t('undoSuccess'));
        await fetchPlans();
        setSelectedPlan(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Aktif hale getirirken hata:', error);
      toast.error(t('undoError'));
    }
  };

  const createQuickPlan = async (data: NewQuickPlanData) => {
    if (!user) return;
    try {
      await plannerService.createQuickPlan(data, user.id);
      toast.success(t('createSuccess'));
      await fetchQuickPlans();
    } catch (error) {
      console.error('Hazır plan oluşturulurken hata:', error);
      toast.error(t('createError'));
      throw error;
    }
  };

  const deleteQuickPlan = async (id: number) => {
    if (!user) return;
    try {
      await plannerService.deleteQuickPlan(id, user.id);
      toast.success(t('deleteSuccess'));
      await fetchQuickPlans();
    } catch (error) {
      console.error('Hazır plan silinirken hata:', error);
      toast.error(t('deleteError'));
    }
  };

  const fetchQuickPlans = useCallback(async () => {
    if (!user) return;
    try {
      const fetchedQuickPlans = await plannerService.getAllQuickPlans(user.id);
      setQuickPlans(fetchedQuickPlans);
    } catch (error) {
      console.error('Hazır planlar alınırken hata:', error);
      toast.error(t('loadError'));
    }
  }, [user, t]);

  useEffect(() => {
    if (user) {
      fetchQuickPlans();
    }
  }, [user, fetchQuickPlans]);

  const handleQuickPlanDrop = async (quickPlan: QuickPlan, dropTime: string) => {
    if (!user || !canEdit) return;
    if (isExpired) {
      setIsPricingModalOpen(true);
      return;
    }

    try {
      const [hours, minutes] = dropTime.split(':').map(Number);
      const date = new Date(selectedDate);
      date.setHours(hours, minutes, 0, 0);

      const endTime = new Date(date);
      endTime.setHours(endTime.getHours() + 1);

      setDraggedPlan({ quickPlan, dropTime });
      setSelectedPlan({
        id: 0,
        title: quickPlan.title,
        details: '',
        start_time: date.toISOString(),
        end_time: endTime.toISOString(),
        is_completed: false,
        plan_type: 'predefined',
        color: quickPlan.color || 'defaultColor',
        order: 0,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Eklenen alanlar:
        priority: 'medium',
        notify: false,
        notify_before: 30
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Hazır plan ayarlanırken hata:', error);
    }
  };

  return (
    <PlannerContext.Provider
      value={{
        isPricingModalOpen,
        setIsPricingModalOpen,
        user: {
          ...user!,
          email: user?.email || "no-email@example.com",
          name: user?.user_metadata?.name || user?.email || "Unknown",
        },
        plans,
        quickPlans,
        selectedDate,
        selectedPlan,
        isModalOpen,
        isQuickPlanModalOpen,
        hiddenSystemPlans,
        toggleSystemPlanVisibility,
        draggedPlan,
        isEditingPlan,
        isSelectionMode,
        selectedPlanIds,
        createPlan,
        updatePlan,
        deletePlan,
        completePlan,
        markPlanAsIncomplete,
        createQuickPlan,
        deleteQuickPlan,
        handleQuickPlanDrop,
        setSelectedDate,
        setSelectedPlan,
        setIsModalOpen,
        setIsQuickPlanModalOpen,
        setDraggedPlan,
        setIsEditingPlan,
        setIsSelectionMode,
        setSelectedPlanIds,
        togglePlanSelection,
        bulkDeletePlans,
        bulkCompletePlans,
        fetchPlans,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (context === undefined) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
}
