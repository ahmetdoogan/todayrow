"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
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

const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) ? null : "errors.invalidEmail";
};

const validatePassword = (password: string) => {
  const errors = [];
  if (password.length < 8) errors.push("passwordValidation.minLength");
  if (!/[A-Z]/.test(password)) errors.push("passwordValidation.upperCase");
  if (!/[a-z]/.test(password)) errors.push("passwordValidation.lowerCase");
  if (!/[0-9]/.test(password)) errors.push("passwordValidation.number");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("passwordValidation.special");
  return errors.length ? errors : null;
};

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: null as string | null,
    password: null as string[] | null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { signUp, signInWithGoogle } = useAuth();
  const t = useTranslations('auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const emailError = validateEmail(form.email);
    const passwordErrors = validatePassword(form.password);
    
    if (emailError || passwordErrors) {
      setErrors({
        email: emailError ? t(emailError) : null,
        password: passwordErrors ? passwordErrors.map(e => t(`errors.${e}`)) : null
      });
      if (emailError) toast.error(t(emailError));
      if (passwordErrors) toast.error(t('errors.passwordValidation.requirements'));
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error(t('errors.passwordValidation.noMatch'));
      return;
    }

    setLoading(true);
    try {
      await signUp(form.email, form.password);
      toast.success(t('signup.success'));
    } catch (error: any) {
      const errorKey = error.message?.includes("email") ? 'signup.emailInUse' : 'signup.failed';
      toast.error(t(errorKey));
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

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors.email && field === 'email') setErrors(prev => ({ ...prev, email: null }));
    if (errors.password && field === 'password') setErrors(prev => ({ ...prev, password: null }));
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-white dark:bg-[#111111]">
      {/* Left Column: Background Image */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/images/man1white.webp"
          alt="Signup illustration"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <img
          src="/images/man1black.jpg"
          alt="Signup illustration dark"
          className="absolute inset-0 h-full w-full object-cover hidden dark:block"
        />
      </div>

      {/* Right Column: Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10 justify-center bg-white dark:bg-[#111111]">
        <div className="flex justify-center mb-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-8 w-auto" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="border-gray-200 dark:border-gray-800 dark:bg-black">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{t('signup.title')}</CardTitle>
              <CardDescription className="text-slate-600 dark:text-[#a1a1a9]">
                {t('signup.subtitle')}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                type="button"
                variant="outline"
                className="w-full mb-6 dark:bg-black dark:border-gray-800 dark:text-white dark:hover:bg-gray-900"
                onClick={handleGoogleSignIn}
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  width={20}
                  height={20}
                  className="w-5 h-5 mr-2"
                />
                {t('continueWithGoogle')}
              </Button>

              <div className="relative text-center text-sm mb-6 after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background dark:bg-black px-2 text-muted-foreground dark:text-[#a1a1a9]">
                  {t('or')}
                </span>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder={t('placeholders.email')}
                    className={`${errors.email ? "border-red-500" : ""} dark:bg-black dark:border-gray-800 dark:text-white dark:placeholder:text-[#a1a1a9]`}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">{t('password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange('password')}
                      placeholder={t('placeholders.password')}
                      className={`${errors.password ? "border-red-500" : ""} dark:bg-black dark:border-gray-800 dark:text-white dark:placeholder:text-[#a1a1a9]`}
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
                  {errors.password && (
                    <div className="mt-1 text-sm text-red-500">
                      <p>{t('errors.passwordValidation.title')}</p>
                      <ul className="list-disc list-inside">
                        {errors.password.map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      placeholder={t('placeholders.confirmPassword')}
                      className="dark:bg-black dark:border-gray-800 dark:text-white dark:placeholder:text-[#a1a1a9]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-[#a1a1a9] dark:hover:text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  {loading ? t('signup.loading') : t('signup.title')}
                </Button>
              </form>

              <p className="text-center text-sm text-slate-600 dark:text-[#a1a1a9] mt-4">
                {t('hasAccount')}{" "}
                <Link
                  href="/auth/login"
                  className="hover:underline font-medium text-black dark:text-white"
                >
                  {t('login.title')}
                </Link>
              </p>

              <div className="mt-4 text-center text-xs text-muted-foreground dark:text-[#a1a1a9]">
                {t('termsAgreement')}{" "}
                <Link href="/legal/terms" className="underline underline-offset-4 hover:text-primary dark:text-white dark:hover:text-gray-400">
                  {t('termsOfService')}
                </Link>{" "}
                {t('and')}{" "}
                <Link href="/legal/privacy" className="underline underline-offset-4 hover:text-primary dark:text-white dark:hover:text-gray-400">
                  {t('privacyPolicy')}
                </Link>{" "}
                {t('termsAcceptance')}
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-sm text-slate-600 dark:text-[#a1a1a9] hover:underline dark:hover:text-gray-400"
                >
                  {t('backToHome')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}