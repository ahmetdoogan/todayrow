"use client";
import { useEffect, useRef, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Script from "next/script";

interface GoogleCustomButtonProps {
  className?: string;
}

export default function GoogleCustomButton({ className }: GoogleCustomButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  
  useEffect(() => {
    // Script yüklendikten sonra butonu initialize et
    if (!isScriptLoaded) return;

    const initializeButton = () => {
      if (!window.google?.accounts || !buttonRef.current) return;

      try {
        window.google.accounts.id.initialize({
          client_id: "822907467055-i8psajcj2eemirjkrijsa0dhcccljhdi.apps.googleusercontent.com",
          callback: async (response) => {
            if (response.credential) {
              try {
                await signInWithGoogle(response.credential);
                setTimeout(() => {
                  router.push('/dashboard');
                }, 500);
              } catch (error) {
                console.error("Google sign in error:", error);
              }
            }
          },
          state_cookie_domain: window.location.hostname,
        });

        const isDark = document.documentElement.classList.contains('dark');
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: isDark ? 'filled_black' : 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'pill',
          width: buttonRef.current.offsetWidth,
          locale: 'tr',
        });
      } catch (error) {
        console.error("Google button render error:", error);
      }
    };

    // İlk render
    initializeButton();

    // Theme değişikliğini izle
    const observer = new MutationObserver(() => {
      initializeButton();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, [isScriptLoaded, signInWithGoogle, router]);

  // Script'i component içinde yükle
  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        onLoad={() => setIsScriptLoaded(true)}
        strategy="afterInteractive"
      />
      <div 
        ref={buttonRef}
        className={`h-11 flex justify-center ${className}`}
      />
    </>
  );
}