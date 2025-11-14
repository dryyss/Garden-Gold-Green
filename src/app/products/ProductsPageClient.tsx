'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faMagnifyingGlass, 
  faFilter, 
  faTh, 
  faList,
  faArrowLeft,
  faXmark
} from '@fortawesome/free-solid-svg-icons'

// Type extension pour window
declare global {
  interface Window {
    searchTimeout?: NodeJS.Timeout
  }
}

interface TransformedProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description: string
  rating: number
  reviewCount: number
  inStock: boolean
  isNew?: boolean
  isBestSeller?: boolean
  slug?: string
  cbdPercent?: number
  variants?: Array<{
    id: string
    weight: number
    unit: string
    priceCents: number
    stock: number
    sku: string
    isDefault: boolean
  }>
  totalStock?: number
}

// Transformer les données de l'ancienne structure vers la nouvelle
function transformProduct(product: Record<string, unknown>): TransformedProduct {
  // Utiliser un ID stable pour générer des valeurs déterministes
  const productId = String(product.id || '')
  const hash = productId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
  const reviewCount = 10 + (hash % 90) // Entre 10 et 99
  const isNew = hash % 10 < 3 // 30% de chance
  const isBestSeller = hash % 10 < 2 // 20% de chance
  
  return {
    ...product,
    name: String((product as { title?: string }).title || ''),
    price: (Number((product as { priceCents?: number }).priceCents) || 0) / 100, // Convertir les centimes en euros
    image: String(((product as { images?: string[] }).images?.[0]) || '/logo2.png'),
    category: String(((product as { categories?: Array<{ name?: string }> }).categories?.[0]?.name) || 'CBD Products'),
    rating: 4.5, // Valeur par défaut
    reviewCount, // Valeur déterministe basée sur l'ID
    inStock: Number((product as { stock?: number }).stock) > 0,
    isNew, // Valeur déterministe
    isBestSeller, // Valeur déterministe
  } as TransformedProduct
}

function filterAndSortProducts(
  allProducts: TransformedProduct[],
  searchParams: URLSearchParams
) {
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'newest'
  const priceRange = searchParams.get('price')
  const cbdRange = searchParams.get('cbd')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 12
  
  let products = [...allProducts]
  
  // Filtrage par catégorie
  if (category && category !== 'all') {
    products = products.filter(p => 
      p.category.toLowerCase().includes(category.toLowerCase())
    )
  }
  
  // Filtrage par recherche
  if (search) {
    const searchLower = search.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower)
    )
  }
  
  // Filtrage par prix
  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number)
    products = products.filter(p => {
      if (max) return p.price >= min && p.price <= max
      return p.price >= min
    })
  }
  
  // Filtrage par CBD
  if (cbdRange) {
    const [min, max] = cbdRange.split('-').map(Number)
    products = products.filter(p => {
      const cbdPercent = p.cbdPercent || 0
      if (max) return cbdPercent >= min && cbdPercent <= max
      return cbdPercent >= min
    })
  }
  
  // Tri
  switch (sort) {
    case 'price-low':
      products.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      products.sort((a, b) => b.price - a.price)
      break
    case 'name':
      products.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'rating':
      products.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
    default:
      // Tri par ID (ordre par défaut)
      products.sort((a, b) => a.id.localeCompare(b.id))
      break
  }
  
  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProducts = products.slice(startIndex, endIndex)
  
  return {
    products: paginatedProducts,
    total: products.length,
    totalPages: Math.ceil(products.length / limit),
    currentPage: page
  }
}

function getCategories(products: TransformedProduct[]) {
  const categories = new Set<string>()
  products.forEach((product) => {
    if (product.category) {
      categories.add(product.category)
    }
  })
  return Array.from(categories).map((name: string) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-')
  }))
}

export default function ProductsPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [allProducts, setAllProducts] = useState<TransformedProduct[]>([])
  const [loading, setLoading] = useState(true)
  
  // Charger les produits depuis l'API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products/all')
        const data = await response.json()
        if (data.success && data.products) {
          const transformed = data.products.map(transformProduct)
          setAllProducts(transformed)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])
  
  // Mettre à jour la recherche quand les paramètres URL changent
  useEffect(() => {
    setSearch(searchParams.get('search') || '')
  }, [searchParams])
  
  const { products, total, totalPages, currentPage } = filterAndSortProducts(allProducts, searchParams)
  const categories = getCategories(allProducts)
  const handleSearch = (value: string) => {
    setSearch(value)
    
    // Debounce search
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout)
    }
    
    window.searchTimeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('search', value)
      } else {
        params.delete('search')
      }
      params.delete('page') // Reset to page 1
      router.push(`/products?${params.toString()}`)
    }, 300) // Réduit le délai pour une meilleure réactivité
  }
  
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // Reset to page 1
    router.push(`/products?${params.toString()}`)
  }
  
  const clearFilters = () => {
    router.push('/products')
  }
  
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/products?${params.toString()}`)
  }
  
  if (loading) {
    return (
      <main className="bg-brand-black min-h-screen pt-2 sm:pt-6 lg:pt-10 xl:pt-14 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-white">Chargement des produits...</p>
        </div>
      </main>
    )
  }
  
  return (
    <main className="bg-brand-black min-h-screen pt-2 sm:pt-6 lg:pt-10 xl:pt-14">
      {/* Hero Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-brand-gold/10 to-brand-green/10">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Nos <span className="gold-text-gradient">Produits CBD</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-2">
              Découvrez notre sélection premium de produits CBD de qualité supérieure
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-4 sm:py-6 lg:py-8 bg-[#111111]">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-3 sm:mb-4 lg:mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 text-sm sm:text-base" />
              </div>
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 lg:py-4 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent text-sm sm:text-base"
                aria-label="Rechercher des produits"
              />
            </div>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 lg:mb-6 gap-3 sm:gap-4">
              <span className="text-gray-400 text-xs sm:text-sm lg:text-base">{total} produits trouvés</span>
              <div className="flex space-x-1 sm:space-x-2" role="group" aria-label="Mode d'affichage">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded text-xs sm:text-sm ${viewMode === 'grid' ? 'bg-brand-gold text-black' : 'bg-white/10 text-white'}`}
                  aria-label="Vue en grille"
                  aria-pressed={viewMode === 'grid'}
                >
                  <FontAwesomeIcon icon={faTh} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 sm:p-2 rounded text-xs sm:text-sm ${viewMode === 'list' ? 'bg-brand-gold text-black' : 'bg-white/10 text-white'}`}
                  aria-label="Vue en liste"
                  aria-pressed={viewMode === 'list'}
                >
                  <FontAwesomeIcon icon={faList} />
                </button>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4 sm:mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors w-full justify-center text-sm sm:text-base"
                aria-label="Afficher les filtres"
                aria-expanded={showFilters}
              >
                <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
                <span>Filtres</span>
              </button>
            </div>

            {/* Main Content with Sidebar */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className={`w-full lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="card-bg rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 sticky top-20 sm:top-24">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-white">Filtres</h3>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={clearFilters}
                        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                        aria-label="Effacer tous les filtres"
                      >
                        <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                        <span className="hidden sm:inline">Effacer</span>
                        <span className="sm:hidden">Reset</span>
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="lg:hidden p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors"
                        aria-label="Fermer les filtres"
                      >
                        <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                    {/* Category Filter */}
                    <div>
                      <label htmlFor="category-filter" className="block text-white font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Catégorie</label>
                      <select
                        id="category-filter"
                        value={searchParams.get('category') || 'all'}
                        onChange={(e) => updateFilter('category', e.target.value)}
                        className="w-full p-2 sm:p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold text-xs sm:text-sm lg:text-base appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="all" className="bg-gray-800 text-white text-xs sm:text-sm">Toutes les catégories</option>
                        {categories.map((cat) => (
                          <option key={cat.slug} value={cat.slug} className="bg-gray-800 text-white text-xs sm:text-sm">
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort Filter */}
                    <div>
                      <label htmlFor="sort-filter" className="block text-white font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Trier par</label>
                      <select
                        id="sort-filter"
                        value={searchParams.get('sort') || 'newest'}
                        onChange={(e) => updateFilter('sort', e.target.value)}
                        className="w-full p-2 sm:p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold text-xs sm:text-sm lg:text-base appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="newest" className="bg-gray-800 text-white text-xs sm:text-sm">Plus récents</option>
                        <option value="price-low" className="bg-gray-800 text-white text-xs sm:text-sm">Prix croissant</option>
                        <option value="price-high" className="bg-gray-800 text-white text-xs sm:text-sm">Prix décroissant</option>
                        <option value="name" className="bg-gray-800 text-white text-xs sm:text-sm">Nom A-Z</option>
                        <option value="rating" className="bg-gray-800 text-white text-xs sm:text-sm">Mieux notés</option>
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label htmlFor="price-filter" className="block text-white font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Prix</label>
                      <select
                        id="price-filter"
                        value={searchParams.get('price') || 'all'}
                        onChange={(e) => updateFilter('price', e.target.value)}
                        className="w-full p-2 sm:p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold text-xs sm:text-sm lg:text-base appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="all" className="bg-gray-800 text-white text-xs sm:text-sm">Tous les prix</option>
                        <option value="0-25" className="bg-gray-800 text-white text-xs sm:text-sm">0€ - 25€</option>
                        <option value="25-50" className="bg-gray-800 text-white text-xs sm:text-sm">25€ - 50€</option>
                        <option value="50-100" className="bg-gray-800 text-white text-xs sm:text-sm">50€ - 100€</option>
                        <option value="100" className="bg-gray-800 text-white text-xs sm:text-sm">100€+</option>
                      </select>
                    </div>

                    {/* CBD Range */}
                    <div>
                      <label htmlFor="cbd-filter" className="block text-white font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">CBD %</label>
                      <select
                        id="cbd-filter"
                        value={searchParams.get('cbd') || 'all'}
                        onChange={(e) => updateFilter('cbd', e.target.value)}
                        className="w-full p-2 sm:p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold text-xs sm:text-sm lg:text-base appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="all" className="bg-gray-800 text-white text-xs sm:text-sm">Tous les %</option>
                        <option value="0-5" className="bg-gray-800 text-white text-xs sm:text-sm">0% - 5%</option>
                        <option value="5-10" className="bg-gray-800 text-white text-xs sm:text-sm">5% - 10%</option>
                        <option value="10-20" className="bg-gray-800 text-white text-xs sm:text-sm">10% - 20%</option>
                        <option value="20" className="bg-gray-800 text-white text-xs sm:text-sm">20%+</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1">
                {products.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                      <FontAwesomeIcon icon={faMagnifyingGlass} className="text-4xl text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Aucun produit trouvé</h3>
                    <p className="text-gray-400 mb-8">Essayez de modifier vos critères de recherche</p>
                <button
                  onClick={clearFilters}
                  className="btn-gold text-black font-bold py-2 sm:py-3 px-4 sm:px-8 rounded-full shadow-gold-glow text-sm sm:text-base"
                  aria-label="Effacer tous les filtres"
                >
                  Effacer les filtres
                </button>
                  </div>
                ) : (
                  <>
                    <div className={`grid gap-3 sm:gap-4 lg:gap-6 xl:gap-8 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                        : 'grid-cols-1'
                    }`} style={{ maxWidth: '100%', overflow: 'hidden' }}>
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                        />
                      ))}
                    </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className="flex justify-center mt-8 sm:mt-12" aria-label="Pagination">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1.5 sm:p-2 rounded-lg bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                        aria-label="Page précédente"
                      >
                        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                            page === currentPage
                              ? 'bg-brand-gold text-black'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                          aria-label={`Aller à la page ${page}`}
                          aria-current={page === currentPage ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-1.5 sm:p-2 rounded-lg bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                        aria-label="Page suivante"
                      >
                        <FontAwesomeIcon icon={faArrowLeft} className="rotate-180 w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </nav>
                )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

