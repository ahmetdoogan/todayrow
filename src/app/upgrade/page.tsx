"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";
import PricingModal from "@/components/modals/PricingModal"; 
// ↑ Kendi propendeki path'e göre düzelt

export default function UpgradePage() {
  const router = useRouter();
  const session = useSession();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!session) {
      // Kullanıcı login değilse login sayfasına yönlendirelim
      // İstersen ?redirect=/upgrade ekleyebilirsin
      router.push("/auth/login");
    } else {
      // Login ise Pricing Modal'ı açıyoruz
      setShowModal(true);
    }
  }, [session, router]);

  // Modal kapandığında nereye gideceğinize siz karar verin, örnek /dashboard
  const handleClose = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Henüz login kontrolü yapılmadıysa / isLoading durumları da olabilir */}
      {!session && <p>Yükleniyor...</p>}

      {showModal && (
        <PricingModal isOpen={true} onClose={handleClose} />
      )}
    </div>
  );
}
