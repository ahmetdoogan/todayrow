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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signInWithGoogle } = useAuth();
  const t = useTranslations('auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signIn(email, password);
      toast.success(t("notifications.loginSuccess"));
    } catch (err: any) {
      setError(t("errors.loginFailed"));
      toast.error(t("notifications.checkCredentials"));
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(t("errors.googleLoginFailed"));
      toast.error(t("notifications.googleLoginFailed"));
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-white dark:bg-[#111111]">
      {/* Arka Plan Resmi */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/images/woman1white.png"
          alt="Login illustration"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <img
          src="/images/woman1black.jpg"
          alt="Login illustration dark"
          className="absolute inset-0 h-full w-full object-cover hidden dark:block"
        />
      </div>

      {/* Form Kısmı */}
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
              <CardTitle className="text-xl">{t('login.welcomeTitle')}</CardTitle>
              <CardDescription className="text-slate-600 dark:text-[#a1a1a9]">
                {t('login.welcomeSubtitle')}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full dark:bg-black dark:border-gray-800 dark:text-white dark:hover:bg-gray-900"
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

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-gray-300 dark:after:border-gray-800">
                  <span className="relative z-10 bg-background dark:bg-black px-2 text-muted-foreground dark:text-[#a1a1a9]">
                    {t('or')}
                  </span>
                </div>

                {/* Email ve Password Inputları */}
                <div>
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('placeholders.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 dark:bg-black dark:border-gray-800 dark:text-white dark:placeholder:text-[#a1a1a9]"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t('password')}</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-black dark:text-white hover:underline"
                    >
                      {t('forgotPassword')}
                    </Link>
                  </div>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('placeholders.password')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  {loading ? t('common.loading') : t('signIn')} {/* 'common.' kısmını silin */}
                </Button>

                <p className="text-center text-sm text-slate-600 dark:text-[#a1a1a9]">
                  {t('noAccount')}{" "}
                  <Link
                    href="/auth/signup"
                    className="hover:underline font-medium text-black dark:text-white"
                  >
                    {t('register')}
                  </Link>
                </p>
              </form>

              {/* YASAL METİN (EN ÖNEMLİ KISIM) */}
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