'use client'

import React, { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faMagnifyingGlass, 
  faFilter, 
  faTh, 
  faList,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import productsData from '@/data/products.json'

// Transformer les données de l'ancienne structure vers la nouvelle
function transformProduct(product: any) {
  return {
    ...product,
    name: product.title,
    price: product.priceCents / 100, // Convertir les centimes en euros
    image: product.images?.[0] || '/logo.png',
    category: product.categories?.[0]?.name || 'CBD Products',
    rating: 4.5, // Valeur par défaut
    reviewCount: Math.floor(Math.random() * 100) + 10, // Valeur aléatoire
    inStock: product.stock > 0,
    isNew: Math.random() > 0.7, // 30% de chance d'être nouveau
    isBestSeller: Math.random() > 0.8 // 20% de chance d'être best seller
  }
}

function getProducts(searchParams: URLSearchParams) {
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'newest'
  const priceRange = searchParams.get('price')
  const cbdRange = searchParams.get('cbd')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 12
  
  let filteredProducts = productsData
    .filter(product => product.published)
    .map(transformProduct)
  
  // Filtrer par catégorie
  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.categories.some(cat => cat.slug === category)
    )
  }
  
  // Filtrer par recherche
  if (search) {
    const searchLower = search.toLowerCase()
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    )
  }
  
  // Filtrer par gamme de prix
  if (priceRange) {
    filteredProducts = filteredProducts.filter(product => {
      switch (priceRange) {
        case 'under-20':
          return product.price < 20
        case '20-50':
          return product.price >= 20 && product.price <= 50
        case '50-100':
          return product.price >= 50 && product.price <= 100
        case 'above-100':
          return product.price > 100
        default:
          return true
      }
    })
  }
  
  // Filtrer par concentration CBD
  if (cbdRange) {
    filteredProducts = filteredProducts.filter(product => {
      const cbdPercent = product.cbdPercent || 0
      switch (cbdRange) {
        case 'under-5':
          return cbdPercent <= 5
        case '6-15':
          return cbdPercent >= 6 && cbdPercent <= 15
        case '16-25':
          return cbdPercent >= 16 && cbdPercent <= 25
        case 'above-26':
          return cbdPercent >= 26
        default:
          return true
      }
    })
  }
  
  // Trier
  switch (sort) {
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price)
      break
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'newest':
    default:
      // Garder l'ordre original (les premiers produits sont les plus récents)
      break
  }
  
  const totalProducts = filteredProducts.length
  const totalPages = Math.ceil(totalProducts / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
  
  return {
    products: paginatedProducts,
    pagination: {
      currentPage: page,
      totalPages,
      totalProducts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit
    }
  }
}

function getCategories() {
  const categoriesMap = new Map()
  
  productsData.forEach(product => {
    if (product.published && product.categories) {
      product.categories.forEach((category: any) => {
        if (!categoriesMap.has(category.slug)) {
          categoriesMap.set(category.slug, {
            slug: category.slug,
            name: category.name
          })
        }
      })
    }
  })
  
  return Array.from(categoriesMap.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [productsData, setProductsData] = useState(getProducts(searchParams))
  const [categories] = useState(getCategories())
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setProductsData(getProducts(searchParams))
    setSearchTerm(searchParams.get('search') || '')
    setSortBy(searchParams.get('sort') || 'newest')
    setSelectedCategory(searchParams.get('category') || '')
  }, [searchParams])

  const { products, pagination } = productsData

  // Fonction pour gérer la recherche
  const handleSearch = (search: string) => {
    const params = new URLSearchParams(searchParams)
    if (search.trim()) {
      params.set('search', search.trim())
    } else {
      params.delete('search')
    }
    params.delete('page') // Reset à la page 1
    window.history.pushState({}, '', `/products?${params.toString()}`)
  }

  // Fonction pour gérer le tri
  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', sort)
    params.delete('page') // Reset à la page 1
    window.history.pushState({}, '', `/products?${params.toString()}`)
  }

  // Fonction pour gérer les filtres de catégorie
  const handleCategoryFilter = (category: string) => {
    const params = new URLSearchParams(searchParams)
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    params.delete('page') // Reset à la page 1
    window.history.pushState({}, '', `/products?${params.toString()}`)
  }

  // Fonction pour gérer les filtres de prix
  const handlePriceFilter = (priceRange: string) => {
    const params = new URLSearchParams(searchParams)
    if (priceRange) {
      params.set('price', priceRange)
    } else {
      params.delete('price')
    }
    params.delete('page') // Reset à la page 1
    window.history.pushState({}, '', `/products?${params.toString()}`)
  }

  // Fonction pour gérer les filtres de concentration CBD
  const handleCbdFilter = (cbdRange: string) => {
    const params = new URLSearchParams(searchParams)
    if (cbdRange) {
      params.set('cbd', cbdRange)
    } else {
      params.delete('cbd')
    }
    params.delete('page') // Reset à la page 1
    window.history.pushState({}, '', `/products?${params.toString()}`)
  }

  // Fonction pour effacer tous les filtres
  const clearFilters = () => {
    window.history.pushState({}, '', '/products')
  }

  return (
    <div className="min-h-screen bg-brand-black pt-24">
      {/* Header */}
      <div className="bg-brand-black border-b border-white/10">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Notre Collection Premium
              </h1>
              <p className="text-gray-400">
                Découvrez notre sélection soigneusement choisie de produits CBD premium
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-sm font-medium">
                {pagination.totalProducts} produits
              </div>
              {pagination.totalPages > 1 && (
                <div className="bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full text-sm font-medium">
                  Page {pagination.currentPage} sur {pagination.totalPages}
                </div>
              )}
              {(searchParams.get('category') || searchParams.get('search') || searchParams.get('price') || searchParams.get('cbd')) && (
                <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  Filtres actifs
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Layout avec filtres fixes et produits scrollables */}
      <div className="flex h-screen">
        {/* Sidebar des filtres - Fixe */}
        <div className="w-80 bg-brand-black border-r border-white/10 flex-shrink-0 overflow-y-auto">
          <div className="p-6">
            {/* Bouton pour fermer les filtres sur mobile */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="text-xl font-semibold text-white">Filtres</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>

            {/* Recherche */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Rechercher des produits...
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    handleSearch(e.target.value)
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  placeholder="Rechercher..."
                />
                <FontAwesomeIcon 
                  icon={faMagnifyingGlass} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* Catégories */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Catégories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryFilter('')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === '' 
                      ? 'bg-brand-gold text-black font-medium' 
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  Toutes les catégories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => handleCategoryFilter(category.slug)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.slug 
                        ? 'bg-brand-gold text-black font-medium' 
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Concentration CBD */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Concentration CBD</h3>
              <div className="space-y-2">
                {[
                  { value: '', label: 'Toutes les concentrations' },
                  { value: 'under-5', label: '5% et moins' },
                  { value: '6-15', label: '6% - 15%' },
                  { value: '16-25', label: '16% - 25%' },
                  { value: 'above-26', label: '26% et plus' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleCbdFilter(option.value)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      searchParams.get('cbd') === option.value 
                        ? 'bg-brand-gold text-black font-medium' 
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gamme de prix */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Gamme de prix</h3>
              <div className="space-y-2">
                {[
                  { value: '', label: 'Tous les prix' },
                  { value: 'under-20', label: 'Moins de 20€' },
                  { value: '20-50', label: '20€ - 50€' },
                  { value: '50-100', label: '50€ - 100€' },
                  { value: 'above-100', label: 'Plus de 100€' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePriceFilter(option.value)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      searchParams.get('price') === option.value 
                        ? 'bg-brand-gold text-black font-medium' 
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Effacer les filtres */}
            <button
              onClick={clearFilters}
              className="w-full bg-red-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Effacer tous les filtres
            </button>
          </div>
        </div>

        {/* Zone principale des produits - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Barre de contrôles */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-white">
                  {pagination.totalProducts} produit{pagination.totalProducts > 1 ? 's' : ''}
                </h2>
                {(searchParams.get('category') || searchParams.get('search') || searchParams.get('price') || searchParams.get('cbd')) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-brand-gold hover:text-yellow-300 transition-colors"
                  >
                    Effacer les filtres
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Tri */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-300">Trier par:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value)
                      handleSort(e.target.value)
                    }}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  >
                    {[
                      { value: 'newest', label: 'Plus récents' },
                      { value: 'price-asc', label: 'Prix: Croissant' },
                      { value: 'price-desc', label: 'Prix: Décroissant' },
                      { value: 'name', label: 'Nom A-Z' }
                    ].map((option) => (
                      <option key={option.value} value={option.value} className="bg-brand-black text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Boutons de vue */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-brand-gold text-black'
                        : 'text-gray-300 hover:text-brand-gold hover:bg-white/5'
                    }`}
                  >
                    <FontAwesomeIcon icon={faTh} className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-brand-gold text-black'
                        : 'text-gray-300 hover:text-brand-gold hover:bg-white/5'
                    }`}
                  >
                    <FontAwesomeIcon icon={faList} className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grille des produits */}
            {products.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                <Suspense fallback={<div className="text-white">Loading...</div>}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </Suspense>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-400 mb-6">
                  Nous n'avons trouvé aucun produit correspondant à vos critères de recherche.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-gold text-black font-semibold py-3 px-6 rounded-lg shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300"
                >
                  Effacer tous les filtres
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <Link
                  href={`/products?${new URLSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    page: (pagination.currentPage - 1).toString()
                  }).toString()}`}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !pagination.hasPrevPage
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Précédent
                </Link>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <Link
                    key={page}
                    href={`/products?${new URLSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      page: page.toString()
                    }).toString()}`}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      page === pagination.currentPage
                        ? 'bg-brand-gold text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {page}
                  </Link>
                ))}

                <Link
                  href={`/products?${new URLSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    page: (pagination.currentPage + 1).toString()
                  }).toString()}`}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !pagination.hasNextPage
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Suivant
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faMagnifyingGlass, 
  faFilter, 
  faTh, 
  faList,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import productsData from '@/data/products.json'

// Transformer les données de l'ancienne structure vers la nouvelle
function transformProduct(product: any) {
  return {
    ...product,
    name: product.title,
    price: product.priceCents / 100, // Convertir les centimes en euros
    image: product.images?.[0] || '/logo.png',
    category: product.categories?.[0]?.name || 'CBD Products',
    rating: 4.5, // Valeur par défaut
    reviewCount: Math.floor(Math.random() * 100) + 10, // Valeur aléatoire
    inStock: product.stock > 0,
    isNew: Math.random() > 0.7, // 30% de chance d'être nouveau
    isBestSeller: Math.random() > 0.8 // 20% de chance d'être best seller
  }
}

function getProducts(searchParams: URLSearchParams) {
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'newest'
  const priceRange = searchParams.get('price')
  const cbdRange = searchParams.get('cbd')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 12
  
  let filteredProducts = productsData
    .filter(product => product.published)
    .map(transformProduct)
  
  // Filtrer par catégorie
  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.categories.some(cat => cat.slug === category)
    )
  }
  
  // Filtrer par recherche
  if (search) {
    const searchLower = search.toLowerCase()
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    )
  }
  
  // Filtrer par gamme de prix
  if (priceRange) {
    filteredProducts = filteredProducts.filter(product => {
      switch (priceRange) {
        case 'under-20':
          return product.price < 20
        case '20-50':
          return product.price >= 20 && product.price <= 50
        case '50-100':
          return product.price >= 50 && product.price <= 100
        case 'above-100':
          return product.price > 100
        default:
          return true
      }
    })
  }
  
  // Filtrer par concentration CBD
  if (cbdRange) {
    filteredProducts = filteredProducts.filter(product => {
      const cbdPercent = product.cbdPercent || 0
      switch (cbdRange) {
        case 'under-5':
          return cbdPercent <= 5
        case '6-15':
          return cbdPercent >= 6 && cbdPercent <= 15
        case '16-25':
          return cbdPercent >= 16 && cbdPercent <= 25
        case 'above-26':
          return cbdPercent >= 26
        default:
          return true
      }
    })
  }
  
  // Trier
  switch (sort) {
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price)
      break
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'newest':
    default:
      // Garder l'ordre original (les premiers produits sont les plus récents)
      break
  }
  
  const totalProducts = filteredProducts.length
  const totalPages = Math.ceil(totalProducts / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
  
  return {
    products: paginatedProducts,
    pagination: {
      currentPage: page,
      totalPages,
      totalProducts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit
    }
  }
}

function getCategories() {
  const categoriesMap = new Map()
  
  productsData.forEach(product => {
    if (product.published && product.categories) {
      product.categories.forEach((category: any) => {
        if (!categoriesMap.has(category.slug)) {
          categoriesMap.set(category.slug, {
            slug: category.slug,
            name: category.name
          })
        }
      })
    }
  })
  
  return Array.from(categoriesMap.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [productsData, setProductsData] = useState(getProducts(searchParams))
  const [categories] = useState(getCategories())
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setProductsData(getProducts(searchParams))
    setSearchTerm(searchParams.get('search') || '')
    setSortBy(searchParams.get('sort') || 'newest')
    setSelectedCategory(searchParams.get('category') || '')
  }, [searchParams])

  const { products, pagination } = productsData

  // Fonction pour gérer la recherche
  const handleSearch = (search: string) => {
    const params = new URLSearchParams(searchParams)
    if (search.trim()) {
      params.set('search', search.trim())
    } else {
      params.delete('search')
    }
    params.delete('page') // Reset à la page 1
    window.history.pushState({}, '', `/products?${params.toString()}`)
  }

  // Fonction pour gérer le tri
  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', sort)
    params.delete('page') // Reset à la page 1
    window.history.pushState({}, '', `/products?${params.toString()}`)
  }

  // Fonction pour gérer les filtres de catégorie
  const handleCategoryFilter = (category: string) => {
    const params = new URLSearchParams(searchParams)
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    params.delete('page') // Reset à la page 1
    window.history.pushState({}, '', `/products?${params.toString()}`)
  }

  // Fonction pour gérer les filtres de prix
  const handlePriceFilter = (priceRange: string) => {
    const params = new URLSearchParams(searchParams)
    if (priceRange) {
      params.set('price', priceRange)
    } else {
      params.delete('price')
    }
    params.delete('page') // Reset à la page 1
    window.history.pushState({}, '', `/products?${params.toString()}`)
  }

  // Fonction pour gérer les filtres de concentration CBD
  const handleCbdFilter = (cbdRange: string) => {
    const params = new URLSearchParams(searchParams)
    if (cbdRange) {
      params.set('cbd', cbdRange)
    } else {
      params.delete('cbd')
    }
    params.delete('page') // Reset à la page 1
    window.history.pushState({}, '', `/products?${params.toString()}`)
  }

  // Fonction pour effacer tous les filtres
  const clearFilters = () => {
    window.history.pushState({}, '', '/products')
  }

  return (
    <div className="min-h-screen bg-brand-black pt-24">
      {/* Header */}
      <div className="bg-brand-black border-b border-white/10">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Notre Collection Premium
              </h1>
              <p className="text-gray-400">
                Découvrez notre sélection soigneusement choisie de produits CBD premium
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-sm font-medium">
                {pagination.totalProducts} produits
              </div>
              {pagination.totalPages > 1 && (
                <div className="bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full text-sm font-medium">
                  Page {pagination.currentPage} sur {pagination.totalPages}
                </div>
              )}
              {(searchParams.get('category') || searchParams.get('search') || searchParams.get('price') || searchParams.get('cbd')) && (
                <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  Filtres actifs
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Layout avec filtres fixes et produits scrollables */}
      <div className="flex h-screen">
        {/* Sidebar des filtres - Fixe */}
        <div className="w-80 bg-brand-black border-r border-white/10 flex-shrink-0 overflow-y-auto">
          <div className="p-6">
            {/* Bouton pour fermer les filtres sur mobile */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="text-xl font-semibold text-white">Filtres</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>

            {/* Recherche */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Rechercher des produits...
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    handleSearch(e.target.value)
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  placeholder="Rechercher..."
                />
                <FontAwesomeIcon 
                  icon={faMagnifyingGlass} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* Catégories */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Catégories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryFilter('')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === '' 
                      ? 'bg-brand-gold text-black font-medium' 
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  Toutes les catégories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => handleCategoryFilter(category.slug)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.slug 
                        ? 'bg-brand-gold text-black font-medium' 
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Concentration CBD */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Concentration CBD</h3>
              <div className="space-y-2">
                {[
                  { value: '', label: 'Toutes les concentrations' },
                  { value: 'under-5', label: '5% et moins' },
                  { value: '6-15', label: '6% - 15%' },
                  { value: '16-25', label: '16% - 25%' },
                  { value: 'above-26', label: '26% et plus' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleCbdFilter(option.value)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      searchParams.get('cbd') === option.value 
                        ? 'bg-brand-gold text-black font-medium' 
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gamme de prix */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Gamme de prix</h3>
              <div className="space-y-2">
                {[
                  { value: '', label: 'Tous les prix' },
                  { value: 'under-20', label: 'Moins de 20€' },
                  { value: '20-50', label: '20€ - 50€' },
                  { value: '50-100', label: '50€ - 100€' },
                  { value: 'above-100', label: 'Plus de 100€' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePriceFilter(option.value)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      searchParams.get('price') === option.value 
                        ? 'bg-brand-gold text-black font-medium' 
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Effacer les filtres */}
            <button
              onClick={clearFilters}
              className="w-full bg-red-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Effacer tous les filtres
            </button>
          </div>
        </div>

        {/* Zone principale des produits - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Barre de contrôles */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-white">
                  {pagination.totalProducts} produit{pagination.totalProducts > 1 ? 's' : ''}
                </h2>
                {(searchParams.get('category') || searchParams.get('search') || searchParams.get('price') || searchParams.get('cbd')) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-brand-gold hover:text-yellow-300 transition-colors"
                  >
                    Effacer les filtres
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Tri */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-300">Trier par:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value)
                      handleSort(e.target.value)
                    }}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  >
                    {[
                      { value: 'newest', label: 'Plus récents' },
                      { value: 'price-asc', label: 'Prix: Croissant' },
                      { value: 'price-desc', label: 'Prix: Décroissant' },
                      { value: 'name', label: 'Nom A-Z' }
                    ].map((option) => (
                      <option key={option.value} value={option.value} className="bg-brand-black text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Boutons de vue */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-brand-gold text-black'
                        : 'text-gray-300 hover:text-brand-gold hover:bg-white/5'
                    }`}
                  >
                    <FontAwesomeIcon icon={faTh} className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-brand-gold text-black'
                        : 'text-gray-300 hover:text-brand-gold hover:bg-white/5'
                    }`}
                  >
                    <FontAwesomeIcon icon={faList} className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grille des produits */}
            {products.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                <Suspense fallback={<div className="text-white">Loading...</div>}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </Suspense>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-400 mb-6">
                  Nous n'avons trouvé aucun produit correspondant à vos critères de recherche.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-gold text-black font-semibold py-3 px-6 rounded-lg shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300"
                >
                  Effacer tous les filtres
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <Link
                  href={`/products?${new URLSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    page: (pagination.currentPage - 1).toString()
                  }).toString()}`}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !pagination.hasPrevPage
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Précédent
                </Link>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <Link
                    key={page}
                    href={`/products?${new URLSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      page: page.toString()
                    }).toString()}`}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      page === pagination.currentPage
                        ? 'bg-brand-gold text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {page}
                  </Link>
                ))}

                <Link
                  href={`/products?${new URLSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    page: (pagination.currentPage + 1).toString()
                  }).toString()}`}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !pagination.hasNextPage
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Suivant
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
