import ProductsPageClient from './ProductsPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Produits CBD Premium - Garden Gold Green',
  description: 'Découvrez notre collection complète de produits CBD premium : huiles CBD, fleurs CBD, cosmétiques CBD et bien plus. Qualité garantie, testés en laboratoire. Livraison rapide en France.',
  keywords: 'produits CBD, huiles CBD, fleurs CBD, cosmétiques CBD, CBD France, chanvre, bien-être, produits naturels',
  openGraph: {
    title: 'Produits CBD Premium - Garden Gold Green',
    description: 'Découvrez notre collection complète de produits CBD premium : huiles CBD, fleurs CBD, cosmétiques CBD et bien plus.',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Garden Gold Green - Produits CBD Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Produits CBD Premium - Garden Gold Green',
    description: 'Découvrez notre collection complète de produits CBD premium.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: '/products',
  },
}

export default function ProductsPage() {
  return <ProductsPageClient />
}
