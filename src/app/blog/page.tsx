"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function BlogRedirect() {
  const router = useRouter();
  const { language } = useLanguage();
  
  useEffect(() => {
    // Ana sitenin aktif dil tercihine göre yönlendirme
    router.replace(`/blog/${language}`);
  }, [router, language]);
  
  // Yönlendirme beklenirken gösterilecek yükleniyor ekranı
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Yönlendiriliyor...</p>
      </div>
    </div>
  );
}
