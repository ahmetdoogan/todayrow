"use client";

import { useState, useEffect } from 'react';
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import ShortcutsModal from "./ShortcutsModal";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname) return;
    
    // Public routes
    const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/verify', '/auth/forgot-password', '/auth/reset-password', '/legal/privacy', '/legal/terms', '/new-landing', '/auth-new/login', '/auth-new/login-alt', '/auth-new/signup', '/auth-new/verify', '/auth-new/forgot-password', '/auth-new/reset-password'];
    const isPublicRoute = publicRoutes.includes(pathname);
    const isAuthRoute = pathname.startsWith('/auth/') || pathname.startsWith('/auth-new/');
    const isRootRoute = pathname === '/';

    // Kullanıcı girişli ve ana sayfada ise
    if (user && isRootRoute) {
      router.replace('/dashboard');
      return;
    }

    // Kullanıcı girişli ve auth sayfalarında ise
    if (user && isAuthRoute) {
      window.location.href = '/dashboard';
      return;
    }

    // Kullanıcı girişsiz ve korumalı sayfada ise
    if (!user && !isPublicRoute) {
      window.location.href = `/auth/login?redirect=${encodeURIComponent(pathname)}`;
      return;
    }
  }, [user, pathname]);

  return <>{children}</>;
};

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  useKeyboardShortcuts();

  return (
    <AuthGuard>
      {children}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </AuthGuard>
  );
}
