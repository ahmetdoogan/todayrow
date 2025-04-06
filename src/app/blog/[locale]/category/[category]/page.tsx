"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import NavBar from "@/components/landing/NavBar";
import FooterSection from "@/components/landing/FooterSection";
import { Inter } from "next/font/google";
import BlogSidebar from "@/components/blog/BlogSidebar";
import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";
import { motion } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import BlogCardSkeleton from "@/components/ui/skeletons/BlogCardSkeleton";
import BlogSidebarSkeleton from "@/components/ui/skeletons/BlogSidebarSkeleton";

// Globals.css dosyası ile Instrument Serif font yükleniyor, ancak
// client tarafında garantilemek için ekstra import ekliyoruz
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function CategoryPage({
  params,
}: {
  params: { locale: string; category: string };
}) {
  const { locale, category } = params;
  const t = useTranslations();
  const { theme } = useTheme();

  // Blog verilerini tutan state
  const [posts, setPosts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<{key: string; label: string}[]>([]);
  const [loading, setLoading] = React.useState(true);

  // İngilizce - Türkçe slug eşleştirmeleri
  const slugTranslations = {
    'effective-daily-planning-routines': 'etkili-gunluk-planlama-rutinleri',
    'focus-techniques-for-productivity': 'uretkenlik-icin-odaklanma-teknikleri',
    'note-taking-strategies-for-success': 'basari-icin-not-alma-stratejileri',
    'minimalist-planning-approach': 'minimalist-planlama-yaklasimi',
    'time-blocking-productivity-technique': 'zaman-bloklama-uretkenlik-teknigi',
    'productivity-enhancing-morning-routines': 'uretkenliginizi-arttiracak-sabah-rutinleri'
  };
  
  // Türkçe - İngilizce yönünde eşleştirme yapılacak fonksiyon
  const getEnglishSlug = (trSlug: string) => {
    for (const [enSlug, translatedSlug] of Object.entries(slugTranslations)) {
      if (translatedSlug === trSlug) {
        return enSlug;
      }
    }
    return trSlug; // Eşleşme bulunamazsa orijinal slug'ı döndür
  };
  
  // Görsel yükleme fonksiyonu - ilgili blog için doğru görseli döndürür
  const getBlogImage = (slug: string, isDark = false) => {
    const englishSlug = locale === 'en' ? slug : getEnglishSlug(slug);
    
    const imageMap: Record<string, { light: string, dark: string }> = {
      'effective-daily-planning-routines': {
        light: '/images/Effective_Daily_Planning_Routines.jpg',
        dark: '/images/Effective_Daily_Planning_Routines_dark.jpg',
      },
      'focus-techniques-for-productivity': {
        light: '/images/5_Focus_Techniques_for_Deep_Work.jpg',
        dark: '/images/5_Focus_Techniques_for_Deep_Work_dark.jpg',
      },
      'note-taking-strategies-for-success': {
        light: '/images/Note_Taking_Strategies.jpg',
        dark: '/images/Note_Taking_Strategies_dark.jpg',
      },
      'minimalist-planning-approach': {
        light: '/images/Minimalist_Planning_Approach.jpg',
        dark: '/images/Minimalist_Planning_Approach_dark.jpg',
      },
      'time-blocking-productivity-technique': {
        light: '/images/5_Focus_Techniques_for_Deep_Work.jpg',
        dark: '/images/5_Focus_Techniques_for_Deep_Work_dark.jpg',
      },
      'productivity-enhancing-morning-routines': {
        light: '/images/Effective_Daily_Planning_Routines.jpg',
        dark: '/images/Effective_Daily_Planning_Routines_dark.jpg',
      }
    };
    
    if (imageMap[englishSlug]) {
      return isDark ? imageMap[englishSlug].dark : imageMap[englishSlug].light;
    }
    
    return null; // Eğer görsel yoksa null döndür
  };

  React.useEffect(() => {
    // Tüm yazıları ya da ilgili yazıları /api/blog/posts?locale=XX'den çekip
    // kategoriye göre filtreleyebilirsiniz
    async function fetchCategoryData() {
      try {
        // Kategoriye özel endpoint kullanarak veri al
        const res = await fetch(`/api/blog/category?locale=${locale}&category=${category}`);
        const categoryPosts = await res.json();
        setPosts(categoryPosts);
        
        // Tüm blog yazılarını getir (kategoriler için)
        const allPostsRes = await fetch(`/api/blog/posts?locale=${locale}`);
        const allPosts = await allPostsRes.json();

        // Kategori listesini bulalım
        const catSet = new Set<string>();
        for (const post of allPosts) {
          if (Array.isArray(post.categories)) {
            post.categories.forEach((c: string) => catSet.add(c));
          }
        }
        // Haritalama
        const catArray = Array.from(catSet);
        const mappedCategories = catArray.map((key) => ({
          key,
          label: t(`blog.categories.${key}`, { default: key }),
        }));
        setCategories(mappedCategories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryData();
  }, [locale, category, t]);

  if (loading) {
    return (
      <div className={`min-h-screen bg-white dark:bg-[#111111] ${inter.variable} font-sans`}>
        <NavBar />

        {/* Breadcrumbs Skeleton */}
        <div className="bg-gray-50 dark:bg-[#191919] py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center">
              <div className="h-3 w-16 bg-gray-200 dark:bg-[#222222] rounded"></div>
              <div className="mx-2 h-3 w-3 bg-gray-200 dark:bg-[#222222] rounded"></div>
              <div className="h-3 w-16 bg-gray-200 dark:bg-[#222222] rounded"></div>
              <div className="mx-2 h-3 w-3 bg-gray-200 dark:bg-[#222222] rounded"></div>
              <div className="h-3 w-24 bg-gray-200 dark:bg-[#222222] rounded"></div>
            </div>
          </div>
        </div>

        {/* Hero Section Skeleton */}
        <section className="pt-20 pb-12 px-4 bg-white dark:bg-[#111111] relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center mb-6">
                <div className="h-4 w-4 bg-gray-200 dark:bg-[#222222] rounded-full mr-2"></div>
                <div className="h-3 w-32 bg-gray-200 dark:bg-[#222222] rounded"></div>
              </div>
              
              {/* Skeleton başlık */}
              <div className="h-10 w-64 md:w-80 bg-gray-200 dark:bg-[#222222] rounded mb-4 mx-auto"></div>
              
              {/* Skeleton alt açıklama */}
              <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded mb-2 max-w-2xl mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded max-w-xl mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Blog Content Skeleton */}
        <section className="py-12 px-4 bg-white dark:bg-[#111111] relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 relative">
            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="grid md:grid-cols-2 gap-8">
                {Array(4).fill(0).map((_, index) => (
                  <div key={index}>
                    <BlogCardSkeleton />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/4">
              <BlogSidebarSkeleton />
            </div>
          </div>
        </section>

        <FooterSection />
      </div>
    );
  }

  // Seçili kategori adı
  const categoryName = t(`blog.categories.${category}`, { default: category });

  // Tarih format fonksiyonu
  const dateLocale = t("common.locales.dateFormat", { default: "en-US" });
  function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat(dateLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateStr));
  }

  return (
    <div
      className={`min-h-screen bg-white dark:bg-[#111111] ${inter.variable} font-sans`}
    >
      <NavBar />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 dark:bg-[#191919] py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link
              href="/"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t("blog.detail.breadcrumbs.home", { default: "Home" })}
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <Link
              href={`/blog/${locale}`}
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t("blog.detail.breadcrumbs.blog", { default: "Blog" })}
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-900 dark:text-white">{categoryName}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 bg-white dark:bg-[#111111] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <BlurFade delay={0.1}>
              <Link
                href={`/blog/${locale}`}
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm mb-6 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                {t("blog.detail.backToArticles", { default: "Back to Articles" })}
              </Link>
            </BlurFade>
            <BlurFade delay={0.2}>
              <h1 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-4">
                {categoryName}{" "}
                <span 
                  className="italic" 
                  style={{ 
                    fontFamily: "'Instrument Serif', serif", 
                    fontWeight: 400
                  }}
                >
                  {t("blog.categories.category", {
                    category: "",
                    default: "Articles"
                  }).replace(categoryName, "").trim()}
                </span>
              </h1>
            </BlurFade>
            
            <style jsx global>{`
              @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
            `}</style>
            <BlurFade delay={0.3}>
              <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t("blog.categories.description", {
                  category: categoryName,
                  default: "",
                })}
              </p>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 px-4 bg-white dark:bg-[#111111] relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 relative">
          {/* Main Content */}
          <div className="lg:w-3/4">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 dark:text-gray-400">
                  {t("blog.categories.noArticles", { default: "No articles found." })}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {posts.map((post: any, index: number) => (
                  <BlurFade key={post.slug} delay={0.1 + (index * 0.1)} yOffset={10}>
                    <div
                    className="bg-gray-50 dark:bg-[#191919] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {/* Blog görseli varsa göster */}
                        {getBlogImage(post.slug, theme === 'dark') ? (
                          <Image 
                            src={getBlogImage(post.slug, theme === 'dark') || ''}
                            alt={post.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 text-xs">
                              {t("blog.common.todayrowBlog", {
                                default: "Todayrow Blog",
                              })}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {formatDate(post.date)}
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
                          {post.excerpt}
                        </p>
                        <Link
                          href={`/blog/${locale}/post/${post.slug}`}
                          className="inline-flex items-center text-gray-900 dark:text-gray-300 text-sm font-medium hover:text-gray-700 dark:hover:text-white hover:underline transition-colors duration-300"
                        >
                          {t("blog.common.readFullArticle", {
                            default: "Read full article",
                          })}
                          <ArrowRight
                            size={16}
                            className="ml-1 group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </Link>
                      </div>
                    </div>
                  </BlurFade>
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-1/4">
            <BlogSidebar
              categories={categories}
              selectedCategory={category}
              t={t}
            />
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}