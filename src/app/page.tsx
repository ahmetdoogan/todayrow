"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import { Inter } from "next/font/google";
import NavBar from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import FirstTestimonialSection from "@/components/landing/FirstTestimonialSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TabsSection from "@/components/landing/TabsSection";
import WhyFocusedPlanningSection from "@/components/landing/WhyFocusedPlanningSection";
import BlogSection from "@/components/landing/BlogSection";
import FAQSection from "@/components/landing/FAQSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import FooterSection from "@/components/landing/FooterSection";
import PricingSection from "@/components/landing/PricingSection";

// Font imports
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function NewLandingPage() {
  const { theme } = useTheme();
  const { signInWithGoogle } = useAuth();
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("planning");

  // Badge visibility states
  const [badgeOpacity, setBadgeOpacity] = useState({
    reminder: 0,
    plan: 0,
    tasks: 0,
    meeting: 0,
  });

  // Badge'lerin başlangıçta gösterilmesi için useEffect
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setBadgeOpacity((prev) => ({ ...prev, reminder: 1 }));
    }, 2000);
    const timer2 = setTimeout(() => {
      setBadgeOpacity((prev) => ({ ...prev, plan: 1 }));
    }, 2300);
    const timer3 = setTimeout(() => {
      setBadgeOpacity((prev) => ({ ...prev, tasks: 1 }));
    }, 2600);
    const timer4 = setTimeout(() => {
      setBadgeOpacity((prev) => ({ ...prev, meeting: 1 }));
    }, 2900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const hideBadge = (badge: keyof typeof badgeOpacity) => {
    setBadgeOpacity((prev) => ({
      ...prev,
      [badge]: 0,
    }));
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Google sign in error:", err);
    }
  };

  // Sayfa içeriği
  const sections = {
    hero: {
      title: t("landing.newLanding.hero.title"),
      subtitle: t("landing.newLanding.hero.subtitle"),
      description: t("landing.newLanding.hero.description"),
      ctaMain: t("landing.newLanding.hero.ctaMain"),
      ctaSecondary: t("landing.newLanding.hero.ctaSecondary"),
    },
    features: [
      {
        title: t("landing.newLanding.features.minimalPlanning.title"),
        description: t("landing.newLanding.features.minimalPlanning.description"),
        icon: "Calendar",
        iconBg: "from-blue-500/20 to-indigo-500/20",
      },
      {
        title: t("landing.newLanding.features.smartReminders.title"),
        description: t("landing.newLanding.features.smartReminders.description"),
        icon: "Bell",
        iconBg: "from-amber-500/20 to-orange-500/20",
      },
      {
        title: t("landing.newLanding.features.quickNotes.title"),
        description: t("landing.newLanding.features.quickNotes.description"),
        icon: "Clipboard",
        iconBg: "from-emerald-500/20 to-teal-500/20",
      },
    ],
    tabs: [
      {
        id: "planning",
        label: t("landing.newLanding.tabs.planning.title"),
        content: t("landing.newLanding.tabs.planning.content"),
      },
      {
        id: "focus",
        label: t("landing.newLanding.tabs.focus.title"),
        content: t("landing.newLanding.tabs.focus.content"),
      },
      {
        id: "reminders",
        label: t("landing.newLanding.tabs.reminders.title"),
        content: t("landing.newLanding.tabs.reminders.content"),
      },
      {
        id: "notes",
        label: t("landing.newLanding.tabs.notes.title"),
        content: t("landing.newLanding.tabs.notes.content"),
      },
    ],

  };

  return (
    <div
      className={`min-h-screen bg-white dark:bg-gray-950 ${inter.variable} font-sans overflow-hidden`}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap");
        .instrument-serif {
          font-family: "Instrument Serif", serif !important;
          font-weight: 400;
        }
      `}</style>



      {/* Background elements - Simple gradients */}
      <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-20 w-[900px] h-[900px] opacity-20 bg-gradient-to-bl from-orange-100 via-pink-100/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-60 -left-40 w-[800px] h-[800px] opacity-20 bg-gradient-to-tr from-blue-100 via-indigo-100/30 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Background elements - Dark mode */}
      <div className="hidden dark:block absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-20 w-[900px] h-[900px] opacity-20 bg-gradient-to-bl from-orange-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-60 -left-40 w-[800px] h-[800px] opacity-20 bg-gradient-to-tr from-blue-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      <NavBar />
      <HeroSection sections={sections} badgeOpacity={badgeOpacity} hideBadge={hideBadge} />
      
      <FirstTestimonialSection />

      {/* Why Todayrow? Section */}
      <section
        id="features"
        className="py-24 px-4 bg-gray-50 dark:bg-gray-900 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1.5 mb-4 rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-800/80 dark:to-gray-800/60 text-orange-600 dark:text-gray-200 text-xs font-medium shadow-sm hover:shadow transition-shadow duration-300 border border-orange-200/50 dark:border-gray-700/70">
              {t("landing.newLanding.features.badge")}
            </div>
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white mb-4">
              {t("landing.newLanding.features.titleParts.why")}{" "}
              <span className="instrument-serif italic text-gray-900 dark:text-white">
                {t("landing.newLanding.features.titleParts.todayrow")}
              </span>
            </h2>
            <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("landing.newLanding.features.subtitle")}
            </p>
          </div>

          {/* FeaturesSection ve TabsSection tek bir kapsayıcıda */}
          <FeaturesSection features={sections.features} />
          <TabsSection
            tabs={sections.tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </section>

      <WhyFocusedPlanningSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <BlogSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}