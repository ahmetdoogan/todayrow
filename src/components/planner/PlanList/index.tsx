"use client";

import React, { useState, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlanner } from '@/context/PlannerContext';
import type { Plan, QuickPlan } from '@/types/planner';
import { ItemTypes } from '@/utils/constants';
import { useAuth } from '@/context/AuthContext';
import { Check, Edit2, Trash2, Plus, CalendarCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DraggablePlanCardProps {
  plan: Plan;
  isDuplicateMode: boolean;
  isSelectionMode: boolean;
  togglePlanSelection: (id: number) => void;
  handlePlanClick: (plan: Plan) => void;
  canEdit: boolean;
  selectedPlanIds: number[];
  t: any;
  handleIncompleteClick: (e: React.MouseEvent, plan: Plan) => Promise<void>;
  handleCompleteClick: (e: React.MouseEvent, plan: Plan) => Promise<void>;
  handleEditClick: (e: React.MouseEvent, plan: Plan) => void;
  handleDeleteClick: (e: React.MouseEvent, plan: Plan) => Promise<void>;
}

const DraggablePlanCard: React.FC<DraggablePlanCardProps> = ({
  plan,
  isDuplicateMode,
  isSelectionMode,
  togglePlanSelection,
  handlePlanClick,
  canEdit,
  selectedPlanIds,
  t,
  handleIncompleteClick,
  handleCompleteClick,
  handleEditClick,
  handleDeleteClick,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.PLAN,
      item: () => ({
        ...plan,
        isDuplicating: isDuplicateMode,
      }),
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [plan, isDuplicateMode]
  );

  return (
    <motion.div
      key={plan.id}
      ref={drag}
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`
        relative mb-2 p-2 md:p-3 rounded-xl border
        ${plan.is_completed
          ? 'bg-gray-50/50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }
        transition-all cursor-pointer group/card
        ${isDragging ? 'cursor-grabbing' : ''}
        ${!canEdit ? 'opacity-75' : ''}
      `}
      onClick={() =>
        isSelectionMode ? togglePlanSelection(plan.id) : handlePlanClick(plan)
      }
    >
      <div
        className={`
          absolute left-0 top-0 bottom-0 w-1 rounded-l-xl
          ${plan.color ? plan.color : 'bg-violet-500'}
        `}
      />
      {isSelectionMode && (
        <div className="top-2 left-2 w-4 h-4 border-2 rounded transition-colors cursor-pointer border-stone-400 dark:border-stone-600 hover:border-stone-600 dark:hover:border-stone-400">
          {selectedPlanIds.includes(plan.id) && (
            <div className="w-full h-full bg-stone-800 dark:bg-stone-600" />
          )}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-medium text-sm truncate flex-1 ${
              plan.is_completed
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {plan.title}
            </h3>
            {plan.is_completed && (
              <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/20 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20 dark:ring-green-500/30">
                {t('content.status.completed')}
              </span>
            )}
          </div>
          {plan.details && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {plan.details}
            </p>
          )}
          <div className="mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
            {new Date(plan.start_time).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {' - '}
            {new Date(plan.end_time).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
        {canEdit && (
          <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                plan.is_completed
                  ? handleIncompleteClick(e, plan)
                  : handleCompleteClick(e, plan);
              }}
              className={`
                p-1.5 rounded-lg transition-colors
                ${plan.is_completed
                  ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                  : 'text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                }
              `}
              title={
                plan.is_completed
                  ? t('planner.actions.markAsIncomplete')
                  : t('planner.actions.markAsComplete')
              }
            >
              <Check className="w-4 h-4" />
            </button>
            {!plan.is_completed && (
              <button
                onClick={(e) => handleEditClick(e, plan)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                title={t('planner.actions.edit')}
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => handleDeleteClick(e, plan)}
              className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title={t('planner.actions.delete')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PlanList = () => {
  const {
    plans,
    deletePlan,
    completePlan,
    markPlanAsIncomplete,
    selectedDate,
    handleQuickPlanDrop,
    setSelectedPlan,
    setIsModalOpen,
    setIsEditingPlan,
    isSelectionMode,
    selectedPlanIds,
    togglePlanSelection
  } = usePlanner();

  const { user } = useAuth();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isDuplicateMode, setIsDuplicateMode] = useState(false);
  const t = useTranslations('common');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) { // Meta = Command (Mac), Control (Windows)
        setIsDuplicateMode(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) {
        setIsDuplicateMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const compareDate = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Bugün, yarın, dün kontrolü
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = compareDate(selectedDate, today);
  const isTomorrow = compareDate(selectedDate, tomorrow);
  const isYesterday = compareDate(selectedDate, yesterday);
  const canEdit = isToday || isTomorrow;

  // Planların saat aralıklarını bul
  const allHours = plans
    .map(plan => {
      const startH = new Date(plan.start_time).getHours();
      const endH = new Date(plan.end_time).getHours();
      return [startH, endH];
    })
    .flat();

  const earliestHourInPlans = allHours.length > 0 ? Math.min(...allHours) : 6;
  const latestHourInPlans = allHours.length > 0 ? Math.max(...allHours) : 23;

  const startHour = Math.min(earliestHourInPlans, 6);
  const endHour = Math.min(Math.max(latestHourInPlans + 1, 24), 24);

  const HOUR_BLOCKS: number[] = [];
  for (let h = startHour; h < endHour; h++) {
    HOUR_BLOCKS.push(h);
  }

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: [ItemTypes.QUICK_PLAN, ItemTypes.PLAN],
    canDrop: () => canEdit,
    hover: (item: QuickPlan | Plan, monitor) => {
      if (!canEdit) return;
      const clientOffset = monitor.getClientOffset();
      if (clientOffset) {
        const dropTarget = document.getElementById('plan-list-container');
        if (dropTarget) {
          const rect = dropTarget.getBoundingClientRect();
          const relativeY = clientOffset.y - rect.top;
          const totalHeight = rect.height;

          let minutes = Math.floor((relativeY / totalHeight) * 24 * 60);
          let hours = Math.floor(minutes / 60);
          minutes = minutes % 60;
          minutes = Math.round(minutes / 30) * 30;
          if (minutes === 60) {
            hours += 1;
            minutes = 0;
          }
          if (hours === 24) {
            hours = 0;
          }
          const timeString = `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}`;
          setSelectedTime(timeString);
        }
      }
    },
    drop: (item: any) => {
  if (!selectedTime || !canEdit) return;

  if (item.isDuplicating) {
    // Duplicate plan
    const planStartTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    planStartTime.setHours(hours, minutes, 0, 0);

    const planEndTime = new Date(planStartTime);
    planEndTime.setHours(planEndTime.getHours() + 1);

    const newPlan: Plan = {
      id: 0,
      title: item.title,
      details: item.details,
      start_time: planStartTime.toISOString(),
      end_time: planEndTime.toISOString(),
      is_completed: false,
      color: item.color,
      plan_type: 'regular' as Plan['plan_type'], // Burada PlanType yerine Plan['plan_type'] kullandık.
      order: 0,
      user_id: user?.id || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setSelectedPlan(newPlan);
    setIsModalOpen(true);
  } else {
    handleQuickPlanDrop(item, selectedTime);
  }
  setSelectedTime(null);
},
    collect: (monitor) => ({
      isOver: monitor.isOver() && canEdit,
    }),
  }), [selectedTime, selectedDate, canEdit, handleQuickPlanDrop]);

  // Plan oluşturma
  const handleCreatePlanAtHour = (hour: number) => {
    if (!canEdit) return;

    const planStartTime = new Date(selectedDate);
    planStartTime.setHours(hour, 0, 0, 0);

    const planEndTime = new Date(planStartTime);
    planEndTime.setHours(planEndTime.getHours() + 1);

    setSelectedPlan({
      id: 0,
      title: '',
      details: '',
      start_time: planStartTime.toISOString(),
      end_time: planEndTime.toISOString(),
      is_completed: false,
      color: 'bg-blue-500',
      plan_type: 'regular',
      order: 0,
      user_id: user?.id || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    setIsEditingPlan(false);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (e: React.MouseEvent, plan: Plan) => {
    if (!canEdit) return;
    e.stopPropagation();
    try {
      await deletePlan(plan.id);
    } catch (error) {
      console.error('Plan silinirken hata:', error);
    }
  };

  const handleEditClick = (e: React.MouseEvent, plan: Plan) => {
    if (!canEdit) return;
    e.stopPropagation();
    setSelectedPlan(plan);
    setIsEditingPlan(true);
    setIsModalOpen(true);
  };

  const handlePlanClick = (plan: Plan) => {
    if (!canEdit) return;
    setSelectedPlan(plan);
    setIsEditingPlan(true);
    setIsModalOpen(true);
  };

  const handleCompleteClick = async (e: React.MouseEvent, plan: Plan) => {
    if (!canEdit) return;
    e.stopPropagation();
    try {
      await completePlan(plan.id);
    } catch (error) {
      console.error('Plan tamamlanırken hata:', error);
    }
  };

  const handleIncompleteClick = async (e: React.MouseEvent, plan: Plan) => {
    if (!canEdit) return;
    e.stopPropagation();
    try {
      await markPlanAsIncomplete(plan.id);
    } catch (error) {
      console.error('Plan durumu değiştirilirken hata:', error);
    }
  };

  // Saat grupları
  const plansByHour = HOUR_BLOCKS.reduce((acc, hour) => {
    const hourPlans = plans.filter((plan) => {
      const startHour = new Date(plan.start_time).getHours();
      return startHour === hour;
    });
    acc[hour] = hourPlans;
    return acc;
  }, {} as Record<number, Plan[]>);

  // Her saat bloğunu çizdir
  const renderHourBlock = (hour: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    const hourPlans = plansByHour[hour] || [];
    const isEmptySlot = hourPlans.length === 0;

    return (
      <div key={hour} className="group relative">
        <div className="absolute -left-14 md:-left-16 top-0 w-12 md:w-14 text-xs md:text-sm text-gray-400 dark:text-gray-500 font-medium">
          {timeString}
        </div>

        <div className="relative pl-4 border-l border-gray-200 dark:border-gray-700 min-h-[64px]">
          {hourPlans.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {hourPlans.map((plan) => (
                <DraggablePlanCard
                  key={plan.id}
                  plan={plan}
                  isDuplicateMode={isDuplicateMode}
                  isSelectionMode={isSelectionMode}
                  togglePlanSelection={togglePlanSelection}
                  handlePlanClick={handlePlanClick}
                  canEdit={canEdit}
                  selectedPlanIds={selectedPlanIds}
                  t={t}
                  handleIncompleteClick={handleIncompleteClick}
                  handleCompleteClick={handleCompleteClick}
                  handleEditClick={handleEditClick}
                  handleDeleteClick={handleDeleteClick}
                />
              ))}
            </AnimatePresence>
          ) : (
            <motion.div
              initial={false}
              animate={{
                backgroundColor:
                  isOver && selectedTime?.startsWith(timeString.split(':')[0])
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
              }}
              className="min-h-[64px] rounded-lg border border-dashed border-transparent transition-colors duration-200 group-hover:border-gray-200 dark:group-hover:border-gray-700 relative"
            >
              {canEdit && isEmptySlot && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <button
                    className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500 px-3 py-1 rounded-md bg-gray-100/70 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 pointer-events-auto hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleCreatePlanAtHour(hour)}
                  >
                    <Plus className="w-4 h-4" />
                    {t('planner.actions.createPlan')}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  if (plans.length === 0) {
  return (
    <div
      id="plan-list-container"
      ref={canEdit ? dropRef : null}
      className="relative flex flex-col items-center justify-center h-[calc(100vh-200px)] min-h-[400px]"
    >
      <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className={`
    absolute inset-0 flex items-center justify-center
    ${isOver
      ? 'bg-blue-50/50 dark:bg-blue-900/20 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-2xl'
      : ''
    }
    pointer-events-none // 👈 Bu satırı ekleyin
  `}
>
  {selectedTime && (
    <div className="bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg shadow-lg text-center pointer-events-auto"> 
      {/* 👆 İçerikte pointer-events-auto ekleyin */}
      <p className="text-black dark:text-white font-medium">
        {t('planner.dragAndDrop.dropHere')}
      </p>
      <p className="mt-1 text-black dark:text-white text-sm">
        {t('planner.dragAndDrop.timeLabel', { time: selectedTime })}
      </p>
    </div>
  )}
</motion.div>

      {isYesterday ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('planner.emptyStates.yesterdayEmpty')}
        </p>
      ) : (
        (isToday || isTomorrow) && (
          <div className="text-center">
  <p className="text-gray-500 dark:text-gray-400">
    {isToday
      ? t('planner.emptyStates.todayEmpty')
      : t('planner.emptyStates.tomorrowEmpty')}
  </p>
  <button
              onClick={() => {
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
              }}
              className="mt-4 mx-auto flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-black/70 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-xl transition-all duration-200 font-medium text-sm"
  >
    <CalendarCheck className="w-4 h-4" />
    <span>{t('sidebar.createPlan')}</span>
  </button>
</div>
        )
      )}
    </div>
  );
}

  return (
    <div
      id="plan-list-container"
      ref={canEdit ? dropRef : null}
      className="relative pl-16 pr-4 md:pr-6 lg:pr-8 py-4 space-y-2 min-h-screen"
    >
      {HOUR_BLOCKS.map((hour) => renderHourBlock(hour))}

      <AnimatePresence>
        {isOver && selectedTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center bg-black/5 backdrop-blur-[1px]"
          >
            <div className="bg-white/90 dark:bg-gray-800/90 px-6 py-3 rounded-xl shadow-lg text-center">
              <p className="text-black dark:text-white font-medium">
                {t('planner.dragAndDrop.dropHere')}
              </p>
              <p className="mt-1 text-black dark:text-white text-sm">
                {t('planner.dragAndDrop.timeLabel', { time: selectedTime })}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanList;
