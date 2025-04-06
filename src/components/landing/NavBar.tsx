"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/logo";
import LanguageSwitcher from "@/components/providers/LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    // Mevcut yolu al (client tarafında çalışır)
    setCurrentPath(window.location.pathname);
  }, []);

  // Çapa linkleri için özel işlev
  const handleAnchorClick = (e, anchor) => {
    e.preventDefault();
    
    // Eğer ana sayfada değilsek, önce ana sayfaya gidelim
    if (currentPath !== "/") {
      router.push(`/${anchor}`);
    } else {
      // Ana sayfadaysak, smooth scroll yapalım
      const element = document.getElementById(anchor.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

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
            onClick={(e) => handleAnchorClick(e, '#features')}
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
            onClick={(e) => handleAnchorClick(e, '#faq')}
          >
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700 mr-1 md:mr-3">
            {/* Tema Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 md:p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border-r border-gray-200 dark:border-gray-700"
            >
              {theme === "dark" ? <Sun size={16} className="md:size-4" /> : <Moon size={16} className="md:size-4" />}
            </button>

            {/* Dil Seçici */}
            <LanguageSwitcher className="flex items-center">
              {({ locale, switchLocale }) => (
                <button
                  onClick={() =>
                    switchLocale(locale === "tr" ? "en" : "tr")
                  }
                  className="p-1.5 md:p-2 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {locale === "tr" ? "EN" : "TR"}
                </button>
              )}
            </LanguageSwitcher>
          </div>

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

          {/* Hamburger icon for mobile */}
          <button 
            className="md:hidden flex items-center justify-center p-1.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden absolute top-full left-0 right-0 z-50 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-gray-800/50 shadow-md"
          >
            <div className="py-4 px-5 space-y-4 flex flex-col">
              <Link
                href="#features"
                className="py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium flex items-center gap-2"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleAnchorClick(e, '#features');
                }}
              >
                {t("landing.newLanding.navbar.features")}
              </Link>
              <Link
                href="/blog"
                className="py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("common.navigation.blog")}
              </Link>
              <Link
                href="#faq"
                className="py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium flex items-center gap-2"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleAnchorClick(e, '#faq');
                }}
              >
                FAQ
              </Link>
              <Link
                href="/auth/login"
                className="py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("common.navigation.login")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
