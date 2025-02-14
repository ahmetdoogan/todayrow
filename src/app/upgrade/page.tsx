"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; 
import PricingModal from "@/components/modals/PricingModal";
import DashboardLayout from "@/components/layouts/DashboardLayout"; // Layout dahil ettik

export default function UpgradePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user === undefined) {
      return;
    }
    if (!user && !checkedAuth) {
      setCheckedAuth(true);
      router.push("/auth/login?redirect=/upgrade"); 
    } else if (user) {
      setShowModal(true);
    }
  }, [user, router, checkedAuth]);

  const handleClose = () => {
    router.push("/dashboard"); 
  };

  return (
    <DashboardLayout> 
      {!showModal && <p>Yükleniyor...</p>}
      {showModal && (
        <PricingModal isOpen={true} onClose={handleClose} />
      )}
    </DashboardLayout>
  );
}
