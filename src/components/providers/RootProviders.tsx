"use client";

import React from 'react';
import { NextIntlClientProvider } from "next-intl";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { ContentProvider } from "@/context/ContentContext";
import ClientLayout from "@/app/ClientLayout";
import RootLayoutClient from "@/components/RootLayoutClient";
import ToastProvider from "@/components/providers/ToastProvider";
import trMessages from "@/messages/tr.json";
import enMessages from "@/messages/en.json";
import { useLanguage } from './LanguageProvider';

export function RootProviders({ children }: { children: React.ReactNode }) {
  // Dil bilgisini LanguageProvider'dan al
  const { language } = useLanguage();
  // Dile göre mesajları seç
  const messages = language === 'tr' ? trMessages : enMessages;

  return (
    <NextIntlClientProvider locale={language} messages={messages}>
      <ThemeProvider>
        <ContentProvider>
          <ToastProvider>
            <ClientLayout>
              <RootLayoutClient>
                {children}
              </RootLayoutClient>
            </ClientLayout>
          </ToastProvider>
        </ContentProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}