"use client";

import { useEffect } from 'react';
import { migrateExistingNotesToSlug } from '@/services/notes';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function MigrateSlugsPage() {
  const router = useRouter();

  useEffect(() => {
    const migrate = async () => {
      try {
        await migrateExistingNotesToSlug();
        toast.success('Slug oluşturma işlemi tamamlandı');
        
        // 2 saniye sonra notes sayfasına yönlendir
        setTimeout(() => {
          router.push('/dashboard/notes');
        }, 2000);
      } catch (error) {
        console.error('Error migrating slugs:', error);
        toast.error('Slug oluşturulurken hata oluştu');
      }
    };

    migrate();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  );
}
