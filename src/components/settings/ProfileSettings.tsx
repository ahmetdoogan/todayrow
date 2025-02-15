"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from "next/image";
import { User, MapPin, Globe, BookText, BadgeCheck, Linkedin } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import PricingModal from '@/components/modals/PricingModal';
import { useTranslations } from 'next-intl';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from "@/components/ui/button";
import { SubscriptionBadge } from '@/components/subscription/SubscriptionBadge';

const ProfileSettings = () => {
  const { session: authSession } = useAuth();
  const { formData, setFormData, loading: profileLoading, setLoading, errors, validateForm } = useProfile();
  const { subscription, status, isPro, loading: subscriptionLoading, isTrialing, isVerifiedUser } = useSubscription();

  // Eklenen yeni state: hesabı sil modalı
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const session = useSession();
  const supabase = useSupabaseClient();
  const t = useTranslations('common.profile');

  // 1) Profil verisini çekme
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authSession?.user?.id) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authSession.user.id)
          .maybeSingle();
        if (error) {
          console.error('Profil bilgileri çekilirken hata:', error);
        } else if (data) {
          setFormData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            title: data.title || '',
            linkedin: data.linkedin || '',
            location: data.location || '',
            website: data.website || '',
            bio: data.bio || '',
          });
        } else {
          setFormData({
            first_name: '',
            last_name: '',
            title: '',
            linkedin: '',
            location: '',
            website: '',
            bio: '',
          });
        }
      } catch (err) {
        console.error('fetchProfile error:', err);
      }
    };

    fetchProfile();
  }, [authSession, supabase, setFormData]);

  // 2) Profili kaydetme
  const saveProfile = async () => {
    if (!authSession?.user?.id) {
      toast.error(t('messages.saveError'));
      return { success: false };
    }
    if (!validateForm()) {
      toast.error('Form validation failed');
      return { success: false };
    }
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: authSession.user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          title: formData.title,
          linkedin: formData.linkedin,
          location: formData.location,
          website: formData.website,
          bio: formData.bio,
        });
      if (error) throw error;
      toast.success(t('messages.saveSuccess'));
      return { success: true };
    } catch (error) {
      console.error('Profil kaydedilirken hata:', error);
      toast.error(t('messages.saveError'));
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!authSession?.user?.id) {
      toast.error(t('messages.saveError'));
      return;
    }
    const result = await saveProfile();
    if (!result.success) return;
  };

  // 3) Abonelik portalını açma (cancel subscription vb.)
  const handleOpenPortal = async () => {
    if (!authSession?.access_token) {
      console.error('No session found');
      return;
    }
    try {
      const response = await fetch('/api/open-portal', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authSession.access_token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Something went wrong');
        return;
      }
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Open portal error:', error);
      toast.error('Something went wrong');
    }
  };

  // 4) Hesabı silme (delete-account API çağrısı)
  const handleDeleteAccount = async () => {
    try {
      if (!session?.access_token) {
        toast.error('Oturum bulunamadı');
        return;
      }
      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Silme işlemi başarısız');
      }
      toast.success(t('deleteAccount.toast.success'));
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || t('deleteAccount.toast.error'));
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (subscriptionLoading) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        {/* Profil Fotoğrafı Kartı */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Avatar + Ad Soyad */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {authSession?.user?.user_metadata?.avatar_url ? (
                  <Image
                    src={authSession.user.user_metadata.avatar_url}
                    alt={t('photo.title')}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-violet-500 flex items-center justify-center text-white text-xl font-medium border-2 border-slate-200 dark:border-slate-700">
                    {authSession?.user?.user_metadata?.name 
                      ? authSession.user.user_metadata.name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .toUpperCase()
                          .substring(0, 2)
                      : authSession?.user?.email?.substring(0, 2).toUpperCase()
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
                  {formData.first_name || formData.last_name
                    ? `${formData.first_name} ${formData.last_name}`.trim()
                    : authSession?.user?.email?.split('@')[0]}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {authSession?.user?.email}
                </p>
              </div>
            </div>

            {/* Üyelik Durumu + Upgrade Butonu */}
            <div className="flex items-center gap-3">
              <SubscriptionBadge />
              {isTrialing && (
                <p className="text-is text-gray-500 dark:text-gray-400"></p>
              )}
              {!isPro && (
                <Button
                  variant="default"
                  onClick={() => setIsPricingOpen(true)}
                  className="rounded-xl"
                >
                  {t('trial.upgrade')}
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Abonelik Bilgileri */}
        {subscription && (
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <strong>{t('subscription.planType')}:</strong> {' '}
              {t(`subscription.types.${subscription.subscription_type}`)}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <strong>{t('subscription.status')}:</strong> {' '}
              {t(`subscription.statuses.${subscription.status}`)}
              {subscription.subscription_end && subscription.status === "cancel_scheduled" && (
                <span className="ml-2 text-yellow-600">
                  ({t('subscription.cancelUntil', { 
                    date: new Date(subscription.subscription_end).toLocaleDateString() 
                  })})
                </span>
              )}
            </p>
            {subscription.status === 'free_trial' && subscription.trial_end && (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <strong>{t('subscription.trialEnds')}:</strong> {' '}
                {new Date(subscription.trial_end).toLocaleString()}
              </p>
            )}
            {subscription.status === 'active' && subscription.subscription_end && (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <strong>{t('subscription.renewsAt')}:</strong> {' '}
                {new Date(subscription.subscription_end).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Profil Formu Alanları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* first_name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <User className="w-5 h-5 text-slate-700 dark:text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {t('fields.firstName.label')}
              </span>
            </div>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              placeholder={t('fields.firstName.placeholder')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            {errors.first_name && (
              <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>
            )}
          </motion.div>

          {/* last_name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <User className="w-5 h-5 text-slate-700 dark:text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {t('fields.lastName.label')}
              </span>
            </div>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              placeholder={t('fields.lastName.placeholder')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            {errors.last_name && (
              <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>
            )}
          </motion.div>

          {/* title */}
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

          {/* linkedin */}
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

          {/* location */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-slate-700 dark:text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {t('fields.location.label')}
              </span>
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

          {/* website */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.25 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-5 h-5 text-slate-700 dark:text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {t('fields.website.label')}
              </span>
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
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {t('fields.bio.label')}
            </span>
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

        {/* Save + Cancel Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.35 }}
          className="flex justify-between mt-6"
        >
          {isPro && status !== 'cancel_scheduled' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 underline underline-offset-4 focus:outline-none"
            >
              {t('trial.cancel')}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={profileLoading}
            className="px-4 py-2 bg-zinc-900 hover:bg-black/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-colors disabled:bg-zinc-700 disabled:dark:bg-slate-900"
          >
            {profileLoading ? t('buttons.saving') : t('buttons.save')}
          </button>
        </motion.div>

        {/* Hesabımı Sil Butonu */}
        <div className="mt-2">
          <button
  onClick={() => setShowDeleteModal(true)}
  className="text-sm text-red-600 dark:text-red-500 underline underline-offset-4"
>
  {t('deleteAccount.button')}
</button>

        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded shadow w-80">
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
              Are you sure you want to manage or cancel your subscription?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                No
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowCancelModal(false);
                  handleOpenPortal();
                }}
              >
                Yes, open portal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded shadow w-80">
           <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
  {t('deleteAccount.modal.title')}
  <br />
  <strong>{t('deleteAccount.modal.warning')}</strong>
</p>
<div className="flex justify-end gap-2">
  <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
    {t('deleteAccount.modal.cancel')}
  </Button>
  <Button variant="destructive" onClick={handleDeleteAccount}>
    {t('deleteAccount.modal.confirm')}
  </Button>
</div>

          </div>
        </div>
      )}

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </>
  );
};

export default ProfileSettings;
