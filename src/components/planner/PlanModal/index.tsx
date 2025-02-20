import React, { useState } from 'react';
import { 
  Clock, 
  Calendar,
  Edit2, 
  Trash2, 
  CheckSquare,
  X,
  Tag,
  Bell,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePlanner } from '@/context/PlannerContext';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const PlanModal = () => {
  const { 
    selectedPlan,
    setSelectedPlan,
    isModalOpen,
    setIsModalOpen,
    setIsEditingPlan,
    deletePlan, 
    completePlan 
  } = usePlanner();

  const [priority, setPriority] = useState<"high" | "medium" | "low">(selectedPlan?.priority || 'low');
  const [notify, setNotify] = useState(selectedPlan?.notify || false);
  const [notifyBefore, setNotifyBefore] = useState(selectedPlan?.notify_before || 30);

  const tCommon = useTranslations('common');
  const tPlanner = useTranslations('planner');

  if (!selectedPlan || !isModalOpen) return null;

  const handleClose = () => {
    setSelectedPlan(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deletePlan(selectedPlan.id);
      handleClose();
      toast.success(tPlanner('notifications.deleteSuccess'));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(tPlanner('notifications.deleteError'));
    }
  };

  const handleComplete = async () => {
    try {
      await completePlan(selectedPlan.id);
      handleClose();
      toast.success(tPlanner('notifications.completeSuccess'));
    } catch (error) {
      console.error('Complete error:', error);
      toast.error(tPlanner('notifications.completeError'));
    }
  };

  const handleEdit = () => {
    setIsEditingPlan(true);
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm');
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl mx-4 rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {selectedPlan.title}
          </h2>
          <div className="flex items-center gap-2">
            {!selectedPlan.is_completed && (
              <button
                onClick={handleEdit}
                className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 
                         rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={tCommon('edit')}
              >
                <Edit2 size={16} />
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 
                       rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>
                  {formatTime(selectedPlan.start_time)} - {formatTime(selectedPlan.end_time)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{formatDate(selectedPlan.created_at)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">
                  {selectedPlan.plan_type === 'quick' 
                    ? tCommon('plannerForm.quickPlan')
                    : tCommon('plannerForm.customPlan')}
                </span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedPlan.is_completed 
                  ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
              }`}>
                {selectedPlan.is_completed 
                  ? tCommon('completed') 
                  : tCommon('inProgress')}
              </span>
            </div>

            {selectedPlan.details && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                  {selectedPlan.details}
                </div>
              </div>
            )}

            <div className="space-y-4 mt-4 border-t border-slate-200 dark:border-slate-800 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {tPlanner('planModal.priority')}
                  </span>
                </div>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "high" | "medium" | "low")}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm px-3 py-1.5"
                >
                  <option value="low">{tPlanner('planModal.priorityLow')}</option>
                  <option value="medium">{tPlanner('planModal.priorityMedium')}</option>
                  <option value="high">{tPlanner('planModal.priorityHigh')}</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {tPlanner('planModal.notification')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotify(!notify)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notify ? 'bg-slate-900 dark:bg-slate-700' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notify ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {notify && (
                <div className="flex items-center justify-between pl-6">
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {tPlanner('planModal.notifyBefore')}
                  </span>
                  <select
                    value={notifyBefore}
                    onChange={(e) => setNotifyBefore(Number(e.target.value))}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm px-3 py-1.5"
                  >
                    <option value="10">{tPlanner('planModal.notifyBefore10')}</option>
                    <option value="30">{tPlanner('planModal.notifyBefore30')}</option>
                    <option value="60">{tPlanner('planModal.notifyBefore60')}</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-8">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg 
                       hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40
                       transition-colors text-sm"
            >
              <Trash2 size={16} />
              {tCommon('delete')}
            </button>

            {!selectedPlan.is_completed && (
              <>
                <button 
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-slate-100 rounded-lg 
                           hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700
                           transition-colors text-sm"
                >
                  <Edit2 size={16} />
                  {tCommon('edit')}
                </button>

                <button
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
                           hover:bg-blue-700 transition-colors text-sm"
                >
                  <CheckSquare size={16} />
                  {tCommon('complete')}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PlanModal;
