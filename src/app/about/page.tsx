"use client";

import React from "react";
import { useTranslations } from "next-intl";
import NavBar from "@/components/landing/NavBar";
import FooterSection from "@/components/landing/FooterSection";
import { Inter } from "next/font/google";
import Image from "next/image";
import { BlurFade } from "@/components/ui/blur-fade";

// En başta fontları yüklüyoruz
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function AboutPage() {
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
                {t("pages.about.title")}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t("pages.about.description")}
              </p>
            </div>
          </BlurFade>

          {/* Our Story Section */}
          <BlurFade delay={0.2}>
            <div className="mb-20">
              <h2 className="text-3xl font-medium text-gray-900 dark:text-white mb-6 text-center">
                {t("pages.about.story.title")}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-[#191919] rounded-xl p-6 shadow-sm">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t("pages.about.story.part1")}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-[#191919] rounded-xl p-6 shadow-sm">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t("pages.about.story.part2")}
                  </p>
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Team Section */}
          <BlurFade delay={0.3}>
            <div className="mb-20">
              <h2 className="text-3xl font-medium text-gray-900 dark:text-white mb-2 text-center">
                {t("pages.about.team.title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
                {t("pages.about.team.description")}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Founder */}
                <div className="bg-white dark:bg-[#161616] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="rounded-full w-24 h-24 bg-gray-100 dark:bg-[#222222] mx-auto mb-4 overflow-hidden flex items-center justify-center text-4xl font-bold text-gray-500 dark:text-gray-300">
                    {t("pages.about.team.founder.name").charAt(0)}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-1">
                    {t("pages.about.team.founder.name")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-4">
                    {t("pages.about.team.founder.role")}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {t("pages.about.team.founder.bio")}
                  </p>
                </div>

                {/* AI 1 */}
                <div className="bg-white dark:bg-[#161616] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="rounded-full w-24 h-24 bg-gray-200 dark:bg-[#222222] mx-auto mb-4 overflow-hidden flex items-center justify-center text-4xl font-bold text-gray-500 dark:text-gray-300">
                    {t("pages.about.team.ai1.name").charAt(0)}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-1">
                    {t("pages.about.team.ai1.name")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-4">
                    {t("pages.about.team.ai1.role")}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {t("pages.about.team.ai1.bio")}
                  </p>
                </div>

                {/* AI 2 */}
                <div className="bg-white dark:bg-[#161616] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="rounded-full w-24 h-24 bg-gray-300 dark:bg-[#222222] mx-auto mb-4 overflow-hidden flex items-center justify-center text-4xl font-bold text-gray-500 dark:text-gray-300">
                    {t("pages.about.team.ai2.name").charAt(0)}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-1">
                    {t("pages.about.team.ai2.name")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-4">
                    {t("pages.about.team.ai2.role")}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {t("pages.about.team.ai2.bio")}
                  </p>
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Philosophy Section */}
          <BlurFade delay={0.4}>
            <div className="mb-10">
              <h2 className="text-3xl font-medium text-gray-900 dark:text-white mb-2 text-center">
                {t("pages.about.philosophy.title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
                {t("pages.about.philosophy.description")}
              </p>
              
              <div className="max-w-3xl mx-auto bg-gray-50 dark:bg-[#191919] rounded-xl p-8 shadow-sm">
                <ul className="space-y-4">
                  {[0, 1, 2, 3].map((index) => (
                    <li key={index} className="flex items-start">
                      <div className="rounded-full bg-gray-500 dark:bg-[#333333] p-1 mr-4 mt-1">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{t(`pages.about.philosophy.points.${index}`)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
