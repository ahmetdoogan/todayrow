"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// Container ve children'ların animasyonları
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      // Alt öğelerin peş peşe açılması istenirse stagger eklenebilir
      // staggerChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function FirstTestimonialSection() {
  const t = useTranslations();

  return (
    <section className="py-10 md:py-20 px-4 md:px-8 bg-white dark:bg-[#111111] overflow-hidden relative">
      <div className="max-w-6xl mx-auto">

        {/* Ana kapsayıcı (container) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative flex flex-col md:flex-row items-start gap-8 md:gap-12 p-6 md:p-10 border border-gray-200 dark:border-gray-800 rounded-2xl"
        >
          {/* Çocuk 1: Profil Fotoğrafı */}
          <motion.div 
            variants={childVariants} 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 border border-gray-300 dark:border-gray-200 mt-2"
          >
            <img
              src="/images/sengpt_light.png"
              alt="SenGPT"
              className="w-full h-full object-cover dark:hidden"
            />
            <img
              src="/images/sengpt_dark.png"
              alt="SenGPT"
              className="w-full h-full object-cover hidden dark:block"
            />
          </motion.div>

          {/* Çocuk 2: Yazı Bloğu */}
          <motion.div variants={childVariants} className="flex-1">
            <blockquote className="text-2xl md:text-3xl font-light mb-6 text-gray-800 dark:text-gray-200 leading-tight">
              <span className="instrument-serif italic">&ldquo;</span>
              {t("landing.newLanding.testimonials.testimonial2.quote")}
              <span className="instrument-serif italic">&rdquo;</span>
            </blockquote>
            <div>
              <p className="text-base text-gray-900 dark:text-white">
                <span className="font-medium">
                  {t("landing.newLanding.testimonials.testimonial2.name")}
                </span>,{" "}
                {t("landing.newLanding.testimonials.testimonial2.position")}
              </p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
