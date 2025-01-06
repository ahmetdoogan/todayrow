"use client";

import { useEffect, useState } from 'react';
import { migrateExistingNotesToSlug } from '@/services/notes';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function MigrateSlugsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [migratedCount, setMigratedCount] = useState(0);

  useEffect(() => {
    const migrate = async () => {
      try {
        const count = await migrateExistingNotesToSlug();
        setMigratedCount(count);
        toast.success(`${count} not için slug oluşturuldu`);
        
        // 2 saniye sonra notes sayfasına yönlendir
        setTimeout(() => {
          router.push('/dashboard/notes');
        }, 2000);
      } catch (error: any) {
        toast.error(error.message || 'Slug oluşturma sırasında hata oluştu');
        console.error('Migration error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    migrate();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {isLoading ? (
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
          <p className="text-lg">Notlar için slug'lar oluşturuluyor...</p>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-xl">
            {migratedCount} not için slug oluşturuldu
          </p>
          <p className="text-gray-600">
            Notes sayfasına yönlendiriliyorsunuz...
          </p>
        </div>
      )}
    </div>
  );
}