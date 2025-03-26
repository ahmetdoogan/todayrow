"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { Mail, Loader2 } from "lucide-react";

// ShadCN bileşenleri
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function VerifyPage() {
  const t = useTranslations('auth');
  const commonT = useTranslations('common');
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [isChecking, setIsChecking] = React.useState(true);

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

        // İşlemler bitti
        setIsChecking(false);

        // Son olarak dashboard'a at.
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);

      } catch (err) {
        console.error("Verify check error:", err);
        setIsChecking(false);
        router.push("/auth/login");
      }
    };

    checkVerifiedAndInsert();
  }, [supabase, router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50 dark:bg-[#111111]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo (orta) */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-8 w-auto" />
          </Link>
        </div>
        
        <Card className="border-gray-200 dark:border-gray-800 dark:bg-black">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
              {isChecking ? (
                <Loader2 className="h-7 w-7 text-blue-500 animate-spin" />
              ) : (
                <Mail className="h-7 w-7 text-blue-500" />
              )}
            </div>
            <CardTitle>{t('verify.title')}</CardTitle>
            <CardDescription className="text-slate-600 dark:text-[#a1a1a9]">{t('verify.description')}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {isChecking ? (
              <p className="text-sm text-muted-foreground dark:text-[#a1a1a9]">
                E-posta adresiniz kontrol ediliyor...
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground dark:text-[#a1a1a9]">
                  {t('verify.checkSpam')}
                </p>
                <Button
                  variant="outline"
                  className="mx-auto dark:bg-black dark:border-gray-800 dark:text-white dark:hover:bg-gray-900"
                  asChild
                >
                  <Link href="/auth/login">
                    {commonT('navigation.backToLogin')}
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}