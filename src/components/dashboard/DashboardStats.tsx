"use client";
import React, { useMemo } from 'react';
import { useContent } from '@/context/ContentContext';
import { FileText, BarChart2, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const DashboardStats = () => {
  const { getMonthlyProgress, getActivePlatform, getUpcomingDeadlines, getWeeklyPlans, getContentStats } = useContent();
  const t = useTranslations('common.dashboard.dashboardStats.boxes');

  const monthlyProgress = useMemo(() => getMonthlyProgress(), [getMonthlyProgress]);
  const activePlatform = useMemo(() => getActivePlatform(), [getActivePlatform]);
  const upcomingDeadlines = useMemo(() => getUpcomingDeadlines(), [getUpcomingDeadlines]);
  const weeklyPlans = useMemo(() => getWeeklyPlans(), [getWeeklyPlans]);
  const contentStats = useMemo(() => getContentStats(), [getContentStats]);

  return (
    <div className="flex overflow-x-auto gap-3 md:grid md:grid-cols-3 md:gap-5 lg:gap-6 px-4 md:px-6 lg:px-8 mb-8 snap-x snap-mandatory">
      {/* İçerik Durumu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 w-[calc(100%-2rem)] snap-center md:w-auto relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.08] via-transparent to-blue-500/[0.05] dark:from-orange-500/[0.05] dark:to-blue-500/[0.02]" />
        <div className="relative p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
              <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="font-medium text-slate-900 dark:text-white">{t('contentStatus.title')}</h3>
          </div>
          
          <div className="space-y-3">
            <div className="text-2xl font-semibold text-slate-900 dark:text-white">
              {monthlyProgress.completed}/{monthlyProgress.target}
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">
                {t('contentStatus.monthlyTarget')}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">{t('contentStatus.activePlatform')}</span>
              <span className="font-medium text-slate-900 dark:text-white">{activePlatform.platform} ({activePlatform.count})</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">{t('contentStatus.upcomingDeadline')}</span>
              <span className="font-medium text-slate-900 dark:text-white">{upcomingDeadlines}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* İçerik Planlaması */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex-shrink-0 w-[calc(100%-2rem)] snap-center md:w-auto relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-rose-500/[0.08] via-transparent to-amber-500/[0.05] dark:from-rose-500/[0.05] dark:to-amber-500/[0.02]" />
        <div className="relative p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
              <BarChart2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="font-medium text-slate-900 dark:text-white">{t('weeklyPlan.title')}</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">{t('weeklyPlan.thisWeek')}</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {weeklyPlans.thisWeek} {t('weeklyPlan.content')}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">{t('weeklyPlan.nextWeek')}</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {weeklyPlans.nextWeek} {t('weeklyPlan.content')}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">{t('weeklyPlan.emptyDays')}</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {weeklyPlans.emptyDays.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* İçerik İstatistikleri */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex-shrink-0 w-[calc(100%-2rem)] snap-center md:w-auto relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-transparent to-purple-500/[0.05] dark:from-blue-500/[0.05] dark:to-purple-500/[0.02]" />
        <div className="relative p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
              <Layout className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="font-medium text-slate-900 dark:text-white">{t('statistics.title')}</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">{t('statistics.mostProductiveDay')}</span>
              <span className="font-medium text-slate-900 dark:text-white">{contentStats.mostProductiveDay}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">{t('statistics.preferredFormat')}</span>
              <span className="font-medium text-slate-900 dark:text-white">{contentStats.preferredFormat}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">{t('statistics.completionRate')}</span>
              <span className="font-medium text-slate-900 dark:text-white">%{contentStats.completionRate}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardStats;