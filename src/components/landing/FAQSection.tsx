"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FAQSection() {
  const t = useTranslations();

  // FAQ soruları ve cevapları
  const faqs = [
    {
      id: 1,
      question: t("landing.newLanding.faq.questions.q1.question"),
      answer: t("landing.newLanding.faq.questions.q1.answer")
    },
    {
      id: 2,
      question: t("landing.newLanding.faq.questions.q2.question"),
      answer: t("landing.newLanding.faq.questions.q2.answer")
    },
    {
      id: 3,
      question: t("landing.newLanding.faq.questions.q3.question"),
      answer: t("landing.newLanding.faq.questions.q3.answer")
    },
    {
      id: 4,
      question: t("landing.newLanding.faq.questions.q4.question"),
      answer: t("landing.newLanding.faq.questions.q4.answer")
    },
    {
      id: 5,
      question: t("landing.newLanding.faq.questions.q5.question"),
      answer: t("landing.newLanding.faq.questions.q5.answer")
    }
  ];

  // Aktif (açık) olan soru
  const [activeId, setActiveId] = useState<number | null>(null);

  // Soru tıklandığında açılış/kapanış fonksiyonu
  const toggleFAQ = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 px-4 bg-gray-50 dark:bg-gray-900 relative z-10 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1.5 mb-4 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800/80 dark:to-gray-800/60 text-gray-600 dark:text-gray-200 text-xs font-medium shadow-sm hover:shadow transition-shadow duration-300 border border-gray-200/50 dark:border-gray-700/70">
            {t("landing.newLanding.faq.badge")}
          </div>
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white mb-4">
            <span className="text-gray-900 dark:text-white">
              {t("landing.newLanding.faq.titleParts.frequently")}{" "}
              {t("landing.newLanding.faq.titleParts.asked")}{" "}
            </span>
            <span className="instrument-serif italic text-gray-900 dark:text-white">
              {t("landing.newLanding.faq.titleParts.questions")}
            </span>
          </h2>
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("landing.newLanding.faq.subtitle")}
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left bg-white dark:bg-gray-800 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: activeId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="text-gray-500 dark:text-gray-400"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {activeId === faq.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden bg-white dark:bg-gray-800"
                  >
                    <div className="px-6 py-4 text-sm md:text-base text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
