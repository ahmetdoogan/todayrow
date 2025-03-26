"use client";
import React from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}