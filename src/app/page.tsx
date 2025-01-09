"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Image bileşenini import ediyoruz
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import dynamic from "next/dynamic";
import { Fraunces } from "next/font/google";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/ui/logo";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/providers/LanguageSwitcher"; // Dil değiştirme fonksiyonu

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

const fraunces = Fraunces({ subsets: ["latin"] });

const SPLINE_SCENES = {
  dark: "https://prod.spline.design/8ma2msMNzQPlUkoV/scene.splinecode",
  light: `https://prod.spline.design/HBocpLglQGgMEfho/scene.splinecode?t=${Date.now()}`
};

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [isSplineReady, setIsSplineReady] = useState(false);
  const { signInWithGoogle } = useAuth();
  const t = useTranslations();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplineReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Google sign in error:", err);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Light mode background */}
      <div className="absolute inset-0 dark:hidden bg-[#fff7ed]">
        <div className="absolute -top-40 left-1/3 w-[1000px] h-[1000px] blur-3xl bg-gradient-to-b from-orange-100/40 via-orange-50/20 to-transparent rounded-full" />
        <div className="absolute top-20 right-1/4 w-[800px] h-[800px] blur-3xl bg-gradient-to-b from-rose-100/30 via-orange-50/20 to-transparent rounded-full" />
        <div className="absolute bottom-0 right-0 w-full h-[500px] bg-gradient-to-t from-white via-white to-transparent" />
      </div>

      {/* Dark mode background */}
      <div className="absolute inset-0 dark:block hidden">
        <div className="absolute inset-0 bg-[#0D1117]" />
      </div>

      {/* Spline Scene */}
      {isSplineReady && (
        <div
          id="spline-container"
          className="fixed inset-0 hidden sm:block transition-opacity duration-300"
          style={{ zIndex: 1 }}
        >
          <div className="absolute inset-0" style={{ width: "100vw", height: "100vh" }}>
            <Suspense fallback={null}>
              <Spline
                scene={theme === "dark" ? SPLINE_SCENES.dark : SPLINE_SCENES.light}
                style={{
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  transform: "none",
                  transformOrigin: "center center",
                }}
              />
            </Suspense>
          </div>
          <div
            className={`absolute inset-0 pointer-events-none ${
              theme === "dark"
                ? "bg-gradient-to-b from-[#0D1117]/50 via-transparent to-[#0D1117]/50"
                : "bg-gradient-to-b from-white/50 via-transparent to-white/50"
            }`}
          />
        </div>
      )}

      {/* Navigation Bar */}
      <div className="w-full fixed top-6 left-0 right-0 z-[3] px-4">
        <nav className="max-w-6xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-[2rem] px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo className="h-5 w-auto" />
            </Link>

            <div className="flex items-center gap-3 sm:gap-6">
              {/* Tema (Dark/Light) Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              >
                {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {/* Login / Signup Linkleri */}
              <Link
                href="/auth/login"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors whitespace-nowrap text-sm sm:text-base"
              >
                {t('common.navigation.login')}
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/20 text-white rounded-[3rem] font-medium transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                {t('common.navigation.start')}
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="h-full flex items-center justify-center z-[2] relative">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`text-[3.5rem] sm:text-[5rem] lg:text-[6.5rem] leading-[1.1] tracking-tight text-gray-900 dark:text-white ${fraunces.className}`}
            >
              {t('landing.title')}
              <br />
              {t('landing.subtitle')}
            </motion.h1>
          </motion.div>

          <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.4 }}
    className="flex flex-wrap justify-center gap-2 sm:gap-3 text-base sm:text-lg"
>
    <span className="px-4 sm:px-5 py-2 rounded-full bg-orange-300/50 dark:bg-white/5 text-gray-600 dark:text-gray-300">
        {t('landing.features.today')}
    </span>
    <span className="px-2 py-2 text-gray-500 dark:text-gray-400">
        {t('landing.features.yours')}
    </span>
    <span className="px-4 sm:px-5 py-2 rounded-full bg-orange-100/60 dark:bg-white/5 text-gray-600 dark:text-gray-300">
        {t('landing.features.prepare')}
    </span>
    <span className="px-4 sm:px-5 py-2 rounded-full bg-orange-300/50 dark:bg-white/5 text-gray-600 dark:text-gray-300">
        {t('landing.features.tomorrow')}
    </span>
</motion.div>


          {/* Google Sign In + Email Sign Up */}
          <div className="max-w-sm mx-auto flex flex-col items-center gap-3">
            <button
              onClick={handleGoogleSignIn}
              className="w-64 py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
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

            <div className="w-full flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('auth.or')}</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
            </div>

            <Link
              href="/auth/signup"
              className="w-64 py-2.5 bg-slate-900 hover:bg-slate-700 border border-slate-800/30 dark:bg-orange-900 dark:hover:bg-orange-950 dark:border-orange-800/30 text-white rounded-2xl text-base font-medium transition-colors text-center"
            >
              {t('auth.continueWithEmail')}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-4 left-0 right-0 z-[2] px-4">
        <div className="max-w-6xl mx-auto flex justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
          <Link
            href="/legal/privacy"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {t('common.navigation.privacyPolicy')}
          </Link>
          {/* Dil Değiştirici (Bayrak Emojileri) */}
          <LanguageSwitcher className="flex items-center gap-1">
            {({ locale, switchLocale }) => (
              <button
                onClick={() => switchLocale(locale === "tr" ? "en" : "tr")}
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {locale === "tr" ? "🇺🇸" : "🇹🇷"}
              </button>
            )}
          </LanguageSwitcher>
          <Link
            href="/legal/terms"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {t('common.navigation.termsOfService')}
          </Link>
        </div>
      </footer>
    </div>
  );
}