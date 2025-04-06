"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/logo";
import LanguageSwitcher from "@/components/providers/LanguageSwitcher";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function FooterSection() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  // Özel işlev - anasayfadaki belirli bölümlere scroll için
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    
    // Eğer ana sayfada değilsek, önce ana sayfaya gidelim
    if (pathname !== "/") {
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
    <footer className="py-16 px-4 bg-black text-white relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-10 md:mb-0 md:max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo className="h-6 w-auto text-white" forceLightMode={true} />
            </Link>
            <p className="text-gray-400 text-sm">
              {t("landing.newLanding.footer.description")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <h3 className="font-medium text-white text-sm mb-3">{t("landing.newLanding.footer.product")}</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#features" 
                    className="text-gray-400 text-xs hover:text-white transition-colors"
                    onClick={(e) => handleAnchorClick(e, '#features')}
                  >
                    {t("landing.newLanding.footer.links.features")}
                  </a>
                </li>
                <li>
                  <a 
                    href="#faq" 
                    className="text-gray-400 text-xs hover:text-white transition-colors"
                    onClick={(e) => handleAnchorClick(e, '#faq')}
                  >
                    {t("landing.newLanding.footer.links.howItWorks")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-white text-sm mb-3">{t("landing.newLanding.footer.company")}</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-400 text-xs hover:text-white transition-colors">
                    {t("landing.newLanding.footer.links.about")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 text-xs hover:text-white transition-colors">
                    {t("landing.newLanding.footer.links.contact")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-white text-sm mb-3">{t("landing.newLanding.footer.legal")}</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/legal/privacy"
                    className="text-gray-400 text-xs hover:text-white transition-colors"
                  >
                    {t("common.navigation.privacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms"
                    className="text-gray-400 text-xs hover:text-white transition-colors"
                  >
                    {t("common.navigation.termsOfService")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs">
            {t("landing.newLanding.footer.copyright").replace("2025", new Date().getFullYear().toString())}
          </p>
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            <LanguageSwitcher className="flex items-center">
              {({ locale, switchLocale }) => (
                <button
                  onClick={() => switchLocale(locale === "tr" ? "en" : "tr")}
                  className="text-gray-500 text-xs hover:text-white transition-colors"
                >
                  {locale === "tr" ? "🇺🇸 English" : "🇹🇷 Türkçe"}
                </button>
              )}
            </LanguageSwitcher>
          </div>
        </div>
      </div>
    </footer>
  );
}