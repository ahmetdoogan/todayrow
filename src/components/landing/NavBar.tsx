"use client";

import React from "react";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/logo";
import LanguageSwitcher from "@/components/providers/LanguageSwitcher";

export default function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations();

  return (
    <nav className="fixed w-full py-3 md:py-4 px-4 md:px-8 z-50 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-5 md:h-6 w-auto text-gray-900 dark:text-white" />
        </Link>

        <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          <Link
          href="#features"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
          >
          {t("landing.newLanding.navbar.features")}
          </Link>
          <Link
          href="/blog"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
          >
          {t("common.navigation.blog")}
          </Link>
          <Link
          href="#faq"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
          >
          FAQ
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Tema Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 md:p-2 rounded-full text-gray-600 dark:text-gray-400 transition-colors"
          >
            {theme === "dark" ? <Sun size={18} className="md:size-5" /> : <Moon size={18} className="md:size-5" />}
          </button>

          {/* Dil Seçici */}
          <LanguageSwitcher className="flex items-center">
            {({ locale, switchLocale }) => (
              <button
                onClick={() =>
                  switchLocale(locale === "tr" ? "en" : "tr")
                }
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {locale === "tr" ? "🇺🇸" : "🇹🇷"}
              </button>
            )}
          </LanguageSwitcher>

          {/* Login / Get Started */}
          <Link
            href="/auth/login"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors hidden md:block"
          >
            {t("common.navigation.login")}
          </Link>
          <Link
            href="/auth/signup"
            className="px-3 md:px-5 py-1.5 md:py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black border border-transparent dark:border-gray-300 rounded-xl font-medium transition-colors text-sm md:text-base"
          >
            {t("landing.newLanding.navbar.getStarted")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
