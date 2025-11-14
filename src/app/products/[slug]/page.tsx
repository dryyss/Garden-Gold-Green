'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import ProductPage from '@/components/ProductPage'

// Transformer les données de l'ancienne structure vers la nouvelle
function transformProduct(product: any) {
  return {
    ...product,
    name: product.title,
    price: product.priceCents / 100,
    image: product.images?.[0] || '/logo2.png',
    images: product.images || [product.images?.[0] || '/logo2.png'],
    category: product.categories?.[0]?.name || 'CBD Products',
    rating: 4.5,
    reviewCount: Math.floor(Math.random() * 100) + 10,
    inStock: product.stock > 0,
    isNew: Math.random() > 0.7,
    isBestSeller: Math.random() > 0.8,
    slug: product.slug,
    description: product.description || 'Produit CBD de qualité supérieure, soigneusement sélectionné et testé pour garantir pureté et efficacité.',
    detailedDescription: product.detailedDescription || `Notre ${product.title} est un produit CBD de qualité premium, soigneusement sélectionné pour sa pureté et son efficacité. Chaque lot est testé en laboratoire pour garantir une concentration précise en CBD et l'absence de contaminants.`,
    cbdPercent: product.cbdPercent || 10,
    thcPercent: product.thcPercent || 0.2,
    weight: product.weight || '10g',
    origin: product.origin || 'Europe',
    extractionMethod: product.extractionMethod || 'CO2 supercritique',
    labTested: true,
    organic: true,
    usageInstructions: product.usageInstructions || 'le matin ou le soir selon vos besoins',
    benefits: product.benefits || [
      'Aide à la relaxation et au bien-être',
      'Soutient un sommeil réparateur',
      'Contribue à la gestion du stress',
      'Favorise la récupération musculaire'
    ],
    dosage: product.dosage || '5-10mg par jour',
    storage: product.storage || 'Conserver dans un endroit frais et sec, à l\'abri de la lumière.',
    expiryDate: product.expiryDate || '24 mois à partir de la date de fabrication.',
    batchNumber: product.batchNumber || 'GGG-2024-001',
    ingredients: product.ingredients || ['Extrait de CBD', 'Huile de coco MCT', 'Arômes naturels'],
    allergens: product.allergens || ['Aucun allergène connu'],
    warnings: product.warnings || ['Ne pas utiliser pendant la grossesse ou l\'allaitement']
  }
}

export default function ProductPageWrapper() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Charger le produit depuis l'API
    const loadProduct = async () => {
      try {
        const response = await fetch(`/api/products?slug=${slug}`)
        const data = await response.json()
        if (data.success && data.product) {
          setProduct(transformProduct(data.product))
        }
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-white">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Produit non trouvé</h1>
          <p className="text-gray-400 mb-6">Le produit que vous recherchez n'existe pas.</p>
          <a 
            href="/products" 
            className="btn-gold text-black font-bold py-2 px-6 rounded-full"
          >
            Retour aux produits
          </a>
        </div>
      </div>
    )
  }

  return <ProductPage product={product} />
}