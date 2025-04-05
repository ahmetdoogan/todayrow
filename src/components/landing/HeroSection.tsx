"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Check,
  Calendar,
  Clock,
  Clipboard,
  Bell,
  CheckCircle,
  Plus,
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ContainerScroll } from "@/components/ui/container-scroll";

interface HeroSectionProps {
  sections: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
      ctaMain: string;
      ctaSecondary: string;
    };
  };
  badgeOpacity: {
    reminder: number;
    plan: number;
    tasks: number;
    meeting: number;
  };
  hideBadge: (badge: "reminder" | "plan" | "tasks" | "meeting") => void;
}

export default function HeroSection({
  sections,
  badgeOpacity,
  hideBadge,
}: HeroSectionProps) {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });

  const t = useTranslations();

  return (
    <section
      className="pt-24 md:pt-32 pb-40 md:pb-48 px-4 relative z-10 overflow-hidden bg-white dark:bg-[#111111]"
      ref={scrollRef}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-10 mt-8 md:mt-12">
          <BlurFade delay={0.1}>
            <div className="inline-block px-3 py-1.5 mb-4 rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-800/80 dark:to-gray-800/60 text-orange-600 dark:text-gray-200 text-xs font-medium shadow-sm hover:shadow transition-shadow duration-300 border border-orange-200/50 dark:border-gray-700/70">
              {t("landing.newLanding.hero.badge")}
            </div>
          </BlurFade>

          <BlurFade delay={0.3}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-gray-900 dark:text-white text-center mb-5">
              <span className="text-gray-900 dark:text-gray-100 flex flex-col">
                <span className="inline-block">
                  <span
                    style={{
                      fontFamily: '"Instrument Serif", serif',
                      fontStyle: "italic",
                      fontWeight: 300,
                      color: "inherit",
                    }}
                  >
                    {t("landing.newLanding.hero.titleParts.today")}
                  </span>{" "}
                  {t("landing.newLanding.hero.titleParts.isYours")}
                </span>
                <span className="inline-block">
                  {t("landing.newLanding.hero.titleParts.prepare")}{" "}
                  <span
                    style={{
                      fontFamily: '"Instrument Serif", serif',
                      fontStyle: "italic",
                      fontWeight: 300,
                      color: "inherit",
                    }}
                  >
                    {t("landing.newLanding.hero.titleParts.tomorrow")}
                  </span>
                  {t("landing.newLanding.hero.titleParts.period")}
                </span>
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.5}>
            <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl text-center">
              {(() => {
                const desc = t("landing.newLanding.hero.description");
                const isTurkish = desc.includes("yarını");
                const breakWord = isTurkish ? "planla." : "tomorrow";
                const parts = isTurkish ? desc.split(breakWord) : desc.split(breakWord);
                return (
                  <>
                    {parts[0]}
                    {breakWord}
                    <br className="hidden md:block" />
                    {parts[1]}
                  </>
                );
              })()}
            </p>
          </BlurFade>

          <BlurFade delay={0.6}>
            <div className="flex flex-col items-center gap-4 mb-4">
              <Link href="/auth/signup" className="block">
                <RainbowButton>
                  <span className="relative z-10 flex items-center gap-2">
                    {t("landing.newLanding.hero.ctaMain")}{" "}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </RainbowButton>
              </Link>
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-3">
                {t("landing.newLanding.hero.ctaSecondary")}
              </p>
            </div>
          </BlurFade>

          {/* Characters illustration */}
          <div className="flex flex-col items-center relative z-10">
            <div className="flex justify-center items-start mb-2 gap-8 relative">
              {/* 1. Görsel (kadın) */}
              <div>
                <BlurFade delay={0.5}>
                  <img
                    src="/images/woman2white.png"
                    alt="Woman illustration"
                    className="h-28 w-auto object-contain dark:hidden"
                  />
                  <img
                    src="/images/woman2black.png"
                    alt="Woman illustration dark"
                    className="h-28 w-auto object-contain hidden dark:block"
                  />
                </BlurFade>
              </div>

              {/* 2. Görsel (erkek) */}
              <div className="mt-12">
                <BlurFade delay={0.7}>
                  <img
                    src="/images/man3white.png"
                    alt="Man illustration"
                    className="h-28 w-auto object-contain dark:hidden"
                  />
                  <img
                    src="/images/man3black.png"
                    alt="Man illustration dark"
                    className="h-28 w-auto object-contain hidden dark:block"
                  />
                </BlurFade>
              </div>

              {/* 3. Görsel (kadın) */}
              <div className="mt-12">
                <BlurFade delay={0.8}>
                  <img
                    src="/images/woman6white.png"
                    alt="Woman illustration"
                    className="h-28 w-auto object-contain dark:hidden"
                  />
                  <img
                    src="/images/woman6black.png"
                    alt="Woman illustration dark"
                    className="h-28 w-auto object-contain hidden dark:block"
                  />
                </BlurFade>
              </div>

              {/* 4. Görsel (erkek) */}
              <div>
                <BlurFade delay={0.9}>
                  <img
                    src="/images/man5white.png"
                    alt="Man illustration"
                    className="h-28 w-auto object-contain dark:hidden"
                  />
                  <img
                    src="/images/man5black.png"
                    alt="Man illustration dark"
                    className="h-28 w-auto object-contain hidden dark:block"
                  />
                </BlurFade>
              </div>
            </div>
          </div>
        </div>

        <BlurFade delay={0.5}>
          {/* Hero App Preview - Masaüstü ve Tablet */}
          <div className="relative max-w-5xl mx-auto -mt-12 -mb-20 z-20 hidden md:block">
            <ContainerScroll>
              <div className="relative bg-slate-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
                <div className="aspect-[16/9] relative">
                  <div className="absolute inset-0">
                    <div className="w-full h-full flex flex-col">
                      {/* Dashboard Header */}
                      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg p-2 bg-gray-900 dark:bg-gray-800 text-white w-8 h-8 flex items-center justify-center font-medium">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <path
                                d="M12 6V12L16 16"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {t("landing.newLanding.dashboard.logoText")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                            {t("landing.newLanding.dashboard.todayLabel")}
                          </div>
                          <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                            {t("landing.newLanding.dashboard.tomorrowLabel")}
                          </div>
                        </div>
                      </div>

                      {/* Dashboard Content */}
                      <div className="flex-1 overflow-hidden">
                        <div className="flex h-full">
                          {/* Time Column */}
                          <div className="w-16 border-r border-gray-200 dark:border-gray-800 py-2 flex flex-col">
                            {[9, 10, 11, 12, 13, 14, 15, 16, 17].map((hour) => (
                              <div
                                key={hour}
                                className="h-16 flex items-start justify-center text-xs text-gray-500 dark:text-gray-400"
                              >
                                {hour}:00
                              </div>
                            ))}
                          </div>

                          {/* Plans Column */}
                          <div className="flex-1 p-2 space-y-2 relative h-full overflow-hidden">
                            {/* Animated Plan 1 */}
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.0, duration: 0.4 }}
                              className="relative ml-2 pl-2 border-l-4 border-blue-500 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm"
                              style={{ marginTop: "8px" }}
                            >
                              <div className="flex justify-between items-center">
                                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                  {t("landing.newLanding.dashboard.teamMeetingTitle")}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {t("landing.newLanding.dashboard.teamMeetingTime")}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {t("landing.newLanding.dashboard.teamMeetingDescription")}
                              </div>
                            </motion.div>

                            {/* Animated Plan 2 */}
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.2, duration: 0.4 }}
                              className="relative ml-2 pl-2 border-l-4 border-green-500 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm"
                              style={{ marginTop: "72px" }}
                            >
                              <div className="flex justify-between items-center">
                                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                  {t("landing.newLanding.dashboard.focusSessionTitle")}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {t("landing.newLanding.dashboard.focusSessionTime")}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded">
                                  {t("landing.newLanding.dashboard.focusLabel")}
                                </span>
                              </div>
                            </motion.div>

                            {/* Animated Plan 3 */}
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.4, duration: 0.4 }}
                              className="relative ml-2 pl-2 border-l-4 border-amber-500 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm"
                              style={{ marginTop: "96px" }}
                            >
                              <div className="flex justify-between items-center">
                                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                  {t("landing.newLanding.dashboard.clientCallTitle")}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {t("landing.newLanding.dashboard.clientCallTime")}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs rounded">
                                  {t("landing.newLanding.dashboard.clientCallLabel1")}
                                </span>
                                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded">
                                  {t("landing.newLanding.dashboard.clientCallLabel2")}
                                </span>
                              </div>
                            </motion.div>

                            {/* Quick Plans */}
                            <motion.div
                              className="absolute right-4 top-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border border-gray-100 dark:border-gray-700 w-48"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.6, duration: 0.4 }}
                            >
                              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                {t("landing.newLanding.dashboard.quickPlansTitle")}
                              </h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 py-1.5 px-2 rounded bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                  <span className="text-xs text-gray-700 dark:text-gray-300">
                                    {t("landing.newLanding.dashboard.quickPlanMeeting")}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 py-1.5 px-2 rounded bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span className="text-xs text-gray-700 dark:text-gray-300">
                                    {t("landing.newLanding.dashboard.quickPlanFocusTime")}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 py-1.5 px-2 rounded bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                  <span className="text-xs text-gray-700 dark:text-gray-300">
                                    {t("landing.newLanding.dashboard.quickPlanFollowUp")}
                                  </span>
                                </div>
                              </div>
                            </motion.div>

                            {/* Action Button */}
                            <motion.div
                              className="absolute bottom-4 left-1/2 -ml-24"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.8, duration: 0.4 }}
                            >
                              <div className="border border-gray-400/50 dark:border-gray-400/50 border-dashed bg-transparent hover:bg-gray-400/10 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
                                <Plus size={16} className="text-gray-400 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-400 dark:text-gray-400">
                                  {t("landing.newLanding.dashboard.createPlanButton")}
                                </span>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ContainerScroll>

            {/* Floating badges */}
            <motion.div
              className="absolute top-10 right-10 z-30 cursor-pointer transition-opacity duration-500"
              initial={{ opacity: 0, rotate: -5 }}
              animate={{ opacity: 1, rotate: -5 }}
              transition={{ delay: 2.0 }}
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.3], [
                  badgeOpacity.reminder,
                  0,
                ]),
                pointerEvents: badgeOpacity.reminder === 0 ? "none" : "auto",
              }}
              onClick={() => hideBadge("reminder")}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 border-l-4 border-pink-500 hover:shadow-md transition-shadow duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-pink-500 dark:text-pink-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {t("landing.newLanding.hero.reminderBadge")}
                </span>
              </div>
            </motion.div>

            <motion.div
              className="absolute top-32 right-0 translate-x-1/4 cursor-pointer transition-opacity duration-500"
              initial={{ opacity: 0, rotate: -5 }}
              animate={{ opacity: 1, rotate: -5 }}
              transition={{ delay: 2.3 }}
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.4], [
                  badgeOpacity.plan,
                  0,
                ]),
                pointerEvents: badgeOpacity.plan === 0 ? "none" : "auto",
              }}
              onClick={() => hideBadge("plan")}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 border-l-4 border-amber-500 hover:shadow-md transition-shadow duration-200">
                <Bell className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {t("landing.newLanding.hero.planBadge")}
                </span>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-16 left-10 z-20 cursor-pointer transition-opacity duration-500"
              initial={{ opacity: 0, rotate: -3 }}
              animate={{ opacity: 1, rotate: -3 }}
              transition={{ delay: 2.6 }}
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.5], [
                  badgeOpacity.tasks,
                  0,
                ]),
                pointerEvents: badgeOpacity.tasks === 0 ? "none" : "auto",
              }}
              onClick={() => hideBadge("tasks")}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 border-l-4 border-green-500 hover:shadow-md transition-shadow duration-200">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {t("landing.newLanding.hero.tasksBadge")}
                </span>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-40 left-0 -translate-x-1/4 cursor-pointer transition-opacity duration-500"
              initial={{ opacity: 0, rotate: 4 }}
              animate={{ opacity: 1, rotate: 4 }}
              transition={{ delay: 2.9 }}
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.6], [
                  badgeOpacity.meeting,
                  0,
                ]),
                pointerEvents: badgeOpacity.meeting === 0 ? "none" : "auto",
              }}
              onClick={() => hideBadge("meeting")}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-200">
                <Plus className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {t("landing.newLanding.hero.meetingBadge")}
                </span>
              </div>
            </motion.div>
          </div>
        </BlurFade>

        {/* Mobil için Basitleştirilmiş App Preview */}
        <BlurFade delay={0.5}>
          <motion.div
            className="relative max-w-xs mx-auto mt-6 mb-4 z-20 md:hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="bg-slate-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
              {/* App Başlık */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-1.5 bg-gray-900 dark:bg-gray-800 text-white w-7 h-7 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M12 6V12L16 16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                    {t("landing.newLanding.dashboard.logoText")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                    {t("landing.newLanding.dashboard.todayLabel")}
                  </div>
                </div>
              </div>

              {/* App İçerik - Plan Örnekleri */}
              <div className="p-3 space-y-2">
                <motion.div
                  className="pl-2 border-l-4 border-blue-500 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {t("landing.newLanding.dashboard.teamMeetingTitle")}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {t("landing.newLanding.dashboard.teamMeetingTime")}
                  </div>
                </motion.div>

                <motion.div
                  className="pl-2 border-l-4 border-green-500 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 1.1 }}
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {t("landing.newLanding.dashboard.focusSessionTitle")}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {t("landing.newLanding.dashboard.focusSessionTime")}
                  </div>
                </motion.div>
              </div>

              {/* Hızlı Planlar */}
              <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t("landing.newLanding.dashboard.quickPlansTitle")}
                  </h4>
                </div>
                <div className="flex mt-2 items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 py-1 px-2 rounded-full bg-white dark:bg-gray-800 text-xs border border-gray-200 dark:border-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {t("landing.newLanding.dashboard.quickPlanMeeting")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 py-1 px-2 rounded-full bg-white dark:bg-gray-800 text-xs border border-gray-200 dark:border-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {t("landing.newLanding.dashboard.quickPlanFocusTime")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Plan Oluştur Butonu */}
              <motion.div
                className="px-3 py-3 flex justify-center"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.3 }}
              >
                <div className="border border-gray-200 dark:border-gray-700 border-dashed bg-transparent hover:bg-gray-400/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors w-full justify-center">
                  <Plus size={14} className="text-gray-400 dark:text-gray-500" />
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    {t("landing.newLanding.dashboard.createPlanButton")}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Mobil - Hatırlatıcı Etiketleri */}
            <motion.div
              className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-2 py-1 flex items-center gap-1.5 border-l-2 border-pink-500 z-30"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: -5 }}
              transition={{ duration: 0.4, delay: 1.2 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-pink-500 dark:text-pink-400"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {t("landing.newLanding.hero.reminderBadge")}
              </span>
            </motion.div>

            <motion.div
              className="absolute -bottom-2 -left-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-2 py-1 flex items-center gap-1.5 border-l-2 border-green-500 z-30"
              initial={{ opacity: 0, scale: 0.8, rotate: 4 }}
              animate={{ opacity: 1, scale: 1, rotate: 4 }}
              transition={{ duration: 0.4, delay: 1.5 }}
            >
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {t("landing.newLanding.hero.tasksBadge")}
              </span>
            </motion.div>
          </motion.div>
        </BlurFade>
      </div>
    </section>
  );
}
