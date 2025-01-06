"use client";
import { useEffect, useRef } from 'react';
import { useAuth } from "@/context/AuthContext";

interface GoogleAuthButtonProps {
  className?: string;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
}

export default function GoogleAuthButton({ 
  className,
  text = 'continue_with',
  type = 'standard',
  theme = 'filled_black',
  size = 'large'
}: GoogleAuthButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { signInWithGoogle } = useAuth();

  useEffect(() => {
    if (window.google?.accounts && buttonRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: "822907467055-i8psajcj2eemirjkrijsa0dhcccljhdi.apps.googleusercontent.com",
          callback: async (response: any) => {
            if (response.credential) {
              await signInWithGoogle(response.credential);
            }
          },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          type,
          theme,
          size,
          text,
          shape: 'pill',
          width: buttonRef.current.offsetWidth,
        });
      } catch (error) {
        console.error("Google button yüklenirken hata:", error);
      }
    }
  }, [text, type, theme, size, signInWithGoogle]);

  return (
    <div 
      ref={buttonRef}
      className={className}
    />
  );
}