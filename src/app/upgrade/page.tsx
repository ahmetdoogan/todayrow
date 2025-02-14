"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Senin Auth Hook'un
import PricingModal from "@/components/modals/PricingModal";

export default function UpgradePage() {
  const router = useRouter();
  const { user } = useAuth(); // Buradan user bilgisini alıyoruz
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user === undefined) {
      return; // Daha yüklenmemiş, bir şey yapma
    }
    if (!user && !checkedAuth) {
      setCheckedAuth(true);
      router.push("/auth/login?redirect=/upgrade"); // Login sayfasına yönlendir
    } else if (user) {
      setShowModal(true);
    }
  }, [user, router, checkedAuth]);

  const handleClose = () => {
    router.push("/dashboard"); // Pricing modal kapanınca dashboard'a git
  };

  return (
    <div>
      {!showModal && <p>Yükleniyor...</p>}
      {showModal && (
        <PricingModal
          isOpen={true}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
