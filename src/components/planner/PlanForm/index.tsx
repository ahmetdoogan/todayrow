"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

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

  const t = useTranslations('common');

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
  color: string; // Sadece belirli değerler kabul ediliyor
  is_completed: boolean;
}>({
  title: '',
  details: '',
  start_time: '',
  end_time: '',
  plan_type: 'custom',
  order: 0,
  color: 'bg-blue-500', // Kısıtlamaya uygun bir default değer
  is_completed: false,
});

  const [error, setError] = useState('');

  useEffect(() => {
    setError('');

    if (selectedPlan && selectedPlan.id !== 0) {
      // 1) Mevcut planı düzenle
      const st = new Date(selectedPlan.start_time);
      const et = new Date(selectedPlan.end_time);

      setFormData({
        title: selectedPlan.title,
        details: selectedPlan.details || '',
        start_time: `${st.getHours().toString().padStart(2, '0')}:${st
          .getMinutes()
          .toString()
          .padStart(2, '0')}`,
        end_time: `${et.getHours().toString().padStart(2, '0')}:${et
          .getMinutes()
          .toString()
          .padStart(2, '0')}`,
        plan_type: selectedPlan.plan_type,
        order: selectedPlan.order,
        color: selectedPlan.color || 'bg-violet-500',
        is_completed: selectedPlan.is_completed,
      });

      if (compareDate(new Date(selectedPlan.start_time), today)) {
        setSelectedDay('today');
      } else {
        setSelectedDay('tomorrow');
      }
    } else if (draggedPlan) {
      // 2) DraggedPlan'dan gelen veriler (hazır plan)
      const [h, m] = draggedPlan.dropTime.split(':').map(Number);
      const endH = (h + 1) % 24;

      setFormData({
        title: draggedPlan.quickPlan.title,
        details: '',
        start_time: draggedPlan.dropTime,
        end_time: `${endH.toString().padStart(2, '0')}:${m
          .toString()
          .padStart(2, '0')}`,
        plan_type: 'predefined',
        order: 0,
        color: draggedPlan.quickPlan.color || 'bg-violet-500',
        is_completed: false,
      });

      setSelectedDay(isToday ? 'today' : 'tomorrow');
    } else if (selectedPlan && selectedPlan.id === 0) {
      // 3) Yeni plan (selectedPlan.id === 0)
      const st = new Date(selectedPlan.start_time);
      const et = new Date(selectedPlan.end_time);

      setFormData({
        title: '',
        details: '',
        start_time: `${st.getHours().toString().padStart(2, '0')}:${st
          .getMinutes()
          .toString()
          .padStart(2, '0')}`,
        end_time: `${et.getHours().toString().padStart(2, '0')}:${et
          .getMinutes()
          .toString()
          .padStart(2, '0')}`,
        plan_type: 'custom',
        order: 0,
        color: 'bg-violet-500',
        is_completed: false,
      });
      setSelectedDay(isToday ? 'today' : 'tomorrow');
    } else {
      // 4) Sıfırdan form
      const now = new Date();
      const defaultStart = `${now.getHours().toString().padStart(2, '0')}:${(
        Math.floor(now.getMinutes() / 30) * 30
      )
        .toString()
        .padStart(2, '0')}`;
      const eTime = new Date(now.getTime() + 60 * 60 * 1000);
      const defaultEnd = `${eTime
        .getHours()
        .toString()
        .padStart(2, '0')}:${(
        Math.floor(eTime.getMinutes() / 30) * 30
      )
        .toString()
        .padStart(2, '0')}`;

      setFormData({
        title: '',
        details: '',
        start_time: defaultStart,
        end_time: defaultEnd,
        plan_type: 'custom',
        order: 0,
        color: 'bg-violet-500',
        is_completed: false,
      });
      setSelectedDay(isToday ? 'today' : 'tomorrow');
    }
  }, [selectedPlan, draggedPlan, isToday, isTomorrow, today]);

  function validateTimes(start: string, end: string) {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    return eh * 60 + em > sh * 60 + sm;
  }

  function handleClose() {
    setIsModalOpen(false);
    setIsEditingPlan(false);
    setSelectedPlan(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!validateTimes(formData.start_time, formData.end_time)) {
      setError(t('plannerForm.validationError'));
      return;
    }

    const dayDate = selectedDay === 'today' ? today : tomorrow;
    const [sh, sm] = formData.start_time.split(':').map(Number);
    const [eh, em] = formData.end_time.split(':').map(Number);

    const startDate = new Date(dayDate);
    startDate.setHours(sh, sm, 0, 0);

    const endDate = new Date(dayDate);
    endDate.setHours(eh, em, 0, 0);

    // user_id: user?.id || 0  --> undefined ise 0 yapıyoruz (veya '' da olabilir)
    const planData = {
  ...formData,
  start_time: startDate.toISOString(),
  end_time: endDate.toISOString(),
  user_id: user?.id || 0,
  color: formData.color || 'bg-violet-500' // Default değer eklendi
};

    try {
      if (selectedPlan && selectedPlan.id && selectedPlan.id !== 0) {
        // Güncelle
        await updatePlan(selectedPlan.id, planData);
      } else {
        // Yeni plan
        await createPlan(planData);
      }
      handleClose();
      toast.success(
        isEditingPlan
          ? t('planner.notifications.updateSuccess')
          : t('planner.notifications.createSuccess')
      );
    } catch (err) {
      console.error('Form gönderilirken hata:', err);
      setError(t('plannerForm.submitError'));
    }
  }

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <motion.div
            className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {isEditingPlan ? t('plannerForm.editPlan') : t('plannerForm.newPlan')}
              </h2>
              <button
                onClick={handleClose}
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
                      {t('plannerForm.today')}
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
                      {t('plannerForm.tomorrow')}
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={t('plannerForm.titlePlaceholder')}
                  className="w-full px-4 py-3 text-base bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all
                    placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('plannerForm.startTime')}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) =>
                        setFormData({ ...formData, start_time: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('plannerForm.endTime')}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) =>
                        setFormData({ ...formData, end_time: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder={t('plannerForm.detailsPlaceholder')}
                  rows={3}
                  className="w-full px-4 py-3 text-base bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all
                    placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 
                    rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('plannerForm.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors"
                >
                  {isEditingPlan ? t('plannerForm.updatePlan') : t('plannerForm.createPlan')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
