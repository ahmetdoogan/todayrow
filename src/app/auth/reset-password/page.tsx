"use client";

import React, { useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/utils/supabaseClient";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// ShadCN bileşenleri
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";

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
          // Hash parametrelerini çıkarıyoruz
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const recoveryParam = hashParams.get('recovery');
          
          if (accessToken || recoveryParam === 'true') {
            console.log('Token/Recovery parametresi bulundu, şifre sıfırlama yapılabilir');
            setIsTokenValid(true);
            setIsProcessingToken(false);
            return;
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
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#111111]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {t('auth.resetPassword.checking') || "Şifre sıfırlama işlemi yapılıyor..."}
          </p>
        </div>
      </div>
    );
  }
  
  // Token geçersiz ama sayfa açılmışsa bilgilendirici mesaj göster
  if (!isProcessingToken && !isTokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-white dark:bg-[#111111]">
        <div className="w-full max-w-md">
          <Card className="border-gray-200 dark:border-gray-800 dark:bg-black">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-gray-800">
                <AlertCircle className="h-7 w-7 text-red-500 dark:text-gray-400" />
              </div>
              <CardTitle>{t('auth.resetPassword.tokenInvalid')}</CardTitle>
              <CardDescription className="text-slate-600 dark:text-[#a1a1a9]">
                {t('auth.resetPassword.tokenExpired')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full dark:bg-white dark:text-black dark:hover:bg-gray-200"
                asChild
              >
                <Link href="/auth/forgot-password">
                  {t('auth.resetPassword.requestNewLink')}
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="w-full dark:bg-black dark:border-gray-800 dark:text-white dark:hover:bg-gray-900"
                asChild
              >
                <Link href="/auth/login">
                  {t('common.navigation.backToLogin')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-white dark:bg-[#111111]">
      {/* SOL SÜTUN: Arka plan resmi */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/images/todayy4.jpg"
          alt="Reset password illustration"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      {/* SAĞ SÜTUN: Kart (Form) */}
      <div className="flex flex-col gap-4 p-6 md:p-10 justify-center bg-white dark:bg-[#111111]">
        {/* Logo (orta) */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-8 w-auto" />
          </Link>
        </div>

        {/* Kart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="border-gray-200 dark:border-gray-800 dark:bg-black">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-gray-800">
                <CheckCircle className="h-7 w-7 text-blue-500 dark:text-gray-400" />
              </div>
              <CardTitle>{t('auth.resetPassword.newPassword')}</CardTitle>
              <CardDescription className="text-slate-600 dark:text-[#a1a1a9]">
                {t('auth.resetPassword.enterNew')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* New Password Input */}
                <div>
                  <Label htmlFor="password">{t('auth.resetPassword.password')}</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('auth.placeholders.password')}
                      className="dark:bg-black dark:border-gray-800 dark:text-white dark:placeholder:text-[#a1a1a9]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-[#a1a1a9] dark:hover:text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <Label htmlFor="confirmPassword">{t('auth.resetPassword.confirmPassword')}</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('auth.placeholders.confirmPassword')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-[#a1a1a9] dark:hover:text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  {loading ? t('common.loading') : t('auth.resetPassword.submit')}
                </Button>
                
                {/* Giriş linki */}
                <p className="text-center text-sm text-slate-600 dark:text-[#a1a1a9]">
                  <Link
                    href="/auth/login"
                    className="hover:underline font-medium text-black dark:text-white"
                  >
                    {t('common.navigation.backToLogin')}
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}