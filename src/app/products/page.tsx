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
  // Extraire les catégories uniques des produits
  const categoriesMap = new Map()
  productsData.forEach(product => {
    product.categories.forEach(category => {
      if (!categoriesMap.has(category.slug)) {
        categoriesMap.set(category.slug, category)
      }
    })
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

  const sortOptions = [
    { value: 'newest', label: 'Plus récents' },
    { value: 'price-asc', label: 'Prix: Croissant' },
    { value: 'price-desc', label: 'Prix: Décroissant' },
    { value: 'name', label: 'Nom A-Z' },
  ]

  // Fonction pour gérer la recherche
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('search', term)
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

  // Fonction pour gérer les filtres de prix
  const handlePriceFilter = (priceRange: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('price', priceRange)
    params.delete('page') // Reset à la page 1
    window.history.pushState({}, '', `/products?${params.toString()}`)
  }

  // Fonction pour gérer les filtres de concentration CBD
  const handleCbdFilter = (cbdRange: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('cbd', cbdRange)
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="card-bg rounded-xl p-6 space-y-6">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faFilter} className="text-brand-gold" />
                <h3 className="font-semibold text-white">Filtres</h3>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-medium mb-3 text-white">Catégories</h4>
                <div className="space-y-2">
                  <Link
                    href="/products"
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      !selectedCategory 
                        ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold' 
                        : 'text-gray-300 hover:text-brand-gold hover:bg-white/5'
                    }`}
                  >
                    Toutes les catégories
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/products?category=${category.slug}`}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.slug
                          ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold' 
                          : 'text-gray-300 hover:text-brand-gold hover:bg-white/5'
                      }`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CBD Percentage */}
              <div>
                <h4 className="font-medium mb-3 text-white">Concentration CBD</h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleCbdFilter('under-5')}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      searchParams.get('cbd') === 'under-5'
                        ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold'
                        : 'text-gray-300 hover:text-brand-gold hover:bg-white/5'
                    }`}
                  >
                    5% et moins
                  </button>
                  <button 
                    onClick={() => handleCbdFilter('6-15')}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      searchParams.get('cbd') === '6-15'
                        ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold'
                        : 'text-gray-300 hover:text-brand-gold hover:bg-white/5'
                    }`}
                  >
                    6% - 15%
                  </button>
                  <button 
                    onClick={() => handleCbdFilter('16-25')}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      searchParams.get('cbd') === '16-25'
                        ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold'
                        : 'text-gray-300 hover:text-brand-gold hover:bg-white/5'
                    }`}
                  >
                    16% - 25%
                  </button>
                  <button 
                    onClick={() => handleCbdFilter('above-26')}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      searchParams.get('cbd') === 'above-26'
                        ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold'
                        : 'text-gray-300 hover:text-brand-gold hover:bg-white/5'
                    }`}
                  >
                    26% et plus
                  </button>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium mb-3 text-white">Gamme de prix</h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => handlePriceFilter('under-20')}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      searchParams.get('price') === 'under-20'
                        ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold'
                        : 'text-gray-300 hover:text-brand-gold hover:bg-white/5'
                    }`}
                  >
                    Moins de 20€
                  </button>
                  <button 
                    onClick={() => handlePriceFilter('20-50')}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      searchParams.get('price') === '20-50'
                        ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold'
                        : 'text-gray-300 hover:text-brand-gold hover:bg-white/5'
                    }`}
                  >
                    20€ - 50€
                  </button>
                  <button 
                    onClick={() => handlePriceFilter('50-100')}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      searchParams.get('price') === '50-100'
                        ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold'
                        : 'text-gray-300 hover:text-brand-gold hover:bg-white/5'
                    }`}
                  >
                    50€ - 100€
                  </button>
                  <button 
                    onClick={() => handlePriceFilter('above-100')}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      searchParams.get('price') === 'above-100'
                        ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold'
                        : 'text-gray-300 hover:text-brand-gold hover:bg-white/5'
                    }`}
                  >
                    Plus de 100€
                  </button>
                </div>
              </div>

              {/* Clear Filters */}
              {(searchParams.get('category') || searchParams.get('search') || searchParams.get('price') || searchParams.get('cbd')) && (
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={clearFilters}
                    className="w-full text-center px-3 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
                  >
                    Effacer tous les filtres
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <FontAwesomeIcon 
                    icon={faMagnifyingGlass} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
                  />
                    <input
                      type="text"
                      placeholder="Rechercher des produits..."
                      className="pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        // Debounce la recherche
                        clearTimeout(window.searchTimeout)
                        window.searchTimeout = setTimeout(() => {
                          handleSearch(e.target.value)
                        }, 500)
                      }}
                    />
                </div>
                
                <select
                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value)
                    handleSort(e.target.value)
                  }}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-brand-black text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg bg-brand-gold/20 text-brand-gold border border-brand-gold">
                  <FontAwesomeIcon icon={faTh} className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-lg text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors">
                  <FontAwesomeIcon icon={faList} className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
              <div className="card-bg rounded-xl p-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Aucun produit trouvé</h3>
                  <p className="text-gray-400">
                    Essayez d'ajuster vos critères de recherche ou de supprimer certains filtres.
                  </p>
                  <Link 
                    href="/products"
                    className="inline-flex items-center text-brand-gold hover:text-yellow-300 transition-colors"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 mr-2" />
                    Voir tous les produits
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  {/* Bouton Précédent */}
                  <Link
                    href={`/products?${new URLSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      page: (pagination.currentPage - 1).toString()
                    }).toString()}`}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      pagination.hasPrevPage
                        ? 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                        : 'bg-gray-600/20 border border-gray-600/20 text-gray-500 cursor-not-allowed'
                    }`}
                    style={{ pointerEvents: pagination.hasPrevPage ? 'auto' : 'none' }}
                  >
                    Précédent
                  </Link>

                  {/* Numéros de page */}
                  {(() => {
                    const pages = []
                    const startPage = Math.max(1, pagination.currentPage - 2)
                    const endPage = Math.min(pagination.totalPages, pagination.currentPage + 2)

                    // Page 1
                    if (startPage > 1) {
                      pages.push(
                        <Link
                          key={1}
                          href={`/products?${new URLSearchParams({
                            ...Object.fromEntries(searchParams.entries()),
                            page: '1'
                          }).toString()}`}
                          className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
                        >
                          1
                        </Link>
                      )
                      if (startPage > 2) {
                        pages.push(
                          <span key="ellipsis1" className="px-2 text-gray-400">
                            ...
                          </span>
                        )
                      }
                    }

                    // Pages du milieu
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <Link
                          key={i}
                          href={`/products?${new URLSearchParams({
                            ...Object.fromEntries(searchParams.entries()),
                            page: i.toString()
                          }).toString()}`}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            i === pagination.currentPage
                              ? 'bg-brand-gold/20 border border-brand-gold text-brand-gold'
                              : 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                          }`}
                        >
                          {i}
                        </Link>
                      )
                    }

                    // Dernière page
                    if (endPage < pagination.totalPages) {
                      if (endPage < pagination.totalPages - 1) {
                        pages.push(
                          <span key="ellipsis2" className="px-2 text-gray-400">
                            ...
                          </span>
                        )
                      }
                      pages.push(
                        <Link
                          key={pagination.totalPages}
                          href={`/products?${new URLSearchParams({
                            ...Object.fromEntries(searchParams.entries()),
                            page: pagination.totalPages.toString()
                          }).toString()}`}
                          className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
                        >
                          {pagination.totalPages}
                        </Link>
                      )
                    }

                    return pages
                  })()}

                  {/* Bouton Suivant */}
                  <Link
                    href={`/products?${new URLSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      page: (pagination.currentPage + 1).toString()
                    }).toString()}`}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      pagination.hasNextPage
                        ? 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                        : 'bg-gray-600/20 border border-gray-600/20 text-gray-500 cursor-not-allowed'
                    }`}
                    style={{ pointerEvents: pagination.hasNextPage ? 'auto' : 'none' }}
                  >
                    Suivant
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}