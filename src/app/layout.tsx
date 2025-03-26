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
  title: 'Todayrow - Bugüne odaklanın, yarını planlayın',
  description: 'Todayrow ile karmaşık takvimler yerine bugüne ve yarına odaklanarak verimliliğinizi artırın ve mental yükünüzü azaltın.',
  robots: 'index, follow',
  keywords: 'plan, planlama, verimlilik, üretkenlik, bugün, yarın, odak, takvim, zaman yönetimi, hatırlatıcı, not, görev',
  openGraph: {
    title: 'Todayrow - Bugüne odaklanın, yarını planlayın',
    description: 'Todayrow ile karmaşık takvimler yerine bugüne ve yarına odaklanarak verimliliğinizi artırın ve mental yükünüzü azaltın.',
    type: 'website',
    url: 'https://todayrow.app',
    siteName: 'Todayrow',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@todayrow',
    title: 'Todayrow - Bugüne odaklanın, yarını planlayın',
    description: 'Todayrow ile karmaşık takvimler yerine bugüne ve yarına odaklanarak verimliliğinizi artırın ve mental yükünüzü azaltın.',
  },
  alternates: {
    languages: {
      'en': 'https://todayrow.app/en',
      'tr': 'https://todayrow.app',
    }
  }
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