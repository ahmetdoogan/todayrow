"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, ArrowRight } from "lucide-react";

export default function PricingSection() {
  const t = useTranslations();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <section
      id="pricing"
      className="py-32 px-4 bg-gray-50 dark:bg-[#111111] relative z-10 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1.5 mb-4 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800/80 dark:to-gray-800/60 text-gray-600 dark:text-gray-200 text-xs font-medium hover:shadow transition-shadow duration-300 border border-gray-200/50 dark:border-gray-700/70">
            {t("pricing.title")}
          </div>
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white mb-4">
            {t("common.navigation.login") === "Giriş" ? (
              <>
                <span className="instrument-serif italic text-gray-900 dark:text-white">
                  Üretkenliğini
                </span>{" "}
                <span className="text-gray-900 dark:text-white">artır</span>
              </>
            ) : (
              <>
                <span className="text-gray-900 dark:text-white">Boost your</span>{" "}
                <span className="instrument-serif italic text-gray-900 dark:text-white">
                  productivity
                </span>
              </>
            )}
          </h2>
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("pricing.landingSubtitle")}
          </p>
        </div>

        {/* Pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            {/* Pricing Toggle - Centered at top */}
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-center items-center">
                {/* Dış kapsayıcı */}
                <div className="relative rounded-xl bg-gray-100 dark:bg-gray-700/50 p-1 w-[220px] shadow-inner">
                  {/* İçeride grid ile 2 kolon oluşturuyoruz */}
                  <div className="grid grid-cols-2 gap-1 relative tracking-tight">
                    {/* Highlight - absolute */}
                    <div
                      className="absolute inset-y-0.5 rounded-xl bg-white dark:bg-gray-900 shadow-sm 
                                 transition-all duration-200 ease-out"
                      style={{
                        left: billingCycle === "monthly" ? "1%" : "51%",
                        width: "48%",
                      }}
                    />

                    {/* Monthly Buton */}
                    <button
                      onClick={() => setBillingCycle("monthly")}
                      className={`relative z-10 m-0.5 py-1.5 text-sm font-medium rounded-xl
                                  flex items-center justify-center text-center 
                                  transition-colors duration-200
                        ${
                          billingCycle === "monthly"
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                    >
                      {t("pricing.monthly")}
                    </button>

                    {/* Yearly Buton */}
                    <button
                      onClick={() => setBillingCycle("yearly")}
                      className={`relative z-10 m-0.5 py-1.5 text-sm font-medium rounded-xl
                                  flex items-center justify-center text-center
                                  transition-colors duration-200
                        ${
                          billingCycle === "yearly"
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                    >
                      {t("pricing.yearly")}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Alt kısım: Fiyat ve Özellikler */}
            <div className="flex flex-col md:flex-row p-10 pb-16">
              {/* Price Side */}
              <div className="md:w-1/2 flex flex-col items-center md:items-center mb-6 md:mb-0 md:pr-8">
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-900 dark:text-white mb-1 relative h-[80px] flex items-center justify-center">
                    <motion.div
                      key={billingCycle}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="absolute"
                    >
                      {billingCycle === "monthly" ? "$3" : "$30"}
                    </motion.div>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex items-center justify-center">
                    /<motion.span
                      key={billingCycle}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {billingCycle === "monthly"
                        ? t("pricing.monthlyShort")
                        : (
                          <div className="flex items-center">
                            <span>{t("pricing.yearlyShort")}</span>
                            <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md">
                              {t("pricing.yearlyDiscount")}
                            </span>
                          </div>
                        )}
                    </motion.span>
                  </div>
                </div>

                <Link href="/auth/signup" className="w-full flex justify-center mt-4">
                  <button className="w-full max-w-[260px] py-4 px-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    {t("landing.newLanding.cta.button")}
                    <ArrowRight size={16} />
                  </button>
                </Link>

                <p className="text-gray-500 dark:text-gray-400 text-xs text-center mt-6">
                  {t("pricing.features.noCard")}
                </p>
              </div>

              {/* Features Side */}
              <div className="md:w-1/2 md:pl-8 md:border-l border-gray-200 dark:border-gray-700 flex flex-col items-center md:items-center">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4 text-center">
                  Pro
                </h3>

                <ul className="space-y-6 w-full max-w-sm mx-auto text-center my-6">
                  {[
                    "pricing.features.unlimited",
                    "pricing.features.planning",
                    "pricing.features.calendar",
                    "pricing.features.support",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-center"
                    >
                      <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <Check className="h-3 w-3 text-gray-900 dark:text-gray-100" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-center">
                        {t(feature)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
