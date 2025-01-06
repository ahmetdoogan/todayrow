"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "tr" | "en";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

function getInitialLanguage(): Language {
  if (typeof window !== 'undefined') {
    // Önce localStorage'ı kontrol et
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) return savedLanguage;

    // Tarayıcı dillerini kontrol et
    const languages = navigator.languages || [navigator.language];
    // Tüm dil tercihlerini kontrol et (tr-TR, tr, en-US, en gibi)
    for (const lang of languages) {
      const langPrefix = lang.toLowerCase().split('-')[0];
      if (langPrefix === 'tr') return 'tr';
      if (langPrefix === 'en') return 'en';
    }
  }
  
  // Eğer localStorage yoksa, cihaz dili tr/en değilse "en" yap:
  return "en";
}

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>("tr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initialLang = getInitialLanguage();
    setLanguageState(initialLang);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    window.location.reload();
  };

  // Hydration sorunlarını önlemek için
  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}