"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Bell, AlertTriangle } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { useSubscription } from '@/hooks/useSubscription';
import PricingModal from '@/components/modals/PricingModal';
import { useAuth } from '@/context/AuthContext';
import ConfirmModal from '@/components/modals/ConfirmModal';

export default function PlanForm() {
  const { user } = useAuth();
  const {
    isModalOpen,
    setIsModalOpen,
    selectedPlan,
    setSelectedPlan,
    draggedPlan,
    selectedDate,
    isEditingPlan,
    setIsEditingPlan,
    createPlan,
    updatePlan
  } = usePlanner();

  const tCommon = useTranslations('common');
  const tPlanner = useTranslations('planner');

  const today = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => {
    const temp = new Date(today);
    temp.setDate(temp.getDate() + 1);
    return temp;
  }, [today]);

  function compareDate(d1: Date, d2: Date) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  const isToday = compareDate(selectedDate, today);
  const isTomorrow = compareDate(selectedDate, tomorrow);

  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow'>(
    isToday ? 'today' : 'tomorrow'
  );

  const [formData, setFormData] = useState<{
    title: string;
    details: string;
    start_time: string;
    end_time: string;
    plan_type: 'custom' | 'predefined' | 'regular' | 'quick';
    order: number;
    color: string;
    is_completed: boolean;
    priority: 'high' | 'medium' | 'low';
    notify: boolean;
    notify_before: number;
  }>({
    title: '',
    details: '',
    start_time: '',
    end_time: '',
    plan_type: 'custom',
    order: 0,
    color: 'bg-blue-500',
    is_completed: false,
    priority: 'low',
    notify: false,
    notify_before: 30,
  });

  const [initialFormData, setInitialFormData] = useState(formData);
  const [error, setError] = useState('');
  const { isExpired } = useSubscription();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    setError('');
    if (selectedPlan && selectedPlan.id !== 0) {
      // Düzenleme
      const st = new Date(selectedPlan.start_time);
      const et = new Date(selectedPlan.end_time);
      setFormData({
        title: selectedPlan.title,
        details: selectedPlan.details || '',
        start_time: `${st.getHours().toString().padStart(2, '0')}:${st.getMinutes().toString().padStart(2, '0')}`,
        end_time: `${et.getHours().toString().padStart(2, '0')}:${et.getMinutes().toString().padStart(2, '0')}`,
        plan_type: selectedPlan.plan_type as 'custom' | 'predefined' | 'regular' | 'quick',
        order: selectedPlan.order,
        color: selectedPlan.color || 'bg-violet-500',
        is_completed: selectedPlan.is_completed,
        priority: selectedPlan.priority || 'low',
        notify: selectedPlan.notify || false,
        notify_before: selectedPlan.notify_before || 30,
      });
      setInitialFormData({
        title: selectedPlan.title,
        details: selectedPlan.details || '',
        start_time: `${st.getHours().toString().padStart(2, '0')}:${st.getMinutes().toString().padStart(2, '0')}`,
        end_time: `${et.getHours().toString().padStart(2, '0')}:${et.getMinutes().toString().padStart(2, '0')}`,
        plan_type: selectedPlan.plan_type as 'custom' | 'predefined' | 'regular' | 'quick',
        order: selectedPlan.order,
        color: selectedPlan.color || 'bg-violet-500',
        is_completed: selectedPlan.is_completed,
        priority: selectedPlan.priority || 'low',
        notify: selectedPlan.notify || false,
        notify_before: selectedPlan.notify_before || 30,
      });
      setSelectedDay(compareDate(new Date(selectedPlan.start_time), today) ? 'today' : 'tomorrow');
    } else if (draggedPlan) {
      // DraggedPlan'dan
      const [h, m] = draggedPlan.dropTime.split(':').map(Number);
      const endH = (h + 1) % 24;
      setFormData({
        title: draggedPlan.quickPlan.title,
        details: '',
        start_time: draggedPlan.dropTime,
        end_time: `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
        plan_type: 'predefined',
        order: 0,
        color: draggedPlan.quickPlan.color || 'bg-violet-500',
        is_completed: false,
        priority: 'low',
        notify: false,
        notify_before: 30,
      });
      setInitialFormData({
        title: draggedPlan.quickPlan.title,
        details: '',
        start_time: draggedPlan.dropTime,
        end_time: `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
        plan_type: 'predefined',
        order: 0,
        color: draggedPlan.quickPlan.color || 'bg-violet-500',
        is_completed: false,
        priority: 'low',
        notify: false,
        notify_before: 30,
      });
      setSelectedDay(isToday ? 'today' : 'tomorrow');
    } else if (selectedPlan && selectedPlan.id === 0) {
      // Yeni plan (seçili ama boş)
      const st = new Date(selectedPlan.start_time);
      const et = new Date(selectedPlan.end_time);
      setFormData({
        title: '',
        details: '',
        start_time: `${st.getHours().toString().padStart(2, '0')}:${st.getMinutes().toString().padStart(2, '0')}`,
        end_time: `${et.getHours().toString().padStart(2, '0')}:${et.getMinutes().toString().padStart(2, '0')}`,
        plan_type: 'custom',
        order: 0,
        color: 'bg-violet-500',
        is_completed: false,
        priority: 'low',
        notify: false,
        notify_before: 30,
      });
      setInitialFormData({
        title: '',
        details: '',
        start_time: `${st.getHours().toString().padStart(2, '0')}:${st.getMinutes().toString().padStart(2, '0')}`,
        end_time: `${et.getHours().toString().padStart(2, '0')}:${et.getMinutes().toString().padStart(2, '0')}`,
        plan_type: 'custom',
        order: 0,
        color: 'bg-violet-500',
        is_completed: false,
        priority: 'low',
        notify: false,
        notify_before: 30,
      });
      setSelectedDay(isToday ? 'today' : 'tomorrow');
    } else {
      // Sıfırdan form
      const now = new Date();
      const defaultStart = `${now.getHours().toString().padStart(2, '0')}:${(Math.floor(now.getMinutes() / 30) * 30).toString().padStart(2, '0')}`;
      const eTime = new Date(now.getTime() + 60 * 60 * 1000);
      const defaultEnd = `${eTime.getHours().toString().padStart(2, '0')}:${(Math.floor(eTime.getMinutes() / 30) * 30).toString().padStart(2, '0')}`;
      setFormData({
        title: '',
        details: '',
        start_time: defaultStart,
        end_time: defaultEnd,
        plan_type: 'custom',
        order: 0,
        color: 'bg-violet-500',
        is_completed: false,
        priority: 'low',
        notify: false,
        notify_before: 30,
      });
      setInitialFormData({
        title: '',
        details: '',
        start_time: defaultStart,
        end_time: defaultEnd,
        plan_type: 'custom',
        order: 0,
        color: 'bg-violet-500',
        is_completed: false,
        priority: 'low',
        notify: false,
        notify_before: 30,
      });
      setSelectedDay(isToday ? 'today' : 'tomorrow');
    }
  }, [selectedPlan, draggedPlan, isToday, isTomorrow, today]);

  function validateTimes(start: string, end: string) {
    // Günü aşan durumlara izin vermek için özel kontrol
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    
    // Eğer başlangıç saati bitiş saatinden büyükse, bu gönü aşan bir plan olabilir
    if (sh > eh || (sh === eh && sm > em)) {
      // Günü aşan plan - geçerli
      return true;
    }
    
    // Normal durum - bitiş, başlangıçtan sonra olmalı
    return eh * 60 + em > sh * 60 + sm;
  }

  function handleClose() {
    setIsModalOpen(false);
    setIsEditingPlan(false);
    setSelectedPlan(null);
  }

  const handleAttemptClose = () => {
    if (
      formData.title !== initialFormData.title ||
      formData.details !== initialFormData.details ||
      formData.start_time !== initialFormData.start_time ||
      formData.end_time !== initialFormData.end_time ||
      formData.plan_type !== initialFormData.plan_type ||
      formData.order !== initialFormData.order ||
      formData.color !== initialFormData.color ||
      formData.is_completed !== initialFormData.is_completed ||
      formData.priority !== initialFormData.priority ||
      formData.notify !== initialFormData.notify ||
      formData.notify_before !== initialFormData.notify_before
    ) {
      setIsConfirmModalOpen(true);
    } else {
      handleClose();
    }
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    handleClose();
    toast.info(tCommon('planner.notifications.undoSuccess2'));
  };

  const handleCancelClose = () => {
    setIsConfirmModalOpen(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (isExpired) {
      setIsPricingModalOpen(true);
      return;
    }
    if (!validateTimes(formData.start_time, formData.end_time)) {
      setError(tCommon('plannerForm.validationError'));
      return;
    }
    // Planın gerçek tarih/saatlerini ayarla
    const dayDate = selectedDay === 'today' ? today : tomorrow;
    const [sh, sm] = formData.start_time.split(':').map(Number);
    const [eh, em] = formData.end_time.split(':').map(Number);
    
    // Başlangıç tarihini ayarla
    const startDate = new Date(dayDate);
    startDate.setHours(sh, sm, 0, 0);
    
    // Bitiş tarihini ayarla
    const endDate = new Date(dayDate);
    
    // Günü aşan durum için kontrol (örn. 23:00 - 01:00)
    if (sh > eh || (sh === eh && sm > em)) {
      // Bitiş tarihi bir sonraki gün olmalı
      endDate.setDate(endDate.getDate() + 1);
    }
    
    endDate.setHours(eh, em, 0, 0);
    const planData = {
      ...formData,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      user_id: user?.id || 0,
      color: formData.color || 'bg-violet-500'
    };
    try {
      if (selectedPlan && selectedPlan.id && selectedPlan.id !== 0) {
        await updatePlan(selectedPlan.id, planData);
      } else {
        await createPlan(planData);
      }
      handleClose();
    } catch (err) {
      console.error('Form gönderilirken hata:', err);
      setError(tCommon('plannerForm.submitError'));
    }
  }

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          key="modal-overlay"
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleAttemptClose}
        >
          <motion.div
            key="modal-content"
            className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {isEditingPlan ? tCommon('plannerForm.editPlan') : tCommon('plannerForm.newPlan')}
              </h2>
              <button
                onClick={handleAttemptClose}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {!isEditingPlan && (
                <div className="mb-6">
                  <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedDay('today')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        selectedDay === 'today'
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      {tCommon('plannerForm.today')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDay('tomorrow')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        selectedDay === 'tomorrow'
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      {tCommon('plannerForm.tomorrow')}
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={tCommon('plannerForm.titlePlaceholder')}
                  className="w-full px-4 py-3 text-base bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all
                    placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {tCommon('plannerForm.startTime')}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {tCommon('plannerForm.endTime')}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {tCommon('plannerForm.details')}
                </label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder={tCommon('plannerForm.detailsPlaceholder')}
                  className="w-full px-4 py-3 text-base bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all
                    placeholder:text-gray-400 dark:placeholder:text-gray-500 min-h-[100px]"
                />
              </div>

              {error && (
                <div className="mb-4 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {tCommon('plannerForm.priority')}
                    </span>
                  </div>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm px-3 py-1.5"
                  >
                    <option value="low">{tCommon('plannerForm.priorityLow')}</option>
                    <option value="medium">{tCommon('plannerForm.priorityMedium')}</option>
                    <option value="high">{tCommon('plannerForm.priorityHigh')}</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {tCommon('plannerForm.notification')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, notify: !formData.notify })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.notify ? 'bg-gray-900 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.notify ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {formData.notify && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pl-6">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {tCommon('plannerForm.notifyBefore')}
                      </span>
                      <select
                        value={formData.notify_before}
                        onChange={(e) => setFormData({ ...formData, notify_before: Number(e.target.value) })}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm px-3 py-1.5"
                      >
                        <option value="10">{tCommon('plannerForm.notifyBefore10')}</option>
                        <option value="30">{tCommon('plannerForm.notifyBefore30')}</option>
                        <option value="60">{tCommon('plannerForm.notifyBefore60')}</option>
                      </select>
                    </div>
                    
                    {/* Bildirim zamanı açıklaması */}
                    <div className="pl-6 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                      <div className="flex items-start">
                        <Bell className="w-3 h-3 mt-0.5 mr-1 text-blue-500 dark:text-blue-400" />
                        <span>
                          {tCommon('plannerForm.notificationExplanation', {
                            minutes: formData.notify_before,
                            date: selectedDay === 'today' ? tCommon('plannerForm.today') : tCommon('plannerForm.tomorrow'),
                            time: formData.start_time
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleAttemptClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {tCommon('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors"
                >
                  {isEditingPlan ? tCommon('plannerForm.updatePlan') : tCommon('plannerForm.createPlan')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        message={tCommon('confirmCloseMessage')}
      />
    </AnimatePresence>
  );
}
