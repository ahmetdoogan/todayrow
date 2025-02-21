"use client";

import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { GripVertical, Plus, Trash2, X, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanner } from "@/context/PlannerContext";
import { ItemTypes } from "@/utils/constants";
import type { QuickPlan } from "@/types/planner";
import { useSubscription } from '@/hooks/useSubscription';
import { useTranslations } from 'next-intl';
import PricingModal from '@/components/modals/PricingModal';
import QuickPlanModal from "./QuickPlanModal";

interface QuickPlansProps {
  onClose?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const QuickPlans: React.FC<QuickPlansProps> = ({ onClose, onDragStart, onDragEnd }) => {
  const {
    quickPlans,
    deleteQuickPlan,
    isQuickPlanModalOpen,
    setIsQuickPlanModalOpen,
    hiddenSystemPlans,
    toggleSystemPlanVisibility,
    user  // user'ı ekledik
} = usePlanner();

  const t = useTranslations('common.quickPlansSection');

  const defaultQuickPlans: QuickPlan[] = [
    { 
      id: -1, 
      title: t('defaultPlans.meeting'), 
      color: "bg-blue-500", 
      is_system: true,
      user_id: user?.id || '',  // user'ı usePlanner'dan alalım
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: -2, 
      title: t('defaultPlans.focus'), 
      color: "bg-green-500", 
      is_system: true,
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: -3, 
      title: t('defaultPlans.break'), 
      color: "bg-purple-500", 
      is_system: true,
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: -4, 
      title: t('defaultPlans.followup'), 
      color: "bg-orange-500", 
      is_system: true,
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: -5, 
      title: t('defaultPlans.review'), 
      color: "bg-pink-500", 
      is_system: true,
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
  ];

  const { isExpired } = useSubscription();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<QuickPlan | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const allQuickPlans = [
  ...defaultQuickPlans.map(plan => ({
    ...plan,
    isHidden: hiddenSystemPlans.includes(plan.id)
  })).filter(plan => !plan.isHidden || editMode),  // Eğer edit modundaysa gizli planları da göster
  ...quickPlans
];

  const handleDeleteClick = (plan: QuickPlan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (planToDelete) {
      await deleteQuickPlan(planToDelete.id);
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
    }
  };

  const QuickPlanItem = ({ plan }: { plan: QuickPlan }) => {
    const [{ isDragging }, drag] = useDrag(
      () => ({
        type: ItemTypes.QUICK_PLAN,
        item: () => {
          console.log('QuickPlan drag started - isExpired:', isExpired);
          if (isExpired) {
            setIsPricingModalOpen(true);
            return;
          }
          onDragStart?.();
          return plan;
        },
        end: (item, monitor) => {
          if (!monitor.didDrop()) {
            console.log('Drop cancelled or failed');
          }
          
          onDragEnd?.();
          
          setTimeout(() => {
            document.body.style.pointerEvents = '';
          }, 100);
        },
        canDrag: () => !editMode,
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }),
      [plan, onDragStart, onDragEnd, isExpired, editMode]
    );

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <div
  ref={!editMode ? drag : undefined}
  className={`
    flex items-center gap-2 p-2.5 rounded-lg
    bg-white dark:bg-gray-900/50
    border border-gray-100 dark:border-gray-800 
    ${!editMode ? "cursor-move hover:bg-gray-50 dark:hover:bg-gray-800/50" : ""}
    transition-all duration-200 ease-in-out
    ${isDragging ? "opacity-50 scale-95" : "opacity-100"}
    ${editMode && plan.isHidden ? "opacity-50" : ""} // Gizli planları soluk göster
    group shadow-sm hover:shadow-md
  `}
>
          {!editMode && (
            <GripVertical className="text-gray-400 flex-shrink-0" size={16} />
          )}
          <div className={`w-2 h-2 rounded-full ${plan.color}`} />
          <span className="flex-1 text-sm">{plan.title}</span>

          <AnimatePresence>
            {editMode && (plan.is_system ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => toggleSystemPlanVisibility(plan.id)}
                className={`p-1.5 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 
                         hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors
                         ${hiddenSystemPlans.includes(plan.id) ? 'opacity-50' : ''}`}
                title={hiddenSystemPlans.includes(plan.id) ? t('showPlan') : t('hidePlan')}
              >
                {hiddenSystemPlans.includes(plan.id) ? <Eye size={16} /> : <EyeOff size={16} />}
              </motion.button>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleDeleteClick(plan)}
                className="p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 
                         hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                title={t('deleteModal.title')}
              >
                <Trash2 size={16} />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative">
      <div className="sticky top-0 bg-stone-50 dark:bg-slate-800/50 z-10 p-3 border rounded-r-2xl border-b  dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">{t('title')}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`
                px-2.5 py-1 rounded-lg text-sm transition-colors duration-200
                ${
                  editMode
                    ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 font-medium"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
                }
              `}
            >
              {editMode ? t('buttons.done') : t('buttons.edit')}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 
                         dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700
                         rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t('description')}
        </p>
      </div>

      <div className="p-3 space-y-2">
        <div className="grid grid-cols-1 gap-2">
          {allQuickPlans.map((plan) => (
            <QuickPlanItem key={plan.id} plan={plan} />
          ))}
        </div>

        <button
          onClick={() => {
            if (isExpired) {
              setIsPricingModalOpen(true);
              return;
            }
            setIsQuickPlanModalOpen(true);
          }}
          className="w-full p-2.5 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 
                    text-gray-500 hover:border-gray-400 dark:hover:border-gray-600 
                    hover:bg-gray-50 dark:hover:bg-gray-800/50
                    mt-4 flex items-center justify-center gap-2
                    transition-all duration-200 text-sm"
        >
          <Plus size={16} />
          <span>{t('buttons.add')}</span>
        </button>
      </div>

      <QuickPlanModal
        isOpen={isQuickPlanModalOpen}
        onClose={() => setIsQuickPlanModalOpen(false)}
      />

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-sm mx-4 shadow-xl"
            >
              <h3 className="text-base font-medium mb-2">{t('deleteModal.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('deleteModal.message')}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setPlanToDelete(null);
                  }}
                  className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg 
                           hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 
                           dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  {t('deleteModal.cancel')}
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg 
                           hover:bg-red-700 transition-colors duration-200"
                >
                  {t('deleteModal.confirm')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        isTrialEnded={true}
      />
    </div>
  );
};

export default QuickPlans;