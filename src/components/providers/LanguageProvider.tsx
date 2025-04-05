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
    
    // Eğer blog sayfasındaysak, URL'yi güncelle
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      
      // Blog post sayfasında mıyız kontrol et
      if (currentPath.includes('/blog/') && currentPath.includes('/post/')) {
        // /blog/{locale}/post/{slug} formatını yakalayıp işle
        const pathParts = currentPath.split('/');
        
        if (pathParts.length >= 5) {
          const currentLocale = pathParts[2]; // şu anki dil
          const currentSlug = pathParts[4];   // şu anki slug
          
          // Önce mevcut sayfadaki çeviri düğmesindeki bağlantıyı bulalım
          const translationLinks = document.querySelectorAll('a[href*="/blog/"][href*="/post/"]');
          
          let translatedSlug = null;
          
          // Çeviri bağlantısını bul (sayfadaki türkçe/ingilizce sürüme geç linki)
          for (const link of Array.from(translationLinks)) {
            const href = link.getAttribute('href');
            if (href && href.includes(`/blog/${lang}/post/`)) {
              translatedSlug = href.split('/').pop(); // Son kısmı (slug) al
              break;
            }
          }
          
          if (translatedSlug) {
            // Çeviri slug'u bulundu, ona yönlendir
            window.location.href = `/blog/${lang}/post/${translatedSlug}`;
            return;
          }
          
          // Eğer çeviri bulunamadıysa, API'yi çağırarak slug'ı almayı dene
          fetch(`/api/blog/translation?locale=${currentLocale}&otherLocale=${lang}&slug=${currentSlug}`)
            .then(response => response.json())
            .then(data => {
              if (data.translatedSlug) {
                window.location.href = `/blog/${lang}/post/${data.translatedSlug}`;
              } else {
                // Çeviri bulunamadı, sadece dili değiştir
                pathParts[2] = lang;
                window.location.href = pathParts.join('/');
              }
            })
            .catch(error => {
              console.error('Error fetching translation:', error);
              // Hata durumunda sadece dili değiştir
              pathParts[2] = lang;
              window.location.href = pathParts.join('/');
            });
          return;
        }
      } else if (currentPath.startsWith('/blog/')) {
        // Diğer blog sayfaları (liste, kategori vs) için sadece dil kısmını değiştir
        const pathParts = currentPath.split('/');
        if (pathParts.length >= 3) {
          pathParts[2] = lang;
          window.location.href = pathParts.join('/');
          return;
        }
      }
    }
    
    // Blog sayfasında değilsek normal yeniden yükleme yap
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