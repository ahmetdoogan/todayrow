import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import GoogleAnalytics from "@/components/providers/GoogleAnalytics";
import ErrorBoundary from "@/components/ErrorBoundary";
import { RootProviders } from "@/components/providers/RootProviders";
import LanguageProvider from "@/components/providers/LanguageProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todayrow",
  description: "Günlerinizi planlayın.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <LanguageProvider>
              <RootProviders>
                {children}
              </RootProviders>
            </LanguageProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}