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

function getProducts(searchParams: URLSearchParams) {
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'newest'
  
  let filteredProducts = productsData.filter(product => product.published)
  
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
      product.title.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    )
  }
  
  // Trier
  switch (sort) {
    case 'price-asc':
      filteredProducts.sort((a, b) => a.priceCents - b.priceCents)
      break
    case 'price-desc':
      filteredProducts.sort((a, b) => b.priceCents - a.priceCents)
      break
    case 'name':
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'newest':
    default:
      // Garder l'ordre original (les premiers produits sont les plus récents)
      break
  }
  
  return filteredProducts.slice(0, 12) // Limiter à 12 produits par page
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
  const [products, setProducts] = useState(getProducts(searchParams))
  const [categories] = useState(getCategories())
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')

  useEffect(() => {
    setProducts(getProducts(searchParams))
    setSearchTerm(searchParams.get('search') || '')
    setSortBy(searchParams.get('sort') || 'newest')
    setSelectedCategory(searchParams.get('category') || '')
  }, [searchParams])

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' },
  ]

  return (
    <div className="min-h-screen bg-brand-black pt-24">
      {/* Header */}
      <div className="bg-brand-black border-b border-white/10">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Our Premium Collection
              </h1>
              <p className="text-gray-400">
                Discover our carefully curated selection of premium CBD products
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-sm font-medium">
                {products.length} products
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="card-bg rounded-xl p-6 space-y-6">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faFilter} className="text-brand-gold" />
                <h3 className="font-semibold text-white">Filters</h3>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-medium mb-3 text-white">Categories</h4>
                <div className="space-y-2">
                  <Link
                    href="/products"
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      !selectedCategory 
                        ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold' 
                        : 'text-gray-300 hover:text-brand-gold hover:bg-white/5'
                    }`}
                  >
                    All Categories
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
                <h4 className="font-medium mb-3 text-white">CBD Concentration</h4>
                <div className="space-y-2">
                  <button className="block w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors">
                    5% and below
                  </button>
                  <button className="block w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors">
                    6% - 15%
                  </button>
                  <button className="block w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors">
                    16% - 25%
                  </button>
                  <button className="block w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors">
                    26% and above
                  </button>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium mb-3 text-white">Price Range</h4>
                <div className="space-y-2">
                  <button className="block w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors">
                    Under $20
                  </button>
                  <button className="block w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors">
                    $20 - $50
                  </button>
                  <button className="block w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors">
                    $50 - $100
                  </button>
                  <button className="block w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors">
                    Above $100
                  </button>
                </div>
              </div>
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
                      placeholder="Search products..."
                      className="pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <select
                  className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
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
                  <h3 className="text-lg font-semibold text-white">No products found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search criteria or removing some filters.
                  </p>
                  <Link 
                    href="/products"
                    className="inline-flex items-center text-brand-gold hover:text-yellow-300 transition-colors"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 mr-2" />
                    View all products
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination */}
            {products.length >= 12 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors">
                    Previous
                  </button>
                  <button className="px-3 py-2 bg-brand-gold/20 border border-brand-gold rounded-lg text-brand-gold">
                    1
                  </button>
                  <button className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors">
                    2
                  </button>
                  <button className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors">
                    3
                  </button>
                  <button className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}