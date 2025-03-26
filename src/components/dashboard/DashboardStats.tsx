"use client";
import React, { useMemo, useState } from 'react';
import { useContent } from '@/context/ContentContext';
import { FileText, BarChart2, Layout, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const MonthlyTargetSelect = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const t = useTranslations('common.dashboard.dashboardStats.boxes');

  const options = [5, 10, 15, 20, 25, 30];

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-between cursor-pointer text-black dark:text-white"
      >
        <span>{value} {t('contentStatus.contents')}</span>
        <Settings2 className="w-4 h-4 text-gray-500 dark:text-[#a1a1a9]" />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-[9999]">
          {options.map((option) => (
            <div
              key={option}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-black dark:text-white"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option} {t('contentStatus.contents')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DashboardStats = () => {
  const {
    getMonthlyProgress,
    getActivePlatform,
    getUpcomingDeadlines,
    getWeeklyPlans,
    getContentStats,
    monthlyTarget,
    updateMonthlyTarget
  } = useContent();
  const t = useTranslations('common.dashboard.dashboardStats.boxes');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const monthlyProgress = useMemo(() => getMonthlyProgress(), [getMonthlyProgress]);
  const activePlatform = useMemo(() => getActivePlatform(), [getActivePlatform]);
  const upcomingDeadlines = useMemo(() => getUpcomingDeadlines(), [getUpcomingDeadlines]);
  const weeklyPlans = useMemo(() => getWeeklyPlans(), [getWeeklyPlans]);
  const contentStats = useMemo(() => getContentStats(), [getContentStats]);
  
  return (
    <>
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
                  <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <h3 className="font-medium text-slate-900 dark:text-white">{t('contentStatus.title')}</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-600 dark:text-white" 
                onClick={() => setIsDialogOpen(true)}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
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
                <span className="font-medium text-slate-900 dark:text-white">
                  {activePlatform.platform} ({activePlatform.count})
                </span>
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
                <span className="font-medium text-slate-900 dark:text-white">{weeklyPlans.emptyDays.join(', ')}</span>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">{t('contentStatus.setMonthlyTarget')}</h2>
          </DialogHeader>
          <MonthlyTargetSelect
            value={monthlyTarget}
            onChange={(value) => {
              updateMonthlyTarget(value);
              setIsDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardStats;