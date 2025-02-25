"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/utils/supabaseClient";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Logo } from '@/components/ui/logo';
import { useTranslations } from 'next-intl';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isProcessingToken, setIsProcessingToken] = useState(true);
  const router = useRouter();
  const t = useTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t('auth.errors.passwordValidation.noMatch'));
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success(t('auth.resetPassword.success'));
      router.push('/auth/login');
    } catch (error: any) {
      toast.error(t('auth.resetPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  // Token kontrolü için useEffect hook'u
  useEffect(() => {
    const handleRecoveryToken = async () => {
      try {
        // Sayfa yüklendiğinde URL parametrelerinde hash kontrolü yap
        const hash = window.location.hash;
        
        if (hash && hash.includes('type=recovery')) {
          // Burada token ve type parametre değerlerini çıkarıyoruz
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          
          if (accessToken) {
            // Token varsa zaten oturum açmış demektir ve şifreyi güncelleyebilir
            console.log('Recovery token found, user can reset password');
            setIsProcessingToken(false);
            return; // Token bulundu, işlem başarılı
          }
        }
        
        // Otomatik token doğrulama yapmayı dene
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          // Session yoksa login'e yönlendirilmeyi engelliyoruz
          // Kullanıcı bu sayfada kalabilir ve belki manuel giriş yaparak şifresini sıfırlayabilir
          setIsProcessingToken(false);
          return;
        }
        
        if (session) {
          // Oturum varsa şifreyi güncelleyebilir
          console.log('Session found, user is authenticated');
          setIsProcessingToken(false);
          return;
        } else {
          // Session yok ama otomatik yönlendirmeyi engelliyoruz
          // Bu sayede kullanıcı sayfada kalabilir
          setIsProcessingToken(false);
        }
      } catch (error) {
        console.error('Error in reset password process:', error);
        setIsProcessingToken(false);
      }
    };

    handleRecoveryToken();
  }, [router]);

  // Token işlemi devam ediyorsa yükleme ekranı göster
  if (isProcessingToken) {
    return (
      <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-rose-50/80 via-violet-50/80 to-white dark:from-slate-950 dark:via-violet-950/50 dark:to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

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
                  {t('auth.resetPassword.newPassword')}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {t('auth.resetPassword.enterNew')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('auth.resetPassword.password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('auth.placeholders.password')}
                      className="w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-colors dark:text-white"
                      required
                    />
                    <Lock className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('auth.resetPassword.confirmPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('auth.placeholders.confirmPassword')}
                      className="w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-colors dark:text-white"
                      required
                    />
                    <Lock className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 dark:bg-white/10 text-white rounded-2xl hover:bg-slate-800 dark:hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  {loading ? t('common.loading') : t('auth.resetPassword.submit')}
                </button>
              </form>

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