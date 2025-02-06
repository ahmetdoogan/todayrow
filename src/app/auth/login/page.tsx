"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Image bileşenini import ediyoruz
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Logo } from '@/components/ui/logo';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const t = useTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await signIn(email, password);
      toast.success(t('auth.notifications.loginSuccess'));
    } catch (err: any) {
      setError(t('auth.errors.loginFailed'));
      toast.error(t('auth.notifications.checkCredentials'));
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(t('auth.errors.googleLoginFailed'));
      toast.error(t('auth.notifications.googleLoginFailed'));
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-rose-50/80 via-violet-50/80 to-white dark:from-slate-950 dark:via-violet-950/50 dark:to-slate-950">
      {/* Background gradients */}
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 opacity-75 bg-[radial-gradient(circle_at_top_left,rgba(255,228,230,0.3),transparent_40%)]" />
        <div className="absolute inset-0 opacity-75 bg-[radial-gradient(circle_at_top_right,rgba(238,242,255,0.3),transparent_40%)]" />
        <div className="absolute inset-0 opacity-75 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.2),transparent_60%)]" />
        <div className="dark:hidden absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="hidden dark:block absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Main content */}
      <div className="relative h-full overflow-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50"
            >
              {/* Logo ve Başlık */}
              <div className="text-center mb-8">
                <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
                  <Logo className="h-8 w-auto mx-auto" />
                </Link>
                <p className="text-slate-600 dark:text-slate-400 mt-2">{t('auth.login.subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-100/80 border border-red-200 text-red-700 rounded-2xl text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Email Input */}
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
                      />
                      <Mail className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
      {t('auth.password')}
    </label>
    <Link
      href="/auth/forgot-password"
      className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
    >
      {t('auth.forgotPassword')}
    </Link>
  </div>
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

                  {/* Giriş Yap Butonu */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-slate-900 dark:bg-white/10 text-white rounded-2xl hover:bg-slate-800 dark:hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    {loading ? t('common.loading') : t('common.signIn')}
                  </button>
                  
                  {/* Google ile Giriş Butonu */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <Image
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span>{t('auth.continueWithGoogle')}</span>
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  {t('auth.noAccount')}{" "}
                  <Link
                    href="/auth/signup"
                    className="text-violet-600 dark:text-violet-400 hover:underline font-medium"
                  >
                    {t('common.register')}
                  </Link>
                </p>
                <Link
                  href="/"
                  className="inline-block mt-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {t('common.navigation.backToHome')}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}