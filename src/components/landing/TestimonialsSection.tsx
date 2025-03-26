"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  GridPatternCard,
  GridPatternCardBody,
} from "@/components/ui/card-with-grid-pattern";
import { cn } from "@/lib/utils";

export default function TestimonialsSection() {
  const t = useTranslations();

  return (
    <section className="py-24 px-4 bg-white dark:bg-gray-900 overflow-hidden relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1.5 mb-4 rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-800/80 dark:to-gray-800/60 text-orange-600 dark:text-gray-200 text-xs font-medium shadow-sm hover:shadow transition-shadow duration-300 border border-orange-200/50 dark:border-gray-700/70">
            {t("landing.newLanding.testimonials.label")}
          </div>
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white mb-4">
            <span className="instrument-serif italic">
              {t("landing.newLanding.testimonials.titleHighlight")}
            </span>{" "}
            {t("landing.newLanding.testimonials.title")}
          </h2>
          <p className="text-sm md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("landing.newLanding.testimonials.subtitle")}
          </p>
        </div>

        {/* User Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12">
          {/* Story 1 - Large featured story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 group"
          >
            <GridPatternCard
              className="rounded-2xl overflow-hidden h-full min-h-[280px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-lg"
              gradientClassName="from-white/95 via-white/80 to-white/20 dark:from-gray-900/95 dark:via-gray-900/80 dark:to-gray-900/20 hover:from-white/90 hover:via-white/60 hover:to-white/10 dark:hover:from-gray-900/90 dark:hover:via-gray-900/60 dark:hover:to-gray-900/10 transition-all duration-500"
              enableHoverEffect={true}
            >
              <GridPatternCardBody className="p-6 md:p-8 flex flex-col h-full">
                <div className="flex items-start mb-6">
                  <div className="group-hover:-translate-y-1 transition-transform duration-300 flex mr-3">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold text-base md:text-lg border border-gray-200 dark:border-gray-700 group-hover:shadow group-hover:border-gray-300 dark:group-hover:border-gray-500 transition-all duration-300">
                      G
                    </div>
                  </div>
                  <div className="group-hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                      {t("landing.newLanding.testimonials.testimonial1.name")}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                      {t("landing.newLanding.testimonials.testimonial1.position")}
                    </p>
                  </div>
                  <div className="ml-auto px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    {t("landing.newLanding.testimonials.testimonial1.badge")}
                  </div>
                </div>

                <blockquote className="text-xs text-gray-700 dark:text-gray-300 mb-6 leading-relaxed pl-[34px] md:pl-[52px] group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {t("landing.newLanding.testimonials.testimonial1.quote")}
                </blockquote>

                <div className="mt-auto flex items-center">
                  <div className="flex group-hover:scale-105 transition-transform duration-300">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </GridPatternCardBody>
            </GridPatternCard>
          </motion.div>

          {/* Story 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <GridPatternCard
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-lg"
              gradientClassName="from-white/95 via-white/80 to-white/20 dark:from-gray-900/95 dark:via-gray-900/80 dark:to-gray-900/20 hover:from-white/90 hover:via-white/60 hover:to-white/10 dark:hover:from-gray-900/90 dark:hover:via-gray-900/60 dark:hover:to-gray-900/10 transition-all duration-500"
              enableHoverEffect={true}
            >
              <div className="p-4 md:p-6">
                <div className="flex items-center mb-3">
                  <div className="group-hover:-translate-y-1 transition-transform duration-300 flex mr-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold text-sm md:text-lg border border-gray-200 dark:border-gray-700 group-hover:shadow group-hover:border-gray-300 dark:group-hover:border-gray-500 transition-all duration-300">
                      S
                    </div>
                  </div>
                  <div className="group-hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                      {t("landing.newLanding.testimonials.testimonial2.name")}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                      {t("landing.newLanding.testimonials.testimonial2.position")}
                    </p>
                  </div>
                </div>
                <blockquote className="text-xs text-gray-600 dark:text-gray-300 mb-4 pl-[34px] md:pl-[52px] leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {t("landing.newLanding.testimonials.testimonial2.quote")}
                </blockquote>
                <div className="pl-[34px] md:pl-[52px]">
                  <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-[10px] rounded-full border border-gray-200 dark:border-gray-700 transition-transform duration-300">
                    {t("landing.newLanding.testimonials.testimonial2.badge")}
                  </span>
                </div>
              </div>
            </GridPatternCard>
          </motion.div>

          {/* Story 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="group"
          >
            <GridPatternCard
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-lg"
              gradientClassName="from-white/95 via-white/80 to-white/20 dark:from-gray-900/95 dark:via-gray-900/80 dark:to-gray-900/20 hover:from-white/90 hover:via-white/60 hover:to-white/10 dark:hover:from-gray-900/90 dark:hover:via-gray-900/60 dark:hover:to-gray-900/10 transition-all duration-500"
              enableHoverEffect={true}
            >
              <div className="p-4 md:p-6">
                <div className="flex items-center mb-3">
                  <div className="group-hover:-translate-y-1 transition-transform duration-300 flex mr-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold text-sm md:text-lg border border-gray-200 dark:border-gray-700 group-hover:shadow group-hover:border-gray-300 dark:group-hover:border-gray-500 transition-all duration-300">
                      M
                    </div>
                  </div>
                  <div className="group-hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                      {t("landing.newLanding.testimonials.testimonial3.name")}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                      {t("landing.newLanding.testimonials.testimonial3.position")}
                    </p>
                  </div>
                </div>
                <blockquote className="text-xs text-gray-600 dark:text-gray-300 mb-4 pl-[34px] md:pl-[52px] leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {t("landing.newLanding.testimonials.testimonial3.quote")}
                </blockquote>
                <div className="pl-[34px] md:pl-[52px]">
                  <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-[10px] rounded-full border border-gray-200 dark:border-gray-700 transition-transform duration-300">
                    {t("landing.newLanding.testimonials.testimonial3.badge")}
                  </span>
                </div>
              </div>
            </GridPatternCard>
          </motion.div>

          {/* Story 4 - Featured quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="md:col-span-3 group"
          >
            <div className="rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-md transition-all duration-300 hover:shadow-lg relative overflow-hidden group-hover:-translate-y-1 group-hover:shadow-xl">
              <div className="p-0">
                <div className="grid md:grid-cols-1 gap-4 items-center">
                  <div>
                    <blockquote className="text-base md:text-xl font-light text-gray-800 dark:text-gray-200 mb-6 instrument-serif italic group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                      {t("landing.newLanding.testimonials.testimonial4.quote")}
                    </blockquote>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4 group-hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm md:text-base group-hover:shadow group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-all duration-300">
                          D
                        </div>
                      </div>
                      <div className="group-hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-base font-medium text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                          {t("landing.newLanding.testimonials.testimonial4.name")}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                          {t("landing.newLanding.testimonials.testimonial4.position")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
