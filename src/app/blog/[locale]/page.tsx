"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NavBar from "@/components/landing/NavBar";
import FooterSection from "@/components/landing/FooterSection";
import { Inter } from "next/font/google";
import BlogSidebar from "@/components/blog/BlogSidebar";
import Head from "next/head";

// En başta fontları yüklüyoruz
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Bu component "client" tarafta çalışıyor
// Artık fs fonksiyonlarını doğrudan kullanmıyoruz
export default function BlogLocalePage({ params }: { params: { locale: string } }) {
  const t = useTranslations();
  const locale = params.locale || "en";

  // Blog verilerini tutan state
  const [blogPosts, setBlogPosts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        // Blog yazılarını API'den çek
        // (posts => tüm yazılar listesi endpoint'i)
        const res = await fetch(`/api/blog/posts?locale=${locale}`);
        if (!res.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const postsData = await res.json();

        // Yazıları state'e koy
        setBlogPosts(postsData);

        // Gönderilen her yazının "categories" alanından kategorileri toplayalım
        const catSet = new Set<string>();
        for (const post of postsData) {
          if (Array.isArray(post.categories)) {
            post.categories.forEach((c: string) => catSet.add(c));
          }
        }
        // Set'i array'e çevirelim
        const catArray = Array.from(catSet);

        // Kategori çevirilerini "blog.categories.xyz" key’leri ile yap
        const mappedCategories = catArray.map((key: string) => {
          // blog.categories.XXX
          return {
            key,
            label: t(`blog.categories.${key}`, { default: key }) // eğer çeviri yoksa key'i göster
          };
        });

        setCategories(mappedCategories);
      } catch (err) {
        console.error("Error fetching blog data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [locale, t]);

  // Tarih formatı için dil kodu
  const dateLocale = t("common.locales.dateFormat");
  
  // Tarih formatlama fonksiyonu
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(dateLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateStr));
  };

  // Yüklenme aşaması
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t("common.loading")}
          </p>
        </div>
      </div>
    );
  }

  // Blog yazısı yoksa
  if (!blogPosts || blogPosts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t("blog.noPosts") || "No blog posts found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-950 ${inter.variable} font-sans`}>
      {/* Grain effect overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-10"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')",
        }}
      ></div>

      {/* Background elements - gradient removed for clean dark mode */}
      <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden">
      </div>

      <NavBar />

      {/* Hero Section */}
      <section className="pt-32 px-4 bg-white dark:bg-gray-950 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white mb-4">
              <span>Todayrow</span>{" "}
              <span 
                className="italic" 
                style={{ 
                  fontFamily: "'Instrument Serif', serif", 
                  fontWeight: 400,
                  fontSize: '48px'
                }}
              >
                Blog
              </span>
            </h1>
            
            {/* Font yükleme */}
            <style jsx global>{`
              @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
            `}</style>
            <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("blog.page.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 relative">
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <div
                  key={post.slug}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                    {/* Placeholder görseli */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 text-xs">
                      {t("blog.common.todayrowBlog")}
                    </div>
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
                      {t("blog.common.readFullArticle")}{" "}
                      <ArrowRight
                        size={16}
                        className="ml-1 group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <BlogSidebar categories={categories} t={t} />
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
