'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCalendar, 
  faUser, 
  faArrowRight,
  faSearch,
  faTag
} from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from '@/contexts/TranslationContext'

// Données fictives pour le blog
const blogPosts = [
  {
    id: 1,
    title: "Guide Complet du CBD : Tout ce que vous devez savoir",
    slug: "guide-complet-cbd",
    excerpt: "Découvrez tout ce qu'il faut savoir sur le CBD : ses bienfaits, son utilisation, les dosages recommandés et les précautions à prendre.",
    content: "Le CBD (cannabidiol) est devenu un sujet de conversation majeur dans le monde du bien-être...",
    author: "Dr. Marie Dubois",
    date: "2024-01-15",
    readTime: "8 min",
    category: "Éducation",
    image: "https://via.placeholder.com/600x400/00C853/FFFFFF?text=CBD+Guide",
    featured: true
  },
  {
    id: 2,
    title: "Les 5 Meilleurs Produits CBD pour le Stress",
    slug: "meilleurs-produits-cbd-stress",
    excerpt: "Notre sélection des produits CBD les plus efficaces pour gérer le stress et l'anxiété au quotidien.",
    content: "Le stress fait partie intégrante de notre vie moderne. Heureusement, le CBD peut nous aider...",
    author: "Sophie Laurent",
    date: "2024-01-10",
    readTime: "5 min",
    category: "Produits",
    image: "https://via.placeholder.com/600x400/FFD700/000000?text=Stress+Relief",
    featured: false
  },
  {
    id: 3,
    title: "CBD et Sommeil : Comment améliorer votre repos",
    slug: "cbd-sommeil-repos",
    excerpt: "Découvrez comment le CBD peut vous aider à retrouver un sommeil réparateur et naturel.",
    content: "Un bon sommeil est essentiel pour notre santé physique et mentale. Le CBD peut être un allié précieux...",
    author: "Jean Martin",
    date: "2024-01-05",
    readTime: "6 min",
    category: "Bien-être",
    image: "https://via.placeholder.com/600x400/C0C0C0/000000?text=Sleep+Better",
    featured: false
  },
  {
    id: 4,
    title: "CBD vs THC : Comprendre les différences",
    slug: "cbd-vs-thc-differences",
    excerpt: "Une explication claire des différences entre CBD et THC, leurs effets et leurs utilisations respectives.",
    content: "CBD et THC sont deux cannabinoïdes bien connus, mais souvent confondus...",
    author: "Dr. Pierre Moreau",
    date: "2024-01-01",
    readTime: "7 min",
    category: "Éducation",
    image: "https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=CBD+vs+THC",
    featured: false
  },
  {
    id: 5,
    title: "Comment choisir la bonne concentration de CBD",
    slug: "choisir-concentration-cbd",
    excerpt: "Guide pratique pour déterminer la concentration de CBD adaptée à vos besoins et votre expérience.",
    content: "Choisir la bonne concentration de CBD peut sembler complexe au début...",
    author: "Lisa Chen",
    date: "2023-12-28",
    readTime: "4 min",
    category: "Produits",
    image: "https://via.placeholder.com/600x400/10B981/FFFFFF?text=Concentration",
    featured: false
  },
  {
    id: 6,
    title: "CBD et Sport : Optimiser la récupération",
    slug: "cbd-sport-recuperation",
    excerpt: "Comment le CBD peut améliorer votre récupération sportive et réduire l'inflammation.",
    content: "Les athlètes et sportifs découvrent de plus en plus les bienfaits du CBD...",
    author: "Marc Rodriguez",
    date: "2023-12-25",
    readTime: "5 min",
    category: "Bien-être",
    image: "https://via.placeholder.com/600x400/F59E0B/FFFFFF?text=Sports+Recovery",
    featured: false
  }
]

const categories = [
  { id: 'all', name: 'Tous les articles' },
  { id: 'education', name: 'Éducation' },
  { id: 'products', name: 'Produits' },
  { id: 'wellness', name: 'Bien-être' },
  { id: 'research', name: 'Recherche' },
  { id: 'lifestyle', name: 'Mode de vie' }
]

export default function BlogPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Filtrer et trier les articles
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => 
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Trier
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'mostRead':
          return b.readTime.localeCompare(a.readTime)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-gold/10 to-brand-green/10 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {t('blog.hero.title')}
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('blog.hero.subtitle')}
          </p>
          
          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder={t('blog.hero.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filtres et tri */}
      <section className="py-8 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Catégories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-brand-gold text-black'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Tri */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">{t('blog.filters.sortBy')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              >
                <option value="newest">{t('blog.filters.newest')}</option>
                <option value="oldest">{t('blog.filters.oldest')}</option>
                <option value="mostRead">{t('blog.filters.mostRead')}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <FontAwesomeIcon icon={faSearch} className="text-6xl text-gray-600 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                {t('blog.articles.noArticles')}
              </h3>
              <p className="text-gray-400">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="card-bg rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    {post.featured && (
                      <div className="absolute top-4 left-4 bg-brand-gold text-black px-3 py-1 rounded-full text-xs font-semibold">
                        {t('blog.articles.featured')}
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      <FontAwesomeIcon icon={faTag} className="mr-1" />
                      {post.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faUser} />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faCalendar} />
                          <span>{post.date}</span>
                        </div>
                      </div>
                      <span>{post.readTime} {t('blog.articles.readTime')}</span>
                    </div>
                    
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-brand-gold hover:text-yellow-300 font-medium transition-colors"
                    >
                      {t('blog.articles.readMore')}
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brand-gold/10 to-brand-green/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('blog.cta.title')}
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('blog.cta.subtitle')}
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder={t('blog.cta.emailPlaceholder')}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
            <button className="btn-gold text-black font-semibold px-6 py-3 rounded-lg shadow-gold-glow hover:shadow-gold-glow-lg transition-all">
              {t('blog.cta.subscribe')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
