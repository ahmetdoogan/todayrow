"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { supabase } from "@/utils/supabaseClient";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Logo } from '@/components/ui/logo';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const t = useTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Boş email kontrolü
    if (!email.trim()) {
      toast.error(t('auth.resetPassword.emailRequired'));
      return;
    }
    
    setLoading(true);

    try {
      // Otomatik yönlendirmeyi önlemek için bir güvenlik ekleyeceğiz
      const resetOptions = {
        redirectTo: `${window.location.origin}/auth/reset-password`,
        captchaToken: undefined // null değil undefined kullanıyoruz (TypeCheck uyumluluğu için)
      };
      
      // supabase için uzun işlem
      const { error } = await supabase.auth.resetPasswordForEmail(email, resetOptions);

      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }

      // Başarılı olduğunda
      setSubmitted(true);
      toast.success(t('auth.resetPassword.emailSent'));
    } catch (error: any) {
      console.error('Password reset catch block error:', error);
      toast.error(t('auth.resetPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  // useEffect kullanılarak sayfa açıldığında herhangi bir otomatik yönlendirmeyi engellemek
  React.useEffect(() => {
    const preventSubmission = (e: BeforeUnloadEvent) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', preventSubmission);
    return () => {
      window.removeEventListener('beforeunload', preventSubmission);
    };
  }, [loading]);

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-rose-50/80 via-violet-50/80 to-white dark:from-slate-950 dark:via-violet-950/50 dark:to-slate-950">
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 opacity-75 bg-[radial-gradient(circle_at_top_left,rgba(255,228,230,0.3),transparent_40%)]" />
        <div className="absolute inset-0 opacity-75 bg-[radial-gradient(circle_at_top_right,rgba(238,242,255,0.3),transparent_40%)]" />
        <div className="absolute inset-0 opacity-75 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.2),transparent_60%)]" />
        <div className="dark:hidden absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="hidden dark:block absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative h-full overflow-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="text-center mb-8">
                <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
                  <Logo className="h-8 w-auto mx-auto" />
                </Link>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {t('auth.resetPassword.title')}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {t('auth.resetPassword.description')}
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {t('auth.email')}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('auth.placeholders.email')}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-colors dark:text-white"
                        required
                        autoComplete="email"
                      />
                      <Mail className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <button
                    type="button" /* Otomatik form gönderimini engellemek için submit yerine button tipi */
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-slate-900 dark:bg-white/10 text-white rounded-2xl hover:bg-slate-800 dark:hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    {loading ? t('common.loading') : t('auth.resetPassword.submit')}
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {t('auth.resetPassword.checkEmail')}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    {t('auth.resetPassword.checkSpam')}
                  </p>
                </div>
              )}

              <div className="mt-8 text-center">
                <Link
                  href="/auth/login"
                  className="text-violet-600 dark:text-violet-400 hover:underline"
                >
                  {t('common.navigation.backToLogin')}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}