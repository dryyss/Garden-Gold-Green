import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { CartSidebar } from "@/components/CartSidebar";
import { AuthNotificationHandler } from "@/components/AuthNotificationHandler";
import { OrderNotificationHandler } from "@/components/OrderNotificationHandler";
import { PageLoader } from "@/components/PageLoader";
import { AuthProvider } from "@/contexts/AuthContext";
import { Auth0Provider } from "@/contexts/Auth0Context";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ChatSupport } from "@/components/ChatSupport";
import { ChatButton } from "@/components/ChatSupport";
  
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Garden Gold Green - Produits CBD Premium",
  description: "Découvrez notre sélection de produits CBD premium : huiles, fleurs et cosmétiques. Qualité garantie, testés en laboratoire. Livraison rapide et sécurisée.",
  keywords: "CBD, huiles CBD, fleurs CBD, cosmétiques CBD, chanvre, bien-être, France",
  authors: [{ name: "Garden Gold Green" }],
  creator: "Garden Gold Green",
  publisher: "Garden Gold Green",
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? "https://gardengoldgreen.com" : "http://localhost:3001"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NODE_ENV === 'production' ? "https://gardengoldgreen.com" : "http://localhost:3001",
    title: "Garden Gold Green - Produits CBD Premium",
    description: "Découvrez notre sélection de produits CBD premium : huiles, fleurs et cosmétiques.",
    siteName: "Garden Gold Green",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Garden Gold Green - Produits CBD Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Garden Gold Green - Produits CBD Premium",
    description: "Découvrez notre sélection de produits CBD premium : huiles, fleurs et cosmétiques.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Garden CBD" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="bg-brand-black watermark font-sans antialiased min-h-screen flex flex-col">
        {/* Filigrane global */}
        <div aria-hidden className="watermark-overlay" />
        <PageLoader minLoadingTime={1500} showOnce={true}>
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          <TranslationProvider>
            <NotificationProvider>
              <Auth0Provider>
                <AuthProvider>
                  <CartProvider>
                    <Header />

                    <main className="flex-1">
                      {children}
                    </main>

                    <Footer />

                    <CookieConsent />
                    <CartSidebar />
                    <AuthNotificationHandler />
                    <OrderNotificationHandler />
                    <ChatSupport />
                    <ChatButton />
                  </CartProvider>
                </AuthProvider>
              </Auth0Provider>
            </NotificationProvider>
          </TranslationProvider>
        </PageLoader>
      </body>
    </html>
  );
}
