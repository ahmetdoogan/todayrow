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
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/utils/supabaseClient'; // Bu satırı ekleyin

export function RootProviders({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const messages = language === 'tr' ? trMessages : enMessages;

  return (
    <SessionContextProvider supabaseClient={supabase}>
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
    </SessionContextProvider>
  );
}