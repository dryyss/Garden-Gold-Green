'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch, 
  faFilter, 
  faClock, 
  faUser,
  faBookOpen,
  faFlask,
  faLeaf,
  faHeart,
  faBrain,
  faShieldAlt,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  readTime: string
  category: string
  image: string
  tags: string[]
  featured: boolean
}

const articles: Article[] = [
  {
    id: '1',
    title: 'The Complete Guide to CBD: Benefits, Uses, and Dosage',
    excerpt: 'Learn everything you need to know about CBD, from its potential health benefits to proper dosing guidelines.',
    content: 'CBD, or cannabidiol, is one of over 100 cannabinoids found in the cannabis plant...',
    author: 'Dr. Sarah Johnson',
    publishDate: '2024-01-15',
    readTime: '8 min read',
    category: 'education',
    image: 'https://images.unsplash.com/photo-1599859024952-3430181536b1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['CBD', 'Education', 'Health', 'Wellness'],
    featured: true
  },
  {
    id: '2',
    title: 'Understanding the Endocannabinoid System',
    excerpt: 'Discover how your body\'s endocannabinoid system works and why it\'s crucial for overall health.',
    content: 'The endocannabinoid system (ECS) is a complex cell-signaling system that plays a crucial role...',
    author: 'Dr. Mike Rodriguez',
    publishDate: '2024-01-12',
    readTime: '6 min read',
    category: 'science',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Science', 'ECS', 'Biology', 'Research'],
    featured: true
  },
  {
    id: '3',
    title: 'CBD for Sleep: A Natural Solution for Better Rest',
    excerpt: 'Explore how CBD can help improve sleep quality and address common sleep issues.',
    content: 'Sleep is essential for our physical and mental health, yet millions of people struggle...',
    author: 'Dr. Emily Chen',
    publishDate: '2024-01-10',
    readTime: '5 min read',
    category: 'health',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Sleep', 'Health', 'Wellness', 'CBD'],
    featured: false
  },
  {
    id: '4',
    title: 'The Science Behind Full-Spectrum vs. Isolate CBD',
    excerpt: 'Learn about the differences between full-spectrum and isolate CBD products.',
    content: 'When choosing CBD products, you\'ll often see terms like "full-spectrum" and "isolate"...',
    author: 'Dr. Sarah Johnson',
    publishDate: '2024-01-08',
    readTime: '7 min read',
    category: 'science',
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Science', 'Full-Spectrum', 'Isolate', 'Research'],
    featured: false
  },
  {
    id: '5',
    title: 'CBD and Anxiety: What the Research Shows',
    excerpt: 'Discover the latest research on CBD\'s potential benefits for anxiety and stress management.',
    content: 'Anxiety disorders affect millions of people worldwide, and many are turning to CBD...',
    author: 'Dr. Mike Rodriguez',
    publishDate: '2024-01-05',
    readTime: '6 min read',
    category: 'health',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Anxiety', 'Mental Health', 'Research', 'CBD'],
    featured: false
  },
  {
    id: '6',
    title: 'How to Choose the Right CBD Product for You',
    excerpt: 'A comprehensive guide to selecting the perfect CBD product based on your needs and preferences.',
    content: 'With so many CBD products on the market, choosing the right one can be overwhelming...',
    author: 'Dr. Emily Chen',
    publishDate: '2024-01-03',
    readTime: '9 min read',
    category: 'education',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Guide', 'Products', 'Education', 'Choosing'],
    featured: false
  }
]

const categories = [
  { id: 'all', name: 'All Articles', icon: faBookOpen },
  { id: 'education', name: 'Education', icon: faBookOpen },
  { id: 'science', name: 'Science', icon: faFlask },
  { id: 'health', name: 'Health', icon: faHeart },
  { id: 'wellness', name: 'Wellness', icon: faLeaf },
  { id: 'research', name: 'Research', icon: faBrain },
  { id: 'safety', name: 'Safety', icon: faShieldAlt }
]

export default function LearnPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTag, setSelectedTag] = useState('')

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesTag = !selectedTag || article.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
    return matchesSearch && matchesCategory && matchesTag
  })

  const featuredArticles = filteredArticles.filter(article => article.featured)
  const regularArticles = filteredArticles.filter(article => !article.featured)

  const allTags = Array.from(new Set(articles.flatMap(article => article.tags)))

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="hero-bg absolute inset-0"></div>
        <div className="hero-overlay absolute inset-0"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Learn About <span className="gold-text-gradient">CBD</span>
            </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover the science, benefits, and proper use of CBD through our comprehensive 
            educational resources and expert insights.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        {/* Search and Filter */}
        <div className="card-bg rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1 relative">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300"
              />
          </div>
          
            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
                </div>
              </div>

          {/* Tags */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  !selectedTag 
                    ? 'bg-brand-gold text-black' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                All Tags
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTag === tag 
                      ? 'bg-brand-gold text-black' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {tag}
                </button>
            ))}
          </div>
        </div>
        </div>

      {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <div key={article.id} className="card-bg rounded-xl overflow-hidden group">
                  <div className="relative h-64 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                      width={600}
                      height={256}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                      <span className="bg-brand-gold text-black text-xs font-semibold px-2 py-1 rounded-full">
                        Featured
                    </span>
                  </div>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faUser} />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-gold transition-colors">
                      {article.title}
                  </h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                  <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    <Link
                        href={`/learn/${article.id}`}
                        className="text-brand-gold hover:text-brand-gold/80 transition-colors flex items-center gap-1"
                    >
                        Read More
                        <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                    </Link>
                  </div>
                </div>
                </div>
            ))}
          </div>
        </div>
        )}

        {/* Regular Articles */}
        {regularArticles.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">All Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <div key={article.id} className="card-bg rounded-xl overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                <Image
                      src={article.image}
                      alt={article.title}
                      width={400}
                      height={192}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
              </div>
              <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faUser} />
                        <span>{article.author}</span>
                </div>
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} />
                        <span>{article.readTime}</span>
              </div>
            </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-brand-gold transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-2 text-sm">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                </div>
                      <Link
                        href={`/learn/${article.id}`}
                        className="text-brand-gold hover:text-brand-gold/80 transition-colors flex items-center gap-1"
                      >
                        Read
                        <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                      </Link>
                </div>
              </div>
            </div>
              ))}
          </div>
        </div>
        )}

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <FontAwesomeIcon icon={faBookOpen} className="text-6xl text-gray-600 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No Articles Found</h2>
            <p className="text-gray-400 mb-8">
              Try adjusting your search terms, category, or tag filters.
            </p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16">
          <div className="card-bg rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated with the Latest CBD Research
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Get the latest articles, research updates, and product news delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300"
              />
              <button className="btn-gold text-black font-semibold py-3 px-6 rounded-lg shadow-gold-glow">
                Subscribe
              </button>
            </div>
          </div>
        </div>
    </div>
    </main>
  )
}