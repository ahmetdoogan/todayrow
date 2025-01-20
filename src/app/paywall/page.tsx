// src/app/paywall/page.tsx
"use client";
import { useRouter } from 'next/navigation';

export default function PaywallPage() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Erişim Kısıtlandı</h1>
      <p className="mb-6">Deneme süreniz bitti veya aboneliğiniz iptal edildi.</p>
      <button
        onClick={() => router.push('/dashboard/settings/profile')}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Üyeliği Yükselt
      </button>
    </div>
  );
}
