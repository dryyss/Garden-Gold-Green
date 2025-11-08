'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faMagnifyingGlass, faTimes } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Image from 'next/image'
import { trackSearch } from '@/lib/analytics'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Données de démonstration pour la recherche
  const mockProducts = [
    { id: '1', name: 'Huile CBD 10%', category: 'Huiles', price: 29.99, slug: 'huile-cbd-10' },
    { id: '2', name: 'Fleurs CBD Amnesia', category: 'Fleurs', price: 12.50, slug: 'fleurs-cbd-amnesia' },
    { id: '3', name: 'Capsules CBD 25mg', category: 'Capsules', price: 39.99, slug: 'capsules-cbd-25mg' },
    { id: '4', name: 'Crème CBD Relax', category: 'Cosmétiques', price: 24.99, slug: 'creme-cbd-relax' },
    { id: '5', name: 'Gummies CBD 25mg', category: 'Gummies', price: 19.99, slug: 'gummies-cbd-25mg' },
    { id: '6', name: 'Huile CBD 5%', category: 'Huiles', price: 19.99, slug: 'huile-cbd-5' },
  ]

  const mockCategories = [
    { name: 'Huiles CBD', slug: 'huiles' },
    { name: 'Fleurs CBD', slug: 'fleurs' },
    { name: 'Capsules CBD', slug: 'capsules' },
    { name: 'Cosmétiques CBD', slug: 'cosmetiques' },
    { name: 'Gummies CBD', slug: 'gummies' },
  ]

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsLoading(true)
      
      // Debounce
      const timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
          const data = await response.json()
          setSearchResults(data.results || [])
        } catch (error) {
          console.error('Erreur recherche:', error)
          setSearchResults([])
        } finally {
          setIsLoading(false)
        }
      }, 300)
      
      return () => clearTimeout(timeoutId)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClose = () => {
    setSearchQuery('')
    setSearchResults([])
    onClose()
  }

  const handleResultClick = (result: any) => {
    trackSearch(result.name)
    handleClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-brand-black border border-white/10 rounded-lg w-full max-w-2xl mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-white/10">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des produits CBD..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
            autoFocus
          />
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors ml-3"
          >
            <FontAwesomeIcon icon={faXmark} className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {searchQuery.trim() ? (
            <div className="p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
                  <span className="ml-3 text-gray-400">Recherche...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3">
                    {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
                  </h3>
                  <div className="space-y-2">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => handleResultClick(product)}
                        className="block p-3 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {product.image && (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{product.name}</h4>
                            {product.categories && product.categories.length > 0 && (
                              <p className="text-sm text-gray-400">
                                {product.categories.join(', ')}
                              </p>
                            )}
                          </div>
                          <span className="text-brand-gold font-semibold">€{product.price.toFixed(2)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="text-4xl text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Aucun résultat</h3>
                  <p className="text-gray-400">Essayez avec d'autres mots-clés</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Catégories populaires</h3>
              <div className="grid grid-cols-2 gap-2">
                {mockCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/products?category=${category.slug}`}
                    onClick={handleClose}
                    className="block p-3 hover:bg-white/5 rounded-lg transition-colors text-center"
                  >
                    <span className="text-white">{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-brand-black/50">
          <p className="text-xs text-gray-400 text-center">
            Appuyez sur <kbd className="px-1 py-0.5 bg-white/10 rounded text-xs">Échap</kbd> pour fermer
          </p>
        </div>
      </div>
    </div>
  )
}