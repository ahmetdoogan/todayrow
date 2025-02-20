"use client";

import React from 'react';
import { Clock, Check, Edit2, Trash2, ArrowLeft, Bell, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Plan } from '@/types/planner';
import { usePlanner } from '@/context/PlannerContext';  // Eklendi

interface PlanCardProps {
  plan: Plan;
  onEdit: (e: React.MouseEvent, plan: Plan) => void;
  onDelete: (e: React.MouseEvent, plan: Plan) => void;
  onClick: (plan: Plan) => void;
  onComplete: () => Promise<void>;
  onIncomplete: () => Promise<void>;
  isReadOnly?: boolean;
}

const PlanCard = ({ 
  plan,
  onEdit,
  onDelete,
  onClick,
  onComplete,
  onIncomplete,
  isReadOnly = false
}: PlanCardProps) => {
  const { setSelectedPlan, setIsModalOpen } = usePlanner();  // Eklendi

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(e, plan);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(e, plan);
  };

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onComplete();
  };

  const handleIncomplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onIncomplete();
  };

 const handleClick = () => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
    onClick(plan); // Bunu ekliyoruz
};

  // ... [Geri kalan her şey aynı kalacak]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ 
        duration: 0.2,
        ease: "easeInOut"
      }}
      onClick={handleClick}
      className={`
        relative group flex items-center
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-lg p-4
        ${!isReadOnly ? 'hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer' : ''}
        ${plan.is_completed ? 'bg-opacity-75 dark:bg-opacity-75' : ''}
        transition-all duration-200
      `}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 shrink-0">
            {new Date(plan.start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} - 
            {new Date(plan.end_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </div>

          <div className="flex items-center gap-2">
            {/* Status Badge */}
            {plan.is_completed && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full 
                           bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                Tamamlandı
              </span>
            )}
            
            {/* Priority Badge */}
{!plan.is_completed && (plan.priority === 'high' || plan.priority === 'medium') && (
  <span
    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium
      ${plan.priority === 'high'
        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 ring-red-600/20 dark:ring-red-500/30'
        : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 ring-yellow-600/20 dark:ring-yellow-500/30'
      }
    `}
  >
    <AlertTriangle className="w-3 h-3 mr-1" />
    {plan.priority === 'high' ? t('plannerForm.priorityHigh') : t('plannerForm.priorityMedium')}
  </span>
)}


            
            {/* Notification Badge */}
            {!plan.is_completed && plan.notify && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full 
                           bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400
                           flex items-center gap-1">
                <Bell className="w-3 h-3" />
                {plan.notify_before}dk
              </span>
            )}
            
            <h3 className={`
              text-sm font-medium truncate  
              ${plan.is_completed 
                ? 'text-gray-400 dark:text-gray-500' 
                : 'text-gray-900 dark:text-gray-100'
              }
            `}>
              {plan.title}
            </h3>
          </div>
        </div>
        
        {plan.details && (
          <p className={`
            mt-1 text-sm line-clamp-1
            ${plan.is_completed 
              ? 'text-gray-400 dark:text-gray-500' 
              : 'text-gray-500 dark:text-gray-400'
            }
          `}>
            {plan.details}
          </p>
        )}
      </div>

      {/* Aksiyon Butonları - Dün sayfasında gösterilmeyecek */}
      {!isReadOnly && (
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!plan.is_completed ? (
            <button
              onClick={handleComplete}
              className="flex items-center gap-1 px-3 py-1.5 
                     bg-green-500 hover:bg-green-600 
                     text-white rounded-lg text-xs
                     transition-colors"
            >
              <Check className="w-3 h-3" />
              <span className="font-medium">Tamamla</span>
            </button>
          ) : (
            <button
              onClick={handleIncomplete}
              className="flex items-center gap-1 px-3 py-1.5 
                     bg-blue-500 hover:bg-blue-600 
                     text-white rounded-lg text-xs
                     transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="font-medium">Geri Al</span>
            </button>
          )}

          <button 
            onClick={handleEdit}
            className="p-1.5 text-gray-500 hover:text-gray-700 
                   dark:text-gray-400 dark:hover:text-gray-200 
                   hover:bg-gray-100 dark:hover:bg-gray-700/50 
                   rounded transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handleDelete}
            className="p-1.5 text-red-500 hover:text-red-600 
                   dark:text-red-400 dark:hover:text-red-300 
                   hover:bg-red-50 dark:hover:bg-red-900/20 
                   rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default PlanCard;