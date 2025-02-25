"use client";
import React, { useState, useEffect, useLayoutEffect } from "react";
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
  const [isTokenValid, setIsTokenValid] = useState(false);
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
      // Supabase ile şifre güncelleme
      console.log('Trying to update password...');
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Password update error:', error);
        throw error;
      }

      toast.success(t('auth.resetPassword.success'));
      
      // Başarılı güncellemeden sonra 2 saniye bekleyip login sayfasına yönlendir
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error: any) {
      toast.error(t('auth.resetPassword.error'));
      console.error('Password update catch block error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa açılır açılmaz çalışacak - herhangi bir yönlendirmeden önce
  useLayoutEffect(() => {
    // Yönlendirme işlemini engellemek için history'yi değiştir
    const preventDefault = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', preventDefault);
    return () => window.removeEventListener('popstate', preventDefault);
  }, []);
  
  // Token kontrolü için useEffect hook'u
  useEffect(() => {
    const handleRecoveryToken = async () => {
      try {
        console.log('*** RESET PASSWORD SAYFASI YÜKLENDi ***');
        console.log('URL:', window.location.href);
        console.log('Hash:', window.location.hash);
        console.log('Pathname:', window.location.pathname);

        // URL'den hash veya query parametrelerini kontrol et
        const hash = window.location.hash;
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        
        console.log('URL Token:', urlToken);
        
        // 1. Yol: Doğrudan URL'deki token'ı al
        if (urlToken) {
          console.log('URL Token bulundu, şifre sıfırlama işlemi yapılabilir');
          setIsTokenValid(true);
          setIsProcessingToken(false);
          return;
        }
        
        // 2. Yol: Hash içinde token veya recovery parametresi kontrol et
        if (hash && (hash.includes('type=recovery') || hash.includes('access_token') || hash.includes('recovery=true'))) {
          console.log('Hash içinde token bilgisi bulundu');
          // Burada token ve type parametre değerlerini çıkarıyoruz
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const recoveryParam = hashParams.get('recovery');
          
          if (accessToken || recoveryParam === 'true') {
            console.log('Token/Recovery parametresi bulundu, şifre sıfırlama yapılabilir');
            setIsTokenValid(true);
            setIsProcessingToken(false);
            return; // Token bulundu, işlem başarılı
          }
        }
        
        // 3. Yol: Session ile kontrol etmeyi dene
        try {
          console.log('Oturum kontrolü yapılıyor...');
          const { data } = await supabase.auth.getSession();
          
          if (data?.session) {
            console.log('Aktif oturum bulundu');
            setIsTokenValid(true);
            setIsProcessingToken(false);
          } else {
            // Her durumda sayfada kalıyor ve şifre sıfırlamanın devam edebilmesini sağlıyoruz
            console.log('Oturum bulunamadı, ancak kullanıcıyı sayfada tutuyoruz');
            
            // Eğer recovery parametresi varsa, token olmasa bile kullanıcı şifre sıfırlama yapabilir
            if (hash && hash.includes('recovery=true')) {
              setIsTokenValid(true);  
            }
            
            setIsProcessingToken(false);
          }
        } catch (sessionError) {
          console.error('Session kontrol hatası:', sessionError);
          setIsProcessingToken(false);
        }

      } catch (error) {
        console.error('Token işleme hatası:', error);
        setIsProcessingToken(false);
      }
    };

    handleRecoveryToken();
  }, [router]);

  // Token işlemi devam ediyorsa yükleme ekranı göster
  if (isProcessingToken) {
    return (
      <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-rose-50/80 via-violet-50/80 to-white dark:from-slate-950 dark:via-violet-950/50 dark:to-slate-950 flex items-center justify-center">
        <div>
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500 mb-4 mx-auto"></div>
          <p className="text-center text-gray-700 dark:text-gray-300">Şifre sıfırlama işlemi yapılıyor...</p>
        </div>
      </div>
    );
  }
  
  // Token geçersiz ama sayfa açılmışsa bilgilendirici mesaj göster
  if (!isProcessingToken && !isTokenValid) {
    return (
      <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-rose-50/80 via-violet-50/80 to-white dark:from-slate-950 dark:via-violet-950/50 dark:to-slate-950 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {t('auth.resetPassword.tokenInvalid')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {t('auth.resetPassword.tokenExpired')}
            </p>
          </div>
          
          <div className="space-y-4">
            <Link href="/auth/forgot-password" className="block w-full py-3 bg-slate-900 dark:bg-white/10 text-white text-center rounded-2xl hover:bg-slate-800 dark:hover:bg-white/20 transition-colors">
              {t('auth.resetPassword.requestNewLink')}
            </Link>
            
            <Link href="/auth/login" className="block w-full py-3 text-center text-violet-600 dark:text-violet-400 hover:underline">
              {t('common.navigation.backToLogin')}
            </Link>
          </div>
        </div>
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