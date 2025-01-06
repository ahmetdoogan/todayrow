"use client";
import React from "react";
import { useLanguage } from "./LanguageProvider"; // senin path'ine göre düzenle

/**
 * Tailwind ile mantığı düzeltilmiş dil değiştirme butonu
 */
export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "tr" ? "en" : "tr");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform transform hover:-translate-y-1"
    >
      {/* Mantık tersine çevrildi */}
      {language === "tr" ? "🇺🇸" : "🇹🇷"}
    </button>
  );
}
