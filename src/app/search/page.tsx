'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch, 
  faArrowLeft, 
  faFilter,
  faTimes,
  faShoppingBag
} from '@fortawesome/free-solid-svg-icons'
import { ProductCard } from '@/components/ProductCard'
import productsData from '@/data/products.json'

interface Product {
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
}

function transformProduct(product: any): Product {
  return {
    ...product,
    name: product.title,
    price: product.priceCents / 100,
    image: product.images?.[0] || '/logo.png',
    category: product.categories?.[0]?.name || 'CBD Products',
    rating: 4.5,
    reviewCount: Math.floor(Math.random() * 100) + 10,
    inStock: product.stock > 0,
    isNew: Math.random() > 0.7,
    isBestSeller: Math.random() > 0.8
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    cbdRange: '',
    sortBy: 'relevance'
  })

  useEffect(() => {
    const query = searchParams.get('q') || ''
    setSearchTerm(query)
    if (query) {
      performSearch(query)
    }
  }, [searchParams])

  const performSearch = async (query: string) => {
    setIsLoading(true)
    
    // Simuler un délai de recherche
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const searchResults = productsData
      .filter(product => product.published)
      .map(transformProduct)
      .filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )
    
    // Appliquer les filtres
    let filteredResults = searchResults
    
    if (filters.category) {
      filteredResults = filteredResults.filter(product => 
        product.category.toLowerCase().includes(filters.category.toLowerCase())
      )
    }
    
    if (filters.priceRange) {
      filteredResults = filteredResults.filter(product => {
        switch (filters.priceRange) {
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
    
    if (filters.cbdRange) {
      filteredResults = filteredResults.filter(product => {
        const cbdPercent = product.cbdPercent || 0
        switch (filters.cbdRange) {
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
    switch (filters.sortBy) {
      case 'price-asc':
        filteredResults.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filteredResults.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filteredResults.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'rating':
        filteredResults.sort((a, b) => b.rating - a.rating)
        break
      case 'relevance':
      default:
        // Garder l'ordre de pertinence
        break
    }
    
    setProducts(filteredResults)
    setIsLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim())
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim())
    }
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      cbdRange: '',
      sortBy: 'relevance'
    })
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim())
    }
  }

  const categories = Array.from(new Set(productsData
    .filter(product => product.published)
    .map(product => product.categories?.[0]?.name)
    .filter(Boolean)
  ))

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/"
              className="text-gray-400 hover:text-brand-gold transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Retour à l'accueil
            </Link>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faSearch} className="text-brand-gold text-xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Recherche</h1>
              <p className="text-gray-400">
                {searchTerm ? `Résultats pour "${searchTerm}"` : 'Trouvez vos produits CBD préférés'}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher des produits CBD..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-gold transition-colors"
              >
                <FontAwesomeIcon icon={faSearch} className="text-xl" />
              </button>
            </div>
          </form>
        </div>

        {/* Filters and Results */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="card-bg rounded-xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Filtres</h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden text-gray-400 hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faFilter} />
                  </button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium text-white mb-3">Catégories</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleFilterChange('category', '')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          filters.category === '' 
                            ? 'bg-brand-gold text-black' 
                            : 'text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        Toutes les catégories
                      </button>
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => handleFilterChange('category', category)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            filters.category === category 
                              ? 'bg-brand-gold text-black' 
                              : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium text-white mb-3">Gamme de prix</h4>
                    <div className="space-y-2">
                      {[
                        { value: '', label: 'Tous les prix' },
                        { value: 'under-20', label: 'Moins de 20€' },
                        { value: '20-50', label: '20€ - 50€' },
                        { value: '50-100', label: '50€ - 100€' },
                        { value: 'above-100', label: 'Plus de 100€' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterChange('priceRange', option.value)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            filters.priceRange === option.value 
                              ? 'bg-brand-gold text-black' 
                              : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CBD Range */}
                  <div>
                    <h4 className="font-medium text-white mb-3">Concentration CBD</h4>
                    <div className="space-y-2">
                      {[
                        { value: '', label: 'Toutes les concentrations' },
                        { value: 'under-5', label: 'Moins de 5%' },
                        { value: '6-15', label: '6% - 15%' },
                        { value: '16-25', label: '16% - 25%' },
                        { value: 'above-26', label: 'Plus de 26%' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterChange('cbdRange', option.value)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            filters.cbdRange === option.value 
                              ? 'bg-brand-gold text-black' 
                              : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <h4 className="font-medium text-white mb-3">Trier par</h4>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    >
                      <option value="relevance">Pertinence</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                      <option value="name">Nom A-Z</option>
                      <option value="rating">Mieux notés</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={clearFilters}
                    className="w-full bg-gray-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Effacer les filtres
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="spinner"></div>
                  <span className="ml-3 text-gray-300">Recherche en cours...</span>
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-300">
                      {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : searchTerm ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Aucun résultat trouvé</h3>
                  <p className="text-gray-400 mb-6">
                    Nous n'avons trouvé aucun produit correspondant à votre recherche "{searchTerm}"
                  </p>
                  <div className="space-y-3">
                    <p className="text-gray-300 text-sm">Suggestions :</p>
                    <ul className="text-gray-400 text-sm space-y-1">
                      <li>• Vérifiez l'orthographe de vos mots-clés</li>
                      <li>• Essayez des mots-clés plus généraux</li>
                      <li>• Utilisez moins de mots-clés</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FontAwesomeIcon icon={faShoppingBag} className="text-brand-gold text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Commencez votre recherche</h3>
                  <p className="text-gray-400">
                    Utilisez la barre de recherche ci-dessus pour trouver vos produits CBD préférés
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch, 
  faArrowLeft, 
  faFilter,
  faTimes,
  faShoppingBag
} from '@fortawesome/free-solid-svg-icons'
import { ProductCard } from '@/components/ProductCard'
import productsData from '@/data/products.json'

interface Product {
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
}

function transformProduct(product: any): Product {
  return {
    ...product,
    name: product.title,
    price: product.priceCents / 100,
    image: product.images?.[0] || '/logo.png',
    category: product.categories?.[0]?.name || 'CBD Products',
    rating: 4.5,
    reviewCount: Math.floor(Math.random() * 100) + 10,
    inStock: product.stock > 0,
    isNew: Math.random() > 0.7,
    isBestSeller: Math.random() > 0.8
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    cbdRange: '',
    sortBy: 'relevance'
  })

  useEffect(() => {
    const query = searchParams.get('q') || ''
    setSearchTerm(query)
    if (query) {
      performSearch(query)
    }
  }, [searchParams])

  const performSearch = async (query: string) => {
    setIsLoading(true)
    
    // Simuler un délai de recherche
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const searchResults = productsData
      .filter(product => product.published)
      .map(transformProduct)
      .filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )
    
    // Appliquer les filtres
    let filteredResults = searchResults
    
    if (filters.category) {
      filteredResults = filteredResults.filter(product => 
        product.category.toLowerCase().includes(filters.category.toLowerCase())
      )
    }
    
    if (filters.priceRange) {
      filteredResults = filteredResults.filter(product => {
        switch (filters.priceRange) {
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
    
    if (filters.cbdRange) {
      filteredResults = filteredResults.filter(product => {
        const cbdPercent = product.cbdPercent || 0
        switch (filters.cbdRange) {
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
    switch (filters.sortBy) {
      case 'price-asc':
        filteredResults.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filteredResults.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filteredResults.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'rating':
        filteredResults.sort((a, b) => b.rating - a.rating)
        break
      case 'relevance':
      default:
        // Garder l'ordre de pertinence
        break
    }
    
    setProducts(filteredResults)
    setIsLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim())
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim())
    }
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      cbdRange: '',
      sortBy: 'relevance'
    })
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim())
    }
  }

  const categories = Array.from(new Set(productsData
    .filter(product => product.published)
    .map(product => product.categories?.[0]?.name)
    .filter(Boolean)
  ))

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/"
              className="text-gray-400 hover:text-brand-gold transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Retour à l'accueil
            </Link>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faSearch} className="text-brand-gold text-xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Recherche</h1>
              <p className="text-gray-400">
                {searchTerm ? `Résultats pour "${searchTerm}"` : 'Trouvez vos produits CBD préférés'}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher des produits CBD..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-gold transition-colors"
              >
                <FontAwesomeIcon icon={faSearch} className="text-xl" />
              </button>
            </div>
          </form>
        </div>

        {/* Filters and Results */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="card-bg rounded-xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Filtres</h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden text-gray-400 hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faFilter} />
                  </button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium text-white mb-3">Catégories</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleFilterChange('category', '')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          filters.category === '' 
                            ? 'bg-brand-gold text-black' 
                            : 'text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        Toutes les catégories
                      </button>
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => handleFilterChange('category', category)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            filters.category === category 
                              ? 'bg-brand-gold text-black' 
                              : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium text-white mb-3">Gamme de prix</h4>
                    <div className="space-y-2">
                      {[
                        { value: '', label: 'Tous les prix' },
                        { value: 'under-20', label: 'Moins de 20€' },
                        { value: '20-50', label: '20€ - 50€' },
                        { value: '50-100', label: '50€ - 100€' },
                        { value: 'above-100', label: 'Plus de 100€' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterChange('priceRange', option.value)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            filters.priceRange === option.value 
                              ? 'bg-brand-gold text-black' 
                              : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CBD Range */}
                  <div>
                    <h4 className="font-medium text-white mb-3">Concentration CBD</h4>
                    <div className="space-y-2">
                      {[
                        { value: '', label: 'Toutes les concentrations' },
                        { value: 'under-5', label: 'Moins de 5%' },
                        { value: '6-15', label: '6% - 15%' },
                        { value: '16-25', label: '16% - 25%' },
                        { value: 'above-26', label: 'Plus de 26%' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterChange('cbdRange', option.value)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            filters.cbdRange === option.value 
                              ? 'bg-brand-gold text-black' 
                              : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <h4 className="font-medium text-white mb-3">Trier par</h4>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    >
                      <option value="relevance">Pertinence</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                      <option value="name">Nom A-Z</option>
                      <option value="rating">Mieux notés</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={clearFilters}
                    className="w-full bg-gray-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Effacer les filtres
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="spinner"></div>
                  <span className="ml-3 text-gray-300">Recherche en cours...</span>
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-300">
                      {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : searchTerm ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Aucun résultat trouvé</h3>
                  <p className="text-gray-400 mb-6">
                    Nous n'avons trouvé aucun produit correspondant à votre recherche "{searchTerm}"
                  </p>
                  <div className="space-y-3">
                    <p className="text-gray-300 text-sm">Suggestions :</p>
                    <ul className="text-gray-400 text-sm space-y-1">
                      <li>• Vérifiez l'orthographe de vos mots-clés</li>
                      <li>• Essayez des mots-clés plus généraux</li>
                      <li>• Utilisez moins de mots-clés</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FontAwesomeIcon icon={faShoppingBag} className="text-brand-gold text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Commencez votre recherche</h3>
                  <p className="text-gray-400">
                    Utilisez la barre de recherche ci-dessus pour trouver vos produits CBD préférés
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
