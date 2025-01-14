"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from "next/image";
import { User, MapPin, Globe, BookText, BadgeCheck, Linkedin } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import PricingModal from '@/components/modals/PricingModal';
import { useTranslations } from 'next-intl';

const ProfileSettings = () => {
  const { session } = useAuth();
  const { formData, setFormData, loading, errors, saveProfile } = useProfile();
  const { trialDaysLeft, status } = useSubscription();
  const [isPricingOpen, setIsPricingOpen] = React.useState(false);
  const t = useTranslations('common.profile');

  const handleSave = async () => {
    const result = await saveProfile();
    if (result.success) {
      toast.success(t('messages.saveSuccess'));
    } else {
      toast.error(t('messages.saveError'));
    }
  };

  const isVerifiedUser = status === 'active' || status === 'free_trial';

  return (
    <>
      <div className="space-y-4">
        {/* Profil Fotoğrafı */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                {session?.user?.user_metadata?.avatar_url ? (
                  <Image
                    src={session.user.user_metadata.avatar_url}
                    alt={t('photo.title')}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-violet-500 flex items-center justify-center text-white text-xl font-medium border-2 border-slate-200 dark:border-slate-700">
                    {session?.user?.user_metadata?.name ? 
                      session.user.user_metadata.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase()
                        .substring(0, 2)
                      : 
                      session?.user?.email?.substring(0, 2).toUpperCase()
                    }
                  </div>
                )}
                {isVerifiedUser && (
  <div className="absolute -bottom-0.5 -right-0.5">
    <div className="rounded-full bg-white dark:bg-slate-900 p-[2px]">
      <BadgeCheck className="w-3.5 h-3.5 text-blue-500 dark:text-white" />
    </div>
  </div>
)}
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0]}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {status === 'free_trial' && (
                <span className="px-3 py-1 text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full">
                  Trial {trialDaysLeft} gün
                </span>
              )}
              <button
                onClick={() => setIsPricingOpen(true)}
                className="px-4 py-1 text-xs font-medium bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                Upgrade
              </button>
            </div>
          </div>
        </motion.div>

        {/* Unvan ve LinkedIn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Unvan */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <User className="w-5 h-5 text-slate-700 dark:text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {t('fields.title.label')}
              </span>
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={t('fields.title.placeholder')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </motion.div>

          {/* LinkedIn */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <Linkedin className="w-5 h-5 text-slate-700 dark:text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {t('fields.linkedin.label')}
              </span>
            </div>
            <input
              type="text"
              value={formData.linkedin}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
              placeholder={t('fields.linkedin.placeholder')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            {errors.linkedin && (
              <p className="mt-1 text-xs text-red-500">{errors.linkedin}</p>
            )}
          </motion.div>
        </div>

        {/* Konum ve Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Konum */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-slate-700 dark:text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{t('fields.location.label')}</span>
            </div>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder={t('fields.location.placeholder')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            {errors.location && (
              <p className="mt-1 text-xs text-red-500">{errors.location}</p>
            )}
          </motion.div>

          {/* Website */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.25 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-5 h-5 text-slate-700 dark:text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{t('fields.website.label')}</span>
            </div>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              placeholder={t('fields.website.placeholder')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            {errors.website && (
              <p className="mt-1 text-xs text-red-500">{errors.website}</p>
            )}
          </motion.div>
        </div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <BookText className="w-5 h-5 text-slate-700 dark:text-slate-400" />
            <span className="text-sm text-slate-700 dark:text-slate-300">{t('fields.bio.label')}</span>
          </div>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder={t('fields.bio.placeholder')}
            rows={4}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none"
          />
          {errors.bio && (
            <p className="mt-1 text-xs text-red-500">{errors.bio}</p>
          )}
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.35 }}
          className="flex justify-end mt-6"
        >
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-zinc-900 hover:bg-black/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-colors disabled:bg-zinc-700 disabled:dark:bg-slate-900"
          >
            {loading ? t('buttons.saving') : t('buttons.save')}
          </button>
        </motion.div>
      </div>

      {/* Pricing Modal */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </>
  );
};

export default ProfileSettings;