"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Logo } from '@/components/ui/logo';
import { useTranslations } from 'next-intl';

const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return "errors.invalidEmail";
  }
  return null;
};

const validatePassword = (password: string) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push("passwordValidation.minLength");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("passwordValidation.upperCase");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("passwordValidation.lowerCase");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("passwordValidation.number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("passwordValidation.special");
  }

  return errors.length ? errors : null;
};

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[] | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const t = useTranslations('auth');
  const commonT = useTranslations('common'); // common çevirileri için ayrı bir hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      const errorMessage = t(emailValidationError);
      toast.error(errorMessage);
      setEmailError(errorMessage);
      return;
    }

    const passwordValidationErrors = validatePassword(password);
    if (passwordValidationErrors) {
      toast.error(t('errors.passwordValidation.requirements'));
      setPasswordErrors(passwordValidationErrors);
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t('errors.passwordValidation.noMatch'));
      return;
    }
    
    setLoading(true);
    try {
      await signUp(email, password);
      toast.success(t('signup.success'));
    } catch (error: any) {
      if (error.message?.includes("email")) {
        toast.error(t('signup.emailInUse'));
      } else {
        toast.error(t('signup.failed'));
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      toast.error(t('errors.googleLoginFailed'));
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-b from-rose-50/80 via-violet-50/80 to-white dark:from-slate-950 dark:via-violet-950/50 dark:to-slate-950 overflow-auto md:overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 opacity-75 bg-[radial-gradient(circle_at_top_left,rgba(255,228,230,0.3),transparent_40%)]" />
        <div className="absolute inset-0 opacity-75 bg-[radial-gradient(circle_at_top_right,rgba(238,242,255,0.3),transparent_40%)]" />
        <div className="absolute inset-0 opacity-75 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.2),transparent_60%)]" />
        <div className="dark:hidden absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="hidden dark:block absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-8 md:p-4">
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
              <p className="text-slate-600 dark:text-slate-400 mt-2">{t('signup.subtitle')}</p>
            </div>

            <div className="space-y-6 w-full">
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
                <span>{t('continueWithGoogle')}</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400">{t('or')}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('email')}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(null);
                      }}
                      placeholder={t('placeholders.email')}
                      className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border ${
                        emailError ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                      } rounded-2xl focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-colors dark:text-white`}
                      required
                    />
                    <Mail className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                  </div>
                  {emailError && (
                    <p className="mt-1 text-sm text-red-500">{emailError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordErrors(null);
                      }}
                      placeholder={t('placeholders.password')}
                      className={`w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-800 border ${
                        passwordErrors ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                      } rounded-2xl focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-colors dark:text-white`}
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
                  {passwordErrors && (
                    <div className="mt-1 text-sm text-red-500">
                      <p>{t('errors.passwordValidation.title')}</p>
                      <ul className="list-disc list-inside">
                        {passwordErrors.map((error, index) => (
                          <li key={index}>{t(`errors.${error}`)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('confirmPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('placeholders.confirmPassword')}
                      className="w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-colors dark:text-white"
                      required
                    />
                    <Lock className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-3.5"
                    >
                      {showConfirmPassword ? (
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
                  {loading ? t('signup.loading') : t('signup.title')}
                </button>
              </form>
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                {t('hasAccount')}{" "}
                <Link
                  href="/auth/login"
                  className="text-violet-600 dark:text-violet-400 hover:underline font-medium"
                >
                  {t('login.title')}
                </Link>
              </p>
              <Link
                href="/"
                className="inline-block mt-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {commonT('navigation.backToHome')} {/* Burada düzeltme yapıldı */}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}