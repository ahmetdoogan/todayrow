"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { Info } from "lucide-react";

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
      // URL parametrelerini oluştur
      const resetOptions = {
        redirectTo: `${window.location.origin}/auth/reset-password#recovery=true`,
        captchaToken: undefined
      };
      
      console.log('Reset password options:', resetOptions);
      
      // Supabase işlemi
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

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-white dark:bg-[#111111]">
      {/* SOL SÜTUN: Arka plan resmi */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/images/woman6white.png"
          alt="Signup illustration"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
<img
          src="/images/woman6black.jpg"
          alt="Login illustration dark"
          className="absolute inset-0 h-full w-full object-cover hidden dark:block"
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
              <CardTitle className="text-xl">{t('auth.resetPassword.title')}</CardTitle>
              <CardDescription className="text-slate-600 dark:text-[#a1a1a9]">{t('auth.resetPassword.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              {!submitted ? (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <div className="mt-1">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('auth.placeholders.email')}
                        className="dark:bg-black dark:border-gray-800 dark:text-white dark:placeholder:text-[#a1a1a9]"
                        required
                        autoComplete="email"
                      />
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
              ) : (
                <div className="text-center space-y-6">
                  <div className="p-4 rounded-md bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 flex items-start">
                    <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-blue-800 dark:text-[#a1a1a9]">
                        {t('auth.resetPassword.checkEmail')}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-[#a1a1a9] mt-1">
                        {t('auth.resetPassword.checkSpam')}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full dark:bg-black dark:border-gray-800 dark:text-white dark:hover:bg-gray-900"
                    asChild
                  >
                    <Link href="/auth/login">
                      {t('common.navigation.backToLogin')}
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}