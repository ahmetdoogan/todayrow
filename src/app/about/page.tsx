"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import NavBar from "@/components/landing/NavBar";
import FooterSection from "@/components/landing/FooterSection";
import { Inter } from "next/font/google";
import Image from "next/image";
import { BlurFade } from "@/components/ui/blur-fade";
import { useTheme } from "@/components/providers/ThemeProvider";

// En başta fontları yüklüyoruz
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function AboutPage() {
  const t = useTranslations();
  const { theme } = useTheme();
  const locale = useLocale();

  return (
    <div className={`min-h-screen bg-white dark:bg-[#111111] ${inter.variable} font-sans`}>
      <NavBar />

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-4 bg-white dark:bg-[#111111] relative z-10">
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="font-medium text-gray-900 dark:text-white mb-6 text-4xl md:text-5xl">
                {locale === "en" ? (
                  <>About <span style={{ fontFamily: "'Instrument Serif', serif" }} className="italic text-gray-900 dark:text-white">Us</span></>
                ) : (
                  t("pages.about.title")
                )}
              </h1>
              
              {/* Font yükleme */}
              <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
              `}</style>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t("pages.about.description")}
              </p>
            </div>
          </BlurFade>

          {/* Team Section */}
          <BlurFade delay={0.2}>
            <div className="mb-20">
              <h2 className="text-3xl font-medium text-gray-900 dark:text-white mb-2 text-center">
                {locale === "en" ? (
                  <>Our <span style={{ fontFamily: "'Instrument Serif', serif" }} className="italic text-gray-900 dark:text-white">Team</span></>
                ) : (
                  t("pages.about.team.title")
                )}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
                {t("pages.about.team.description")}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Founder */}
                <div className="group bg-white dark:bg-[#161616] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="rounded-full w-24 h-24 mx-auto mb-4 overflow-hidden flex items-center justify-center relative z-10">
                    <Image 
                      src={theme === "dark" ? "/images/ad_dark.png" : "/images/ad_light.png"}
                      alt={t("pages.about.team.founder.name")}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-1 group-hover:-translate-y-1 transition-transform duration-300 relative z-10">
                    {t("pages.about.team.founder.name")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-4 relative z-10">
                    {t("pages.about.team.founder.role")}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-center text-xs md:text-xs group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 relative z-10">
                    {t("pages.about.team.founder.bio")}
                  </p>
                  <div className="absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out dark:hidden opacity-0 group-hover:opacity-100" 
                       style={{
                         background: `radial-gradient(circle 120px at 50% 40%, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.01) 30%, transparent 70%)`,
                         mixBlendMode: 'multiply',
                       }}
                  />
                  <div className="absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out hidden dark:block opacity-0 group-hover:opacity-100" 
                       style={{
                         background: `radial-gradient(circle 120px at 50% 40%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 30%, transparent 70%)`,
                         mixBlendMode: 'soft-light',
                       }}
                  />
                </div>

                {/* AI 1 */}
                <div className="group bg-white dark:bg-[#161616] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="rounded-full w-24 h-24 mx-auto mb-4 overflow-hidden flex items-center justify-center relative z-10">
                    <Image 
                      src={theme === "dark" ? "/images/claude_dark.png" : "/images/claude.png"}
                      alt={t("pages.about.team.ai1.name")}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-1 group-hover:-translate-y-1 transition-transform duration-300 relative z-10">
                    {t("pages.about.team.ai1.name")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-4 relative z-10">
                    {t("pages.about.team.ai1.role")}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-center text-xs md:text-xs group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 relative z-10">
                    {t("pages.about.team.ai1.bio")}
                  </p>
                  <div className="absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out dark:hidden opacity-0 group-hover:opacity-100" 
                       style={{
                         background: `radial-gradient(circle 120px at 50% 40%, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.01) 30%, transparent 70%)`,
                         mixBlendMode: 'multiply',
                       }}
                  />
                  <div className="absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out hidden dark:block opacity-0 group-hover:opacity-100" 
                       style={{
                         background: `radial-gradient(circle 120px at 50% 40%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 30%, transparent 70%)`,
                         mixBlendMode: 'soft-light',
                       }}
                  />
                </div>

                {/* AI 2 */}
                <div className="group bg-white dark:bg-[#161616] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="rounded-full w-24 h-24 mx-auto mb-4 overflow-hidden flex items-center justify-center relative z-10">
                    <Image 
                      src={theme === "dark" ? "/images/chatgpt_dark.png" : "/images/chatgpt.png"}
                      alt={t("pages.about.team.ai2.name")}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-1 group-hover:-translate-y-1 transition-transform duration-300 relative z-10">
                    {t("pages.about.team.ai2.name")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-4 relative z-10">
                    {t("pages.about.team.ai2.role")}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-center text-xs md:text-xs group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 relative z-10">
                    {t("pages.about.team.ai2.bio")}
                  </p>
                  <div className="absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out dark:hidden opacity-0 group-hover:opacity-100" 
                       style={{
                         background: `radial-gradient(circle 120px at 50% 40%, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.01) 30%, transparent 70%)`,
                         mixBlendMode: 'multiply',
                       }}
                  />
                  <div className="absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out hidden dark:block opacity-0 group-hover:opacity-100" 
                       style={{
                         background: `radial-gradient(circle 120px at 50% 40%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 30%, transparent 70%)`,
                         mixBlendMode: 'soft-light',
                       }}
                  />
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Story and Philosophy Section */}
          <BlurFade delay={0.3}>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Our Story Section */}
              <div>
                <h2 className="text-3xl font-medium text-gray-900 dark:text-white mb-6 text-center">
                  {locale === "en" ? (
                    <>Our <span style={{ fontFamily: "'Instrument Serif', serif" }} className="italic text-gray-900 dark:text-white">Story</span></>
                  ) : (
                    t("pages.about.story.title")
                  )}
                </h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-[#191919] rounded-xl p-6 shadow-sm">
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {t("pages.about.story.part1")}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#191919] rounded-xl p-6 shadow-sm">
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {t("pages.about.story.part2")}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Philosophy Section */}
              <div>
                <h2 className="text-3xl font-medium text-gray-900 dark:text-white mb-6 text-center">
                  {locale === "en" ? (
                    <>Our <span style={{ fontFamily: "'Instrument Serif', serif" }} className="italic text-gray-900 dark:text-white">Philosophy</span></>
                  ) : (
                    t("pages.about.philosophy.title")
                  )}
                </h2>
                
                <div className="bg-gray-50 dark:bg-[#191919] rounded-xl p-6 shadow-sm">
                  <ul className="space-y-4">
                    {[0, 1, 2, 3].map((index) => (
                      <li key={index} className="flex items-start">
                        <div className="rounded-full bg-gray-500 dark:bg-[#333333] p-1 mr-4 mt-1">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{t(`pages.about.philosophy.points.${index}`)}</p>
                      </li>
                    ))}
                  </ul>
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
