"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GridPatternCard, GridPatternCardBody } from "@/components/ui/card-with-grid-pattern";
import { cn } from "@/lib/utils";

interface HowItWorksSectionProps {
  howItWorks: {
    title: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
}

export default function HowItWorksSection({ howItWorks }: HowItWorksSectionProps) {
  const t = useTranslations();
  return (
    <section
      id="how-it-works"
      className="py-20 px-4 bg-gray-50 dark:bg-gray-800 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1.5 mb-4 rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-800/80 dark:to-gray-800/60 text-orange-600 dark:text-gray-200 text-xs font-medium shadow-sm hover:shadow transition-shadow duration-300 border border-orange-200/50 dark:border-gray-700/70">
            {t("landing.newLanding.howItWorks.simpleProcess")}
          </div>
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white mb-4">
            {t("common.navigation.login") === "Giriş" ? (
              <>Nasıl <span className="instrument-serif italic text-gray-900 dark:text-white">Çalışır</span><span className="instrument-serif italic text-gray-900 dark:text-white">?</span></>
            ) : (
              <>How It <span className="instrument-serif italic text-gray-900 dark:text-white">Works</span><span className="instrument-serif italic text-gray-900 dark:text-white">?</span></>
            )}
          </h2>
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            <span className="hidden md:inline">{t("landing.newLanding.howItWorks.subtitle")}</span>
            <span className="md:hidden whitespace-pre-line">
              {t("common.navigation.login") === "Giriş" ? 
                "Dakikalar içinde bugün ve\nyarını planlamaya başlayın" : 
                "Start planning today and\ntomorrow in just minutes"}
            </span>
          </p>
        </div>

        {/* Three cards in a horizontal layout */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="group"
          >
            <GridPatternCard 
              className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-lg rounded-xl h-48"
              gradientClassName="from-white/95 via-white/80 to-white/20 dark:from-gray-900/95 dark:via-gray-900/80 dark:to-gray-900/20 hover:from-white/90 hover:via-white/60 hover:to-white/10 dark:hover:from-gray-900/90 dark:hover:via-gray-900/60 dark:hover:to-gray-900/10 transition-all duration-500"
              enableHoverEffect={true}
            >
              <GridPatternCardBody className="p-4">
                <div className="relative z-10">
              <div className="flex items-center mb-4 group-hover:-translate-y-1 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-900 dark:text-white font-bold text-base mr-3 group-hover:shadow group-hover:border-gray-300 dark:group-hover:border-gray-500 transition-all duration-300">
                  1
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t("landing.newLanding.howItWorks.steps.account.title")}
                </h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 ml-[52px] leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                {t("landing.newLanding.howItWorks.steps.account.description")}
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center ml-[52px] text-gray-900 dark:text-gray-100 text-xs font-medium hover:underline group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300"
              >
                {t("landing.newLanding.howItWorks.signUpNow")} <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
                </div>
              </GridPatternCardBody>
            </GridPatternCard>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <GridPatternCard 
              className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-lg rounded-xl h-48"
              gradientClassName="from-white/95 via-white/80 to-white/20 dark:from-gray-900/95 dark:via-gray-900/80 dark:to-gray-900/20 hover:from-white/90 hover:via-white/60 hover:to-white/10 dark:hover:from-gray-900/90 dark:hover:via-gray-900/60 dark:hover:to-gray-900/10 transition-all duration-500"
              enableHoverEffect={true}
            >
              <GridPatternCardBody className="p-4">
                <div className="relative z-10">
              <div className="flex items-center mb-4 group-hover:-translate-y-1 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-900 dark:text-white font-bold text-base mr-3 group-hover:shadow group-hover:border-gray-300 dark:group-hover:border-gray-500 transition-all duration-300">
                  2
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t("landing.newLanding.howItWorks.steps.plan.title")}
                </h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 ml-[52px] leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                {t("landing.newLanding.howItWorks.steps.plan.description")}
              </p>
              <div className="flex gap-1.5 flex-wrap ml-[52px] items-center h-5">
                <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-[10px] rounded-full border border-gray-200 dark:border-gray-700 group-hover:-translate-y-1 transition-transform duration-300">
                  {t("landing.newLanding.howItWorks.tags.prioritize")}
                </span>
                <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-[10px] rounded-full border border-gray-200 dark:border-gray-700 group-hover:-translate-y-1 transition-transform duration-300">
                  {t("landing.newLanding.howItWorks.tags.focus")}
                </span>
                <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-[10px] rounded-full border border-gray-200 dark:border-gray-700 group-hover:-translate-y-1 transition-transform duration-300">
                  {t("landing.newLanding.howItWorks.tags.achieve")}
                </span>
              </div>
                </div>
              </GridPatternCardBody>
            </GridPatternCard>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="group"
          >
            <GridPatternCard 
              className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-lg rounded-xl h-48"
              gradientClassName="from-white/95 via-white/80 to-white/20 dark:from-gray-900/95 dark:via-gray-900/80 dark:to-gray-900/20 hover:from-white/90 hover:via-white/60 hover:to-white/10 dark:hover:from-gray-900/90 dark:hover:via-gray-900/60 dark:hover:to-gray-900/10 transition-all duration-500"
              enableHoverEffect={true}
            >
              <GridPatternCardBody className="p-4">
                <div className="relative z-10">
              <div className="flex items-center mb-4 group-hover:-translate-y-1 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-900 dark:text-white font-bold text-base mr-3 group-hover:shadow group-hover:border-gray-300 dark:group-hover:border-gray-500 transition-all duration-300">
                  3
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t("landing.newLanding.howItWorks.steps.productive.title")}
                </h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 ml-[52px] leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                {t("landing.newLanding.howItWorks.steps.productive.description")}
              </p>
              <div className="flex gap-2 ml-[52px]">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors duration-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors duration-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-900 dark:bg-white group-hover:scale-110 transition-transform duration-300"></div>
              </div>
                </div>
              </GridPatternCardBody>
            </GridPatternCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}