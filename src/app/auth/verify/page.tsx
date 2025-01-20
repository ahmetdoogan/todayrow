"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// Bu sayfa: 
// 1) Ekranda "Lütfen e-postanızı doğrulayın" kutusu gösterir.
// 2) Aynı anda useEffect içinde "mail doğrulanmış mı?" diye bakar. 
//    - Doğrulanmışsa => "subscriptions" tablosunda satır var mı yok mu kontrol. 
//    - Yoksa => ekle. 
// 3) Ardından /dashboard'a yönlendirir.

export default function VerifyPage() {
  const t = useTranslations('auth');
  const commonT = useTranslations('common');
  const router = useRouter();
  const supabase = useSupabaseClient();

  useEffect(() => {
    // 1) user var mı => mail confirmed mı => tablo insert
    const checkVerifiedAndInsert = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // Kullanıcı yoksa 2-3 saniye sonra login sayfasına at.
          console.log("No user session found. Possibly not verified yet.");
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
          return;
        }

        // user var, mail confirmed mi?
        const emailConfirmed = user.email_confirmed_at; 
        if (!emailConfirmed) {
          console.log("Email not confirmed yet. We'll go login in 3s...");
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
          return;
        }

        // Artık user onaylı => subscription var mı diye bakalım
        const { data: existingSub, error: subError } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (subError) {
          console.error("Error checking subscription:", subError);
          // ama yine de devam edebiliriz
        }

        if (!existingSub) {
          // tablodaki satır yok => ekleyelim
          const { error: insertError } = await supabase
            .from("subscriptions")
            .insert({ user_id: user.id, status: "free_trial" });

          if (insertError) {
            console.error("Subscription insert error:", insertError);
          } else {
            console.log("Inserted new free_trial subscription for user:", user.id);
          }
        } else {
          console.log("Subscription row already exists, skipping insert.");
        }

        // Son olarak dashboard'a at.
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);

      } catch (err) {
        console.error("Verify check error:", err);
        router.push("/auth/login");
      }
    };

    checkVerifiedAndInsert();
  }, [supabase, router]);

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md mx-auto mt-20">
      <div className="text-center">
        <Mail className="w-16 h-16 mx-auto mb-4 text-blue-600" />
        <h1 className="text-2xl font-bold mb-2">{t('verify.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('verify.description')}
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('verify.checkSpam')}
          </p>
          <Link
            href="/auth/login"
            className="text-blue-600 hover:underline block"
          >
            {commonT('navigation.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}
