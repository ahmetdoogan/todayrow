"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Calendar, Bell, Clipboard } from "lucide-react";
import { GridPatternCard, GridPatternCardBody } from "@/components/ui/card-with-grid-pattern";
import { cn } from "@/lib/utils";

interface Feature {
  title: string;
  description: string;
  icon: string;
  iconBg: string;
}

interface FeaturesSectionProps {
  features: Feature[];
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  const t = useTranslations();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
      {features.map((feature, index) => {
        // Standard black/white icon color for all icons
        const iconColor = "text-gray-900 dark:text-gray-100";

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <GridPatternCard 
              className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg h-[150px] rounded-xl"
              gradientClassName="from-white/95 via-white/80 to-white/20 dark:from-gray-800/95 dark:via-gray-800/80 dark:to-gray-800/20 hover:from-white/90 hover:via-white/60 hover:to-white/10 dark:hover:from-gray-800/90 dark:hover:via-gray-800/60 dark:hover:to-gray-800/10 transition-all duration-500"
              enableHoverEffect={true} // Tüm kartlarda hover efektini etkinleştir
            >
              <GridPatternCardBody className="p-4 flex flex-col">
                <div className="flex items-center group-hover:-translate-y-1 transition-transform duration-300">
                  {feature.icon === "Calendar" && (
                    <div className="mr-3">
                      <img
                        src="/images/agenda_light.png"
                        alt={t("landing.newLanding.features.minimalPlanning.title")}
                        className="object-contain w-10 h-10 dark:hidden"
                      />
                      <img
                        src="/images/agenda_dark.png"
                        alt={t("landing.newLanding.features.minimalPlanning.title")}
                        className="object-contain w-10 h-10 hidden dark:block"
                      />
                    </div>
                  )}
                  {feature.icon === "Bell" && (
                    <div className="mr-3">
                      <img
                        src="/images/bell_light.png"
                        alt={t("landing.newLanding.features.smartReminders.title")}
                        className="object-contain w-10 h-10 dark:hidden"
                      />
                      <img
                        src="/images/bell_dark.png"
                        alt={t("landing.newLanding.features.smartReminders.title")}
                        className="object-contain w-10 h-10 hidden dark:block"
                      />
                    </div>
                  )}
                  {feature.icon === "Clipboard" && (
                    <div className="mr-3">
                      <img
                        src="/images/quickplan_light.png"
                        alt={t("landing.newLanding.features.quickNotes.title")}
                        className="object-contain w-10 h-10 dark:hidden"
                      />
                      <img
                        src="/images/quickplan_dark.png"
                        alt={t("landing.newLanding.features.quickNotes.title")}
                        className="object-contain w-10 h-10 hidden dark:block"
                      />
                    </div>
                  )}
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                </div>
                <div className="mt-0.5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 pl-[3.25rem] leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </GridPatternCardBody>
            </GridPatternCard>
          </motion.div>
        );
      })}
    </div>
  );
}