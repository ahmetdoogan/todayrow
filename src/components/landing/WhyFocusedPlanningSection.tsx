"use client";

import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

// Hover efekti için sadece Mouse Tracker bileşeni
const GridMouseTracker = () => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Fare pozisyonu takibi
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };

  return (
    <div 
      ref={cardRef}
      className="w-full h-full absolute inset-0 pointer-events-auto"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ zIndex: 25 }}
    >
      {/* Light mode hover effect */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out dark:hidden"
        style={{
          background: `radial-gradient(circle 120px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.01) 30%, transparent 70%)`,
          opacity: isHovering ? 1 : 0,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Dark mode hover effect */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out hidden dark:block"
        style={{
          background: `radial-gradient(circle 120px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 30%, transparent 70%)`,
          opacity: isHovering ? 1 : 0,
          mixBlendMode: 'soft-light',
        }}
      />
    </div>
  );
};

export default function WhyFocusedPlanningSection() {
  const t = useTranslations();
  return (
    <section className="py-24 px-4 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1.5 mb-4 rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-800/80 dark:to-gray-800/60 text-orange-600 dark:text-gray-200 text-xs font-medium shadow-sm hover:shadow transition-shadow duration-300 border border-orange-200/50 dark:border-gray-700/70">
            {t("landing.newLanding.whyFocused.badge", { defaultValue: "The Science of Productivity"})}
          </div>
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white mb-4">
            {t("common.navigation.login") === "Giriş" ? (
              <>Neden <span className="instrument-serif italic text-gray-900 dark:text-white">Odaklı Planlama</span><span className="instrument-serif italic text-gray-900 dark:text-white">?</span></>
            ) : (
              <>Why <span className="instrument-serif italic text-gray-900 dark:text-white">Focused Planning</span><span className="instrument-serif italic text-gray-900 dark:text-white">?</span></>
            )}
          </h2>
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("landing.newLanding.whyFocused.description")}
          </p>
        </div>

        {/* Masonry-style grid layout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1 - Large with background image */}
          <div
            className="md:col-span-2 md:row-span-2 group relative rounded-2xl overflow-hidden min-h-[280px] border border-gray-200 dark:border-gray-700 bg-grid-pattern-light dark:bg-grid-pattern bg-[length:20px_20px] transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/70 to-white/30 dark:from-gray-900/95 dark:via-gray-900/70 dark:to-gray-900/30 z-1"></div>
            <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
              <h3 className="text-xl font-medium mb-4 text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white group-hover:-translate-y-1 transition-all duration-300">{t("landing.newLanding.whyFocused.reasons.overload.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 max-w-md group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                {t("landing.newLanding.whyFocused.reasons.overload.description")}
              </p>
              <div className="flex items-center justify-between mt-auto group-hover:-translate-y-1 transition-transform duration-300">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white text-sm font-bold transition-all duration-300 border border-gray-200 dark:border-gray-600">
                  1
                </div>
                <div className="relative">
                  <img
                    src="/images/woman1white.png"
                    alt="Woman illustration"
                    className="h-28 w-auto object-contain dark:hidden z-10 relative"
                  />
                  <img
                    src="/images/woman1black.jpg"
                    alt="Woman illustration dark"
                    className="h-28 w-auto object-contain hidden dark:block z-10 relative"
                  />
                </div>
              </div>
            </div>
            <GridMouseTracker />
          </div>

          {/* Card 2 */}
          <div
            className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 bg-grid-pattern-light dark:bg-grid-pattern bg-[length:20px_20px] relative overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/70 to-white/30 dark:from-gray-900/95 dark:via-gray-900/70 dark:to-gray-900/30"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-3 group-hover:-translate-y-1 transition-transform duration-300">
                <span className="flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white mr-3 border border-gray-200 dark:border-gray-600 group-hover:shadow group-hover:border-gray-300 dark:group-hover:border-gray-500 transition-all duration-300">
                  2
                </span>
                <span className="group-hover:text-black dark:group-hover:text-white transition-colors duration-300">{t("landing.newLanding.whyFocused.reasons.clarity.title")}</span>
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 pl-11 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                {t("landing.newLanding.whyFocused.reasons.clarity.description")}
              </p>
            </div>
            <GridMouseTracker />
          </div>

          {/* Card 3 */}
          <div
            className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 bg-grid-pattern-light dark:bg-grid-pattern bg-[length:20px_20px] relative overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/70 to-white/30 dark:from-gray-900/95 dark:via-gray-900/70 dark:to-gray-900/30"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-3 group-hover:-translate-y-1 transition-transform duration-300">
                <span className="flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white mr-3 border border-gray-200 dark:border-gray-600 group-hover:shadow group-hover:border-gray-300 dark:group-hover:border-gray-500 transition-all duration-300">
                  3
                </span>
                <span className="group-hover:text-black dark:group-hover:text-white transition-colors duration-300">{t("landing.newLanding.whyFocused.reasons.success.title")}</span>
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 pl-11 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                {t("landing.newLanding.whyFocused.reasons.success.description")}
              </p>
            </div>
            <GridMouseTracker />
          </div>

          {/* Card 4 */}
          <div
            className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 bg-grid-pattern-light dark:bg-grid-pattern bg-[length:20px_20px] relative overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/70 to-white/30 dark:from-gray-900/95 dark:via-gray-900/70 dark:to-gray-900/30"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-3 group-hover:-translate-y-1 transition-transform duration-300">
                <span className="flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white mr-3 border border-gray-200 dark:border-gray-600 group-hover:shadow group-hover:border-gray-300 dark:group-hover:border-gray-500 transition-all duration-300">
                  4
                </span>
                <span className="group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                  {t("common.navigation.login") === "Giriş" ? "Üretkenliği Artırın" : "Enhance Productivity"}
                </span>
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 pl-11 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                {t("common.navigation.login") === "Giriş" ? 
                  "Daha kısa bir zaman diliminde odaklanarak, daha anlamlı görevleri tamamlayacaksınız. Araştırmalar, odağınızı daraltmanın daha kaliteli iş ve genel üretkenlikte artış sağladığını gösteriyor." : 
                  "By concentrating on a shorter timeframe, you'll complete more meaningful tasks. Studies show that narrowing your focus leads to higher quality work and greater overall productivity."}
              </p>
            </div>
            <GridMouseTracker />
          </div>

          {/* Card 5 */}
          <div
            className="md:col-span-2 group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 bg-grid-pattern-light dark:bg-grid-pattern bg-[length:20px_20px] relative overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/70 to-white/30 dark:from-gray-900/95 dark:via-gray-900/70 dark:to-gray-900/30"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-3 group-hover:-translate-y-1 transition-transform duration-300">
                <span className="flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white mr-3 border border-gray-200 dark:border-gray-600 group-hover:shadow group-hover:border-gray-300 dark:group-hover:border-gray-500 transition-all duration-300">
                  5
                </span>
                <span className="group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                  {t("common.navigation.login") === "Giriş" ? "Kaygı ve Stresi Azaltın" : "Reduce Anxiety & Stress"}
                </span>
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 pl-11 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                {t("common.navigation.login") === "Giriş" ? 
                  "Uzun vadeli planlama genellikle değişebilecek gelecekteki olaylarla ilgili gereksiz stres yaratır. Sadece bugüne ve yarına odaklandığınızda, anlık öncelikleriniz üzerindeki kontrolü kaybetmeden kaygıyı azaltırsınız. Bu dengeli yaklaşım, üretkenliğinizi korurken daha iyi bir ruh sağlığını destekler." : 
                  "Long-term planning often creates unnecessary stress about future events that may change. When you focus just on today and tomorrow, you reduce anxiety while still maintaining control over your immediate priorities. This balanced approach promotes better mental health while keeping you productive."}
              </p>
            </div>
            <GridMouseTracker />
          </div>
        </motion.div>
      </div>
    </section>
  );
}