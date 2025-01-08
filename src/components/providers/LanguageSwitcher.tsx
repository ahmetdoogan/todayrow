"use client";
import React from "react";
import { useLanguage } from "./LanguageProvider";

/**
 * Bu interface, LanguageSwitcher'ın prop'larını tanımlar:
 * - children: render props fonksiyonu (locale ve switchLocale veriyoruz)
 * - className: opsiyonel CSS sınıfı
 */
interface LanguageSwitcherProps {
  className?: string;
  children: (params: {
    locale: "tr" | "en";
    switchLocale: (lang: "tr" | "en") => void;
  }) => React.ReactNode;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className, children }) => {
  const { language, setLanguage } = useLanguage();

  // setLanguage'ı "switchLocale" adıyla çocuk bileşene aktaracağız
  const switchLocale = (lang: "tr" | "en") => {
    setLanguage(lang);
  };

  return (
    <div className={className}>
      {/* children bir fonksiyon olduğundan, içine locale ve switchLocale parametrelerini veriyoruz */}
      {children({ locale: language, switchLocale })}
    </div>
  );
};

export default LanguageSwitcher;
