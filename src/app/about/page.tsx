"use client";

import React from "react";
import { useTranslations } from "next-intl";
import NavBar from "@/components/landing/NavBar";
import FooterSection from "@/components/landing/FooterSection";
import { Inter } from "next/font/google";

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
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">
              {t("pages.about.title")}
            </h1>
            <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("pages.about.description")}
            </p>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
