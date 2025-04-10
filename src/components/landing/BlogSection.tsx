"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function BlogSection() {
  const t = useTranslations();
  const locale = useLocale() as string; // Mevcut dili alalım
  const { theme } = useTheme();
  
  // Blog yazıları ve çevirileri için sabitleri manuel olarak tanımlayalım
  const slugTranslations = {
    'effective-daily-planning-routines': 'etkili-gunluk-planlama-rutinleri',
    'focus-techniques-for-productivity': 'uretkenlik-icin-odaklanma-teknikleri',
    'note-taking-strategies-for-success': 'basari-icin-not-alma-stratejileri',
    'minimalist-planning-approach': 'minimalist-planlama-yaklasimi'
  };
  
  // İngilizce slug'ı almak için ters eşleştirme fonksiyonu
  const getEnglishSlug = (trSlug: string) => {
    for (const [enSlug, translatedSlug] of Object.entries(slugTranslations)) {
      if (translatedSlug === trSlug) {
        return enSlug;
      }
    }
    return trSlug; // Eşleşme bulunamazsa orijinal slug'ı döndür
  };
  
  // Blog yazıları için statik veriler
  const blogPosts = [
    {
      title: t("landing.newLanding.blog.posts.post1.title"),
      excerpt: t("landing.newLanding.blog.posts.post1.excerpt"),
      image: "/blog-placeholder-1.jpg",
      slug: locale === 'en' ? 'effective-daily-planning-routines' : slugTranslations['effective-daily-planning-routines']
    },
    {
      title: t("landing.newLanding.blog.posts.post2.title"),
      excerpt: t("landing.newLanding.blog.posts.post2.excerpt"),
      image: "/blog-placeholder-2.jpg",
      slug: locale === 'en' ? 'focus-techniques-for-productivity' : slugTranslations['focus-techniques-for-productivity']
    },
    {
      title: t("landing.newLanding.blog.posts.post3.title"),
      excerpt: t("landing.newLanding.blog.posts.post3.excerpt"),
      image: "/blog-placeholder-3.jpg",
      slug: locale === 'en' ? 'note-taking-strategies-for-success' : slugTranslations['note-taking-strategies-for-success']
    },
    {
      title: t("landing.newLanding.blog.posts.post4.title"),
      excerpt: t("landing.newLanding.blog.posts.post4.excerpt"),
      image: "/blog-placeholder-4.jpg",
      slug: locale === 'en' ? 'minimalist-planning-approach' : slugTranslations['minimalist-planning-approach']
    }
  ];

  return (
    <section id="blog" className="pt-20 pb-16 px-4 bg-white dark:bg-black relative z-10 overflow-hidden">
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-12">
      <div className="inline-block px-3 py-1.5 mb-4 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800/80 dark:to-gray-800/60 text-gray-600 dark:text-gray-200 text-xs font-medium shadow-sm hover:shadow transition-shadow duration-300 border border-gray-200/50 dark:border-gray-700/70">
        {t("landing.newLanding.blog.badge")}
      </div>
      <h2 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white mb-4">
        {t("landing.newLanding.blog.titleParts.insights")}{" "}
        <span className="instrument-serif italic text-gray-900 dark:text-white">
          {t("landing.newLanding.blog.titleParts.and")}{" "}
        </span>
        {t("landing.newLanding.blog.titleParts.tips")}
      </h2>
      <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        {t("landing.newLanding.blog.subtitle")}
      </p>
    </div>

    {/* Blog Yazıları */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
      {blogPosts.map((post, index) => (
        <motion.div
          key={post.slug}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group w-full max-w-[90%] md:max-w-full mx-auto"
        >
          <Link href={`/blog/${locale}/post/${post.slug}`}>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-3 border border-gray-300 dark:border-gray-700">
              {/* Görsel */}
              {getEnglishSlug(post.slug) === 'effective-daily-planning-routines' && (
                <Image 
                  src={theme === 'dark'
                    ? "/images/Effective_Daily_Planning_Routines_dark.jpg"
                    : "/images/Effective_Daily_Planning_Routines.jpg"} 
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              )}
              {getEnglishSlug(post.slug) === 'focus-techniques-for-productivity' && (
                <Image 
                  src={theme === 'dark'
                    ? "/images/5_Focus_Techniques_for_Deep_Work_dark.jpg"
                    : "/images/5_Focus_Techniques_for_Deep_Work.jpg"} 
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              )}
              {getEnglishSlug(post.slug) === 'note-taking-strategies-for-success' && (
                <Image 
                  src={theme === 'dark'
                    ? "/images/Note_Taking_Strategies_dark.jpg"
                    : "/images/Note_Taking_Strategies.jpg"} 
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              )}
              {getEnglishSlug(post.slug) === 'minimalist-planning-approach' && (
                <Image 
                  src={theme === 'dark'
                    ? "/images/Minimalist_Planning_Approach_dark.jpg"
                    : "/images/Minimalist_Planning_Approach.jpg"} 
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <h3 className="text-[17px] md:text-base font-normal text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors duration-300">
              {post.title}
            </h3>
          </Link>
        </motion.div>
      ))}
    </div>

    <div className="text-center">
      <Link
        href={`/blog/${locale}`}
        className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
      >
        {t("landing.newLanding.blog.viewAllButton")}{" "}
        <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
      </Link>
    </div>
  </div>
</section>
  );
}