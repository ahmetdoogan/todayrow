"use client";
import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";

export default function CTASection() {
  const t = useTranslations();
  return (
    <section className="py-20 px-4 bg-white dark:bg-black text-gray-900 dark:text-white relative overflow-hidden">
      {/* Arka plan elementlerini kaldırdık */}
      <div className="max-w-4xl mx-auto relative" id="get-started">
        <div
          className="group p-10 md:p-16 overflow-hidden relative z-10 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-lg bg-grid-pattern-light dark:bg-grid-pattern bg-[length:20px_20px] transition-all duration-300"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/70 to-white/30 dark:from-gray-900/95 dark:via-gray-900/70 dark:to-gray-900/30 group-hover:from-white/90 group-hover:via-white/60 group-hover:to-white/20 dark:group-hover:from-gray-900/90 dark:group-hover:via-gray-900/60 dark:group-hover:to-gray-900/20 transition-all duration-300 z-10"></div>

          <div className="text-center relative z-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6 transition-colors duration-300 group-hover:text-black dark:group-hover:text-white"
            >
              <span className="md:hidden whitespace-pre-line">
                {t("common.navigation.login") === "Giriş" ? "Planlı bir hayata\nbaşlangıç yap" : "Start your\nplanned life"}
              </span>
              <span className="hidden md:inline">
                {t("landing.newLanding.cta.title")}
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-700 dark:text-white/90 mb-10 max-w-2xl mx-auto transition-colors duration-300 group-hover:text-gray-800 dark:group-hover:text-white"
            >
              {t("landing.newLanding.cta.description")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col gap-4 justify-center"
            >
              <Link href="/auth/signup" className="block mx-auto transition-transform duration-300 group-hover:-translate-y-1">
                <RainbowButton>
                  <span className="relative z-10 flex items-center gap-2">
                    {t("landing.newLanding.cta.button")}{" "}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </RainbowButton>
              </Link>
              <p className="text-gray-600 dark:text-white/80 text-sm text-center transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-white">
                {t("landing.newLanding.cta.noCard")}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
