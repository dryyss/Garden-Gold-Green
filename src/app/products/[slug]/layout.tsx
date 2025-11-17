import type { Metadata } from 'next'
import { getProductBySlug } from '@/lib/products-store'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const product = await getProductBySlug(slug)
    
    if (!product) {
      return {
        title: 'Produit non trouvé - Garden Gold Green',
        description: 'Le produit que vous recherchez n\'existe pas.',
      }
    }

    const productTitle = product.title || 'Produit CBD'
    const productDescription = product.description || `Découvrez ${productTitle}, un produit CBD premium de qualité supérieure. Testé en laboratoire, livraison rapide en France.`
    const productImage = Array.isArray(product.images) && product.images.length > 0 
      ? product.images[0] 
      : (typeof product.images === 'string' ? product.images : '/logo.png')
    const price = (product.priceCents || 0) / 100
    const category = product.categories?.[0]?.name || 'Produits CBD'
    
    const metadata: Metadata = {
      title: `${productTitle} - ${price.toFixed(2)}€ | Garden Gold Green`,
      description: productDescription.substring(0, 160),
      keywords: `${productTitle}, CBD, ${category}, produit CBD premium, chanvre, bien-être, France`,
      openGraph: {
        title: `${productTitle} - Garden Gold Green`,
        description: productDescription.substring(0, 160),
        type: 'website',
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: `${productTitle} - Produit CBD ${category}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${productTitle} - Garden Gold Green`,
        description: productDescription.substring(0, 160),
        images: [productImage],
      },
      alternates: {
        canonical: `/products/${slug}`,
      },
    }

    return metadata
  } catch (error) {
    console.error('Erreur lors de la génération des métadonnées:', error)
    return {
      title: 'Produit - Garden Gold Green',
      description: 'Découvrez nos produits CBD premium.',
    }
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

