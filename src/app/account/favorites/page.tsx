'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft,
  faHeart,
  faShoppingCart,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Image from 'next/image'

export default function FavoritesPage() {
  const { state: authState } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push('/')
    }
  }, [authState.isAuthenticated, router])

  // Données de démonstration
  const mockFavorites = [
    {
      id: '1',
      title: '3G Gold Standard CBD Oil',
      price: 79.99,
      image: 'https://via.placeholder.com/300x200/00C853/FFFFFF?text=CBD+Oil',
      cbdPercent: 10,
      slug: '3g-gold-standard-cbd-oil'
    },
    {
      id: '2',
      title: 'Emerald Soothe CBD Balm',
      price: 54.99,
      image: 'https://via.placeholder.com/300x200/FFD700/000000?text=CBD+Cream',
      cbdPercent: 2,
      slug: 'emerald-soothe-cbd-balm'
    }
  ]

  const handleAddToCart = (product: any) => {
    // Ici vous pourriez intégrer avec le contexte du panier
    console.log('Ajouter au panier:', product)
  }

  const handleRemoveFavorite = (productId: string) => {
    // Ici vous pourriez intégrer avec un contexte de favoris
    console.log('Retirer des favoris:', productId)
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Chargement...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-brand-black min-h-screen pt-24">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/account"
              className="text-gray-400 hover:text-brand-gold transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold gold-text-gradient mb-2">
                Mes Favoris
              </h1>
              <p className="text-gray-400">
                Vos produits préférés
              </p>
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        {mockFavorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
              <FontAwesomeIcon icon={faHeart} className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucun favori</h3>
            <p className="text-gray-400 mb-6">Ajoutez des produits à vos favoris pour les retrouver facilement</p>
            <Link
              href="/products"
              className="btn-gold text-black font-bold py-2 px-6 rounded-full"
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFavorites.map((product) => (
              <div key={product.id} className="card-bg rounded-xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-gold-glow">
                <div className="h-48 overflow-hidden relative">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleRemoveFavorite(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                  </button>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    <Link 
                      href={`/products/${product.slug}`}
                      className="hover:text-brand-gold transition-colors"
                    >
                      {product.title}
                    </Link>
                  </h3>
                  
                  {product.cbdPercent && (
                    <p className="text-brand-green text-sm mb-3">
                      CBD {product.cbdPercent}%
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold gold-text-gradient">
                      {product.price.toFixed(2)}€
                    </span>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn-gold text-black font-bold py-2 px-4 rounded-full text-sm flex items-center"
                      >
                        <FontAwesomeIcon icon={faShoppingCart} className="mr-1" />
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
