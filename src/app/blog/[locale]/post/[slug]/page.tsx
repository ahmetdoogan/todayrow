"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import NavBar from "@/components/landing/NavBar";
import FooterSection from "@/components/landing/FooterSection";
import { Inter } from "next/font/google";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";

// Font imports
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function BlogPostPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params?.locale as string || "en";
  const slug = params?.slug as string;
  const { theme } = useTheme();
  
  const [post, setPost] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [translatedSlug, setTranslatedSlug] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    async function loadData() {
      try {
        // API'den blog yazısını al
        const response = await fetch(`/api/blog/post?locale=${locale}&slug=${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setPost(null);
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch blog post');
        }
        
        const postData = await response.json();
        setPost(postData);
        
        // Karşı dildeki slug'ı al
        const otherLocale = locale === 'en' ? 'tr' : 'en';
        const translationResponse = await fetch(`/api/blog/translation?locale=${locale}&otherLocale=${otherLocale}&slug=${slug}`);
        
        if (translationResponse.ok) {
          const translationData = await translationResponse.json();
          setTranslatedSlug(translationData.translatedSlug);
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [locale, slug]);

  // Tarih formatı için dil kodu al
  const dateLocale = t("common.locales.dateFormat");
  
  // Tarih formatlama fonksiyonu
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(dateLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateStr));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            {t("blog.postNotFound.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t("blog.postNotFound.message")}
          </p>
          <Link
            href={`/blog/${locale}`}
            className="inline-flex items-center text-gray-900 dark:text-gray-300 text-sm font-medium hover:text-gray-700 dark:hover:text-white hover:underline transition-colors duration-300"
          >
            {t("blog.postNotFound.returnLink")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white dark:bg-[#111111] ${inter.variable} font-sans`}>
      {/* Background elements - clean look without grain */}

      <NavBar />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 dark:bg-[#191919] py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {t("blog.detail.breadcrumbs.home")}
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <Link href={`/blog/${locale}`} className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {t("blog.detail.breadcrumbs.blog")}
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-900 dark:text-white">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Blog Post Content */}
      <article className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              href={`/blog/${locale}`}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              {t("blog.detail.backToArticles")}
            </Link>
            
            {/* Dil değiştirme bağlantısı */}
            {translatedSlug && (
              <Link
                href={`/blog/${locale === "en" ? "tr" : "en"}/post/${translatedSlug}`}
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm px-3 py-1 rounded-md bg-gray-50 dark:bg-[#191919] border border-gray-200 dark:border-gray-700 transition-colors"
              >
                {locale === "en" ? "Türkçe sürüme geç" : "Switch to English version"}
              </Link>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-8">
            <span>{formatDate(post.date)}</span>
            <span className="mx-2">•</span>
            <span>{post.author}</span>
          </div>
          
          {/* Kapak görseli */}
          {post.coverImage && (
            <div className="w-full h-64 md:h-96 relative mb-8 rounded-lg overflow-hidden">
              <Image 
                src={theme === 'dark' && post.coverImageDark ? post.coverImageDark : post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          {/* Dil değiştirme bağlantısı - Eski konum kaldırıldı */}

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div 
              className="markdown-content" 
              dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
            />
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category: string) => (
                <Link
                  key={category}
                  href={`/blog/${locale}/category/${category}`}
                  className="inline-block px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {t(`blog.categories.${category}`)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>

      <FooterSection />
    </div>
  );
}