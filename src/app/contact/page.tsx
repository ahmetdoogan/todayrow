"use client";

import React from "react";
import { useTranslations } from "next-intl";
import NavBar from "@/components/landing/NavBar";
import FooterSection from "@/components/landing/FooterSection";
import { Inter } from "next/font/google";
import { BlurFade } from "@/components/ui/blur-fade";
import { Mail } from "lucide-react";

// En başta fontları yüklüyoruz
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function ContactPage() {
  const t = useTranslations();

  return (
    <div className={`min-h-screen bg-white dark:bg-[#111111] ${inter.variable} font-sans`}>
      <NavBar />

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-4 bg-white dark:bg-[#111111] relative z-10">
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">
                {t("pages.contact.title")}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t("pages.contact.description")}
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <div className="bg-white dark:bg-[#161616] rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto">
              <div className="p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  {/* Contact us via email */}
                  <div className="bg-gray-50 dark:bg-[#191919] p-6 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-4 text-center">
                      {t("pages.contact.email.title")}
                    </h2>
                    <div className="flex flex-col items-center gap-4">
                      <p className="font-medium text-gray-900 dark:text-white text-lg mb-2 text-center">
                        {t("pages.contact.email.address")}
                      </p>
                      <a 
                        href={`mailto:${t("pages.contact.email.address")}`}
                        className="inline-flex items-center justify-center px-3 md:px-5 py-1.5 md:py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black border border-transparent dark:border-gray-300 rounded-xl font-medium transition-colors text-sm md:text-base"
                      >
                        {t("pages.contact.email.button")}
                      </a>
                    </div>
                  </div>

                  {/* Follow us */}
                  <div className="bg-gray-50 dark:bg-[#191919] p-6 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-4 text-center">
                      {t("pages.contact.followUs.title")}
                    </h2>
                    <div className="flex flex-col items-center">
                      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                        {t("pages.contact.followUs.description")}
                      </p>
                      <div className="flex justify-center gap-4">
                        {/* Twitter/X */}
                        <a href="https://x.com/todayrowapp" target="_blank" rel="noopener noreferrer" className="bg-gray-200 dark:bg-[#222222] hover:bg-gray-300 dark:hover:bg-[#2a2a2a] p-3 rounded-full transition-colors">
                          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                          </svg>
                        </a>
                        {/* LinkedIn */}
                        <a href="https://www.linkedin.com/company/todayrow" target="_blank" rel="noopener noreferrer" className="bg-gray-200 dark:bg-[#222222] hover:bg-gray-300 dark:hover:bg-[#2a2a2a] p-3 rounded-full transition-colors">
                          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
