import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { LegalBanner } from "@/components/LegalBanner";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { CartSidebar } from "@/components/CartSidebar";
import { FloatingCartButton } from "@/components/FloatingCartButton";
import { SystemTest } from "@/components/SystemTest";
import { AuthNotificationHandler } from "@/components/AuthNotificationHandler";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
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
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <NotificationProvider>
          <AuthProvider>
            <CartProvider>
              <LegalBanner />
              <Header />

              <main className="flex-1">
                {children}
              </main>

              <Footer />

              <CookieConsent />
              <CartSidebar />
              <FloatingCartButton />
              <AuthNotificationHandler />
              {process.env.NODE_ENV === 'development' && <SystemTest />}
            </CartProvider>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
