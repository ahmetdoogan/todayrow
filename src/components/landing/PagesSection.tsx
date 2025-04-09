"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Calendar, Clock, FileText, Folder, PointerIcon } from "lucide-react";

export default function PagesSection() {
  const t = useTranslations();

  // Kart veri seti
  const allCards = [
    {
      id: "planning",
      title: t("landing.newLanding.pages.planning.title"),
      description: t("landing.newLanding.pages.planning.description"),
      icon: <Calendar className="w-5 h-5" />,
      features: [
        {
          id: 1,
          title: t("landing.newLanding.pages.planning.features.feature1.title"),
          description: t("landing.newLanding.pages.planning.features.feature1.description"),
        },
        {
          id: 2,
          title: t("landing.newLanding.pages.planning.features.feature2.title"),
          description: t("landing.newLanding.pages.planning.features.feature2.description"),
        },
        {
          id: 3,
          title: t("landing.newLanding.pages.planning.features.feature3.title"),
          description: t("landing.newLanding.pages.planning.features.feature3.description"),
        },
      ],
      placeholder: {
        title: t("landing.newLanding.pages.planning.placeholder.title"),
        description: t("landing.newLanding.pages.planning.placeholder.description"),
      },
    },
    {
      id: "focus",
      title: t("landing.newLanding.pages.focus.title"),
      description: t("landing.newLanding.pages.focus.description"),
      icon: <Clock className="w-5 h-5" />,
      features: [
        {
          id: 1,
          title: t("landing.newLanding.pages.focus.features.feature1.title"),
          description: t("landing.newLanding.pages.focus.features.feature1.description"),
        },
        {
          id: 2,
          title: t("landing.newLanding.pages.focus.features.feature2.title"),
          description: t("landing.newLanding.pages.focus.features.feature2.description"),
        },
        {
          id: 3,
          title: t("landing.newLanding.pages.focus.features.feature3.title"),
          description: t("landing.newLanding.pages.focus.features.feature3.description"),
        },
      ],
      placeholder: {
        title: t("landing.newLanding.pages.focus.placeholder.title"),
        description: t("landing.newLanding.pages.focus.placeholder.description"),
      },
    },
    {
      id: "notes",
      title: t("landing.newLanding.pages.notes.title"),
      description: t("landing.newLanding.pages.notes.description"),
      icon: <FileText className="w-5 h-5" />,
      features: [
        {
          id: 1,
          title: t("landing.newLanding.pages.notes.features.feature1.title"),
          description: t("landing.newLanding.pages.notes.features.feature1.description"),
        },
        {
          id: 2,
          title: t("landing.newLanding.pages.notes.features.feature2.title"),
          description: t("landing.newLanding.pages.notes.features.feature2.description"),
        },
        {
          id: 3,
          title: t("landing.newLanding.pages.notes.features.feature3.title"),
          description: t("landing.newLanding.pages.notes.features.feature3.description"),
        },
      ],
      placeholder: {
        title: t("landing.newLanding.pages.notes.placeholder.title"),
        description: t("landing.newLanding.pages.notes.placeholder.description"),
      },
    },
    {
      id: "contents",
      title: t("landing.newLanding.pages.contents.title"),
      description: t("landing.newLanding.pages.contents.description"),
      icon: <Folder className="w-5 h-5" />,
      features: [
        {
          id: 1,
          title: t("landing.newLanding.pages.contents.features.feature1.title"),
          description: t("landing.newLanding.pages.contents.features.feature1.description"),
        },
        {
          id: 2,
          title: t("landing.newLanding.pages.contents.features.feature2.title"),
          description: t("landing.newLanding.pages.contents.features.feature2.description"),
        },
        {
          id: 3,
          title: t("landing.newLanding.pages.contents.features.feature3.title"),
          description: t("landing.newLanding.pages.contents.features.feature3.description"),
        },
      ],
      placeholder: {
        title: t("landing.newLanding.pages.contents.placeholder.title"),
        description: t("landing.newLanding.pages.contents.placeholder.description"),
      },
    },
  ];

  // Kartları sıralıyoruz (en sondaki = en üstte)
  const [cardsOrder, setCardsOrder] = useState<string[]>(() =>
    ["contents", "notes", "focus", "planning"]
  );

  // Tıklanan kartı en üste getir
  const bringCardToFront = (clickedId: string) => {
    setCardsOrder((prevOrder) => {
      const newOrder = prevOrder.filter((id) => id !== clickedId);
      newOrder.push(clickedId);
      return newOrder;
    });
  };

  // index'e göre top/scale/zIndex
  const getCardStyle = (index: number, total: number) => {
    // Dikey boşluğu azalttık, kartlar daha üst üste görünsün
    const offset = 50; 
    // Ekstra ofset - başlıklar hover olmadan da görünsün
    const extraOffset = 15; 
    const topPos = (offset * index) - extraOffset;
    const zPos = 10 + index;
    //  en alt => scale 0.85, en üst => 1.0
    const ratio = total > 1 ? index / (total - 1) : 1;
    const scaleVal = 0.85 + (1 - 0.85) * ratio;
    
    // Perspektif için genişlik daraltımını ayarla (2. ekrandaki gibi)
    // En üstteki kartın genişliği %100, en arkadakinin genişliği %90 gibi
    const widthRatio = isNaN(ratio) ? 1 : Math.max(0.85, 1 - ((1 - ratio) * 0.1));

    return {
      top: topPos,
      scale: scaleVal,
      zIndex: zPos,
      width: `${widthRatio * 100}%`, // Perspektif için arkadakileri daralt
      // Sağdan ve soldan eşit olacak şekilde kenar boşlukları hesaplayıp ortalama yapar
      marginLeft: `${(1 - widthRatio) * 50}%`,
      marginRight: `${(1 - widthRatio) * 50}%`,
    };
  };

  return (
    <section className="relative z-10 py-10 px-4 bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Üst başlık */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1.5 mb-4 rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-800/80 dark:to-gray-800/60 text-orange-600 dark:text-gray-200 text-xs font-medium shadow-sm hover:shadow transition-shadow duration-300 border border-orange-200/50 dark:border-gray-700/70"
          >
            {t("landing.newLanding.pages.badge")}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white mb-4"
          >
            {t("common.navigation.login") === "Giriş" ? (
              <>
                <span className="text-gray-900 dark:text-white">{t("landing.newLanding.pages.titlePrefix")}</span>{" "}
                <span className="instrument-serif italic text-gray-900 dark:text-white">
                  {t("landing.newLanding.pages.titleSuffix")}
                </span>
              </>
            ) : (
              <>
                <span className="text-gray-900 dark:text-white">{t("landing.newLanding.pages.titlePrefix")}</span>{" "}
                <span className="instrument-serif italic text-gray-900 dark:text-white">
                  {t("landing.newLanding.pages.titleSuffix")}
                </span>
              </>
            )}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-sm md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            {t("landing.newLanding.pages.subtitle")}
          </motion.p>
        </motion.div>

        {/* Stacked kart container */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative w-full mx-auto" 
          style={{ height: 850 }}
        >
          {cardsOrder.map((cardId, index) => {
            const cardData = allCards.find((c) => c.id === cardId);
            if (!cardData) return null;

            const { id, title, description, icon, features, placeholder } = cardData;
            const total = cardsOrder.length;
            const style = getCardStyle(index, total);
            // En sondaki => en üstte
            const isTopCard = index === total - 1;
            
            // Arka kartlar daha soluk görünsün
            // En arkadaki daha fazla soluk, öne doğru daha net
            const opacityValues = [0.5, 0.65, 0.8, 1.0]; // En arkadan öne doğru
            const cardPositionIndex = cardsOrder.indexOf(id);
            const cardOpacity = opacityValues[cardPositionIndex];

            return (
                <motion.div key={id}
                className="absolute left-0 right-0
                           rounded-2xl shadow overflow-hidden
                           border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800"
                initial={{ 
                  opacity: 0, 
                  y: 50, 
                  top: style.top,
                  scale: style.scale,
                  zIndex: style.zIndex,
                  width: style.width,
                  marginLeft: style.marginLeft,
                  marginRight: style.marginRight
                }}
                animate={{
                  opacity: cardOpacity,
                  y: 0,
                  top: style.top,
                  scale: style.scale,
                  zIndex: style.zIndex,
                  width: style.width,
                  marginLeft: style.marginLeft,
                  marginRight: style.marginRight
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  delay: 0.1 * index // Her bir kart için kademeli olarak gecikme ekle
                }}
                whileHover={
                  !isTopCard
                    ? { top: style.top - 12, transition: { duration: 0.2 } }
                    : {}
                }
                style={{ cursor: isTopCard ? "default" : "pointer" }}
                onClick={() => {
                  if (!isTopCard) {
                    bringCardToFront(id);
                  }
                }}
              >
                {/* Kart Üst Bar */}
                <div
                  className={`py-3 border-b border-gray-200 dark:border-gray-700 shadow-sm
                    ${isTopCard ? "" : "bg-gray-50 dark:bg-gray-700"}`}
                  style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
                >
                  <div className="flex items-center justify-between pl-4 py-0.5">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {title}
                    </span>
                    {!isTopCard && (
                      <div className="flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="18" 
                          height="18" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="opacity-70 hover:opacity-100 transition-opacity"
                        >
                          <path d="m9 9 5 12 1.8-5.2L21 14Z"/>
                          <path d="M7.2 2.2 8 5.1"/>
                          <path d="m5.1 8-2.9-.8"/>
                          <path d="M14 4.1 12 6.2"/>
                          <path d="m6.2 12-2.1 2"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tüm kartlar (arka/ön) içeriğini göstersin */}
                <div className="pt-8 pl-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
                    {/* Sol: metin & features */}
                    <div className="flex flex-col space-y-6 pl-4">
                      <div>
                        <motion.h3 
                          className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-3 md:mb-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: isTopCard ? 1 : 0.8, x: 0 }}
                          transition={{ duration: 0.4, delay: isTopCard ? 0.2 : 0 }}
                        >
                          {t(`landing.newLanding.pages.${id}.innerTitle`)}
                        </motion.h3>
                        <motion.p 
                          className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-4 md:mb-6"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: isTopCard ? 1 : 0.8, x: 0 }}
                          transition={{ duration: 0.4, delay: isTopCard ? 0.3 : 0 }}
                        >
                          {t(`landing.newLanding.pages.${id}.featuresText`)}
                        </motion.p>
                        {/* Kart İllüstrasyonu */}
                        <motion.div 
                          className="mt-4"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: isTopCard ? 1 : 0.8, scale: 1 }}
                          transition={{ duration: 0.5, delay: isTopCard ? 0.4 : 0 }}
                        >
                          {id === "planning" && (
                            <>
                              <img 
                                src="/images/boy_plans_light.png"
                                alt="Plans illustration"
                                className="w-1/2 md:w-3/5 lg:w-3/5 h-auto object-contain mx-auto md:ml-0 md:-ml-2 dark:hidden"
                              />
                              <img 
                                src="/images/boy_plans_dark.png"
                                alt="Plans illustration dark"
                                className="w-1/2 md:w-3/5 lg:w-3/5 h-auto object-contain mx-auto md:ml-0 md:-ml-2 hidden dark:block"
                              />
                            </>
                          )}
                          {id === "focus" && (
                            <>
                              <img 
                                src="/images/boy_focus_light.png"
                                alt="Focus illustration"
                                className="w-1/2 md:w-3/5 lg:w-3/5 h-auto object-contain mx-auto md:ml-0 md:-ml-2 dark:hidden"
                              />
                              <img 
                                src="/images/boy_focus_dark.png"
                                alt="Focus illustration dark"
                                className="w-1/2 md:w-3/5 lg:w-3/5 h-auto object-contain mx-auto md:ml-0 md:-ml-2 hidden dark:block"
                              />
                            </>
                          )}
                          {id === "notes" && (
                            <>
                              <img 
                                src="/images/boy_notes_light.png"
                                alt="Notes illustration"
                                className="w-1/2 md:w-3/5 lg:w-3/5 h-auto object-contain mx-auto md:ml-0 md:-ml-2 dark:hidden"
                              />
                              <img 
                                src="/images/boy_notes_dark.png"
                                alt="Notes illustration dark"
                                className="w-1/2 md:w-3/5 lg:w-3/5 h-auto object-contain mx-auto md:ml-0 md:-ml-2 hidden dark:block"
                              />
                            </>
                          )}
                          {id === "contents" && (
                            <>
                              <img 
                                src="/images/boy_contents_light.png"
                                alt="Contents illustration"
                                className="w-1/2 md:w-3/5 lg:w-3/5 h-auto object-contain mx-auto md:ml-0 md:-ml-2 dark:hidden"
                              />
                              <img 
                                src="/images/boy_contents_dark.png"
                                alt="Contents illustration dark"
                                className="w-1/2 md:w-3/5 lg:w-3/5 h-auto object-contain mx-auto md:ml-0 md:-ml-2 hidden dark:block"
                              />
                            </>
                          )}
                        </motion.div>
                      </div>
                    </div>

                    {/* Sağ: UI Placeholder */}
                    <motion.div 
                      className="mt-6 lg:mt-0 relative"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: isTopCard ? 1 : 0.8, x: 0 }}
                      transition={{ duration: 0.4, delay: isTopCard ? 0.3 : 0 }}
                    >
                      <div
                        className="rounded-tl-lg overflow-hidden 
                                  bg-white dark:bg-gray-800 
                                  shadow-[-2px_-2px_8px_rgba(0,0,0,0.05)]
                                  border-l border-t border-gray-200 dark:border-gray-700"
                        style={{
                          borderBottomRightRadius: 0,
                          borderTopRightRadius: 0,
                          borderBottomLeftRadius: 0
                        }}
                      >
                        {/* Tarayıcı Çubuğu */}
                        <div
                          className="bg-stone-50 dark:bg-gray-700 px-4 py-2 flex items-center
                                 border-b border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex space-x-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                          </div>
                          <div className="mx-auto text-xs text-gray-500 dark:text-gray-400">
                            {t("landing.newLanding.pages.domainName")}
                          </div>
                        </div>
                        
                        {/* Görsel Alanı - Mobil için kare şeklinde küçültüldü */}
                        <motion.div 
                          className="h-[280px] w-full md:h-[400px] lg:h-[500px] bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isTopCard ? 1 : 0.8 }}
                          transition={{ duration: 0.6, delay: isTopCard ? 0.4 : 0 }}
                        >
                          {id === "planning" ? (
                            <img 
                              src="/images/todayrow_plans.jpg" 
                              alt="Todayrow Plans Interface" 
                              className="w-full h-full object-cover"
                            />
                          ) : id === "focus" ? (
                            <img 
                              src="/images/todayrow_focus.jpg" 
                              alt="Todayrow Focus Interface" 
                              className="w-full h-full object-cover"
                            />
                          ) : id === "notes" ? (
                            <img 
                              src="/images/todayrow_notes.jpg" 
                              alt="Todayrow Notes Interface" 
                              className="w-full h-full object-cover"
                            />
                          ) : id === "contents" ? (
                            <img 
                              src="/images/todayrow_contents.jpg" 
                              alt="Todayrow Contents Interface" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center px-4">
                              <div
                                className="w-16 h-16 mx-auto rounded-full
                                         border border-gray-200 dark:border-gray-700
                                         bg-gray-100 dark:bg-gray-700
                                         flex items-center justify-center
                                         text-gray-700 dark:text-gray-300 mb-4"
                              >
                                <span className="text-xl">{id.charAt(0).toUpperCase()}</span>
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                {placeholder.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {placeholder.description}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                    {/* Sağ blok sonu */}
                  </div>
                </div>
                {/* İçerik sonu */}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
