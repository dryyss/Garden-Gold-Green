'use client'

import React, { useState, useMemo } from 'react'
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
  faChevronRight,
  faStar,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from '@/contexts/TranslationContext'

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
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

const articles: Article[] = [
  {
    id: '1',
    title: 'Le Guide Complet du CBD : Bienfaits, Utilisations et Dosage',
    excerpt: 'Apprenez tout ce qu\'il faut savoir sur le CBD, de ses bienfaits potentiels pour la santé aux directives de dosage appropriées.',
    content: 'Le CBD, ou cannabidiol, est l\'un des plus de 100 cannabinoïdes présents dans la plante de cannabis...',
    author: 'Dr. Sarah Johnson',
    publishDate: '2024-01-15',
    readTime: '8 min de lecture',
    category: 'education',
    image: 'https://images.unsplash.com/photo-1599859024952-3430181536b1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['CBD', 'Éducation', 'Santé', 'Bien-être'],
    featured: true,
    difficulty: 'beginner'
  },
  {
    id: '2',
    title: 'Les 5 Meilleurs Produits CBD pour le Stress',
    excerpt: 'Notre sélection des produits CBD les plus efficaces pour gérer le stress et l\'anxiété au quotidien.',
    content: 'Le stress fait partie intégrante de notre vie moderne. Heureusement, le CBD peut nous aider...',
    author: 'Sophie Laurent',
    publishDate: '2024-01-10',
    readTime: '5 min de lecture',
    category: 'wellness',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Stress', 'Anxiété', 'Produits', 'Bien-être'],
    featured: false,
    difficulty: 'intermediate'
  },
  {
    id: '3',
    title: 'CBD et Sommeil : Comment améliorer votre repos',
    excerpt: 'Découvrez comment le CBD peut vous aider à retrouver un sommeil réparateur et naturel.',
    content: 'Un bon sommeil est essentiel pour notre santé physique et mentale. Le CBD peut être un allié précieux...',
    author: 'Jean Martin',
    publishDate: '2024-01-05',
    readTime: '6 min de lecture',
    category: 'wellness',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af01f05e8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Sommeil', 'Repos', 'Santé', 'Bien-être'],
    featured: false,
    difficulty: 'beginner'
  },
  {
    id: '4',
    title: 'CBD vs THC : Comprendre les différences',
    excerpt: 'Une explication claire des différences entre CBD et THC, leurs effets et leurs utilisations respectives.',
    content: 'CBD et THC sont deux cannabinoïdes bien connus, mais souvent confondus...',
    author: 'Dr. Pierre Moreau',
    publishDate: '2024-01-01',
    readTime: '7 min de lecture',
    category: 'science',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['CBD', 'THC', 'Science', 'Éducation'],
    featured: false,
    difficulty: 'intermediate'
  },
  {
    id: '5',
    title: 'Comment choisir la bonne concentration de CBD',
    excerpt: 'Guide pratique pour déterminer la concentration de CBD adaptée à vos besoins et votre expérience.',
    content: 'Choisir la bonne concentration de CBD peut sembler complexe au début...',
    author: 'Lisa Chen',
    publishDate: '2023-12-28',
    readTime: '4 min de lecture',
    category: 'education',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Dosage', 'Concentration', 'Guide', 'Débutant'],
    featured: false,
    difficulty: 'beginner'
  },
  {
    id: '6',
    title: 'CBD et Sport : Optimiser la récupération',
    excerpt: 'Comment le CBD peut améliorer votre récupération sportive et réduire l\'inflammation.',
    content: 'Les athlètes et sportifs découvrent de plus en plus les bienfaits du CBD...',
    author: 'Marc Rodriguez',
    publishDate: '2023-12-25',
    readTime: '5 min de lecture',
    category: 'lifestyle',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Sport', 'Récupération', 'Performance', 'Bien-être'],
    featured: false,
    difficulty: 'intermediate'
  }
]

const categories = [
  { id: 'all', name: 'Tous les articles', icon: faBookOpen },
  { id: 'education', name: 'Éducation', icon: faBookOpen },
  { id: 'wellness', name: 'Bien-être', icon: faHeart },
  { id: 'science', name: 'Science', icon: faFlask },
  { id: 'lifestyle', name: 'Mode de vie', icon: faLeaf },
  { id: 'beginner', name: 'Débutant', icon: faShieldAlt },
  { id: 'advanced', name: 'Avancé', icon: faBrain }
]

export default function LearnPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Filtrer et trier les articles
  const filteredArticles = useMemo(() => {
    let filtered = articles

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => 
        article.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Trier
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        case 'oldest':
          return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
        case 'mostRead':
          return b.readTime.localeCompare(a.readTime)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedCategory, sortBy])

  const featuredArticles = articles.filter(article => article.featured)
  const beginnerArticles = articles.filter(article => article.difficulty === 'beginner')

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-gold/10 to-brand-green/10 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {t('learn.hero.title')}
          </h1>
          <p className="text-lg text-gray-300 mb-4 max-w-3xl mx-auto">
            {t('learn.hero.subtitle')}
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            {t('learn.hero.description')}
          </p>
          
          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder={t('learn.filters.searchPlaceholder')}
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

      {/* Catégories */}
      <section className="py-12 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('learn.sections.categories.title')}
            </h2>
            <p className="text-gray-400">
              {t('learn.sections.categories.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                  selectedCategory === category.id
                    ? 'bg-brand-gold text-black'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <FontAwesomeIcon icon={category.icon} className="text-2xl mb-2" />
                <span className="text-sm font-medium text-center">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles en vedette */}
      {selectedCategory === 'all' && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                {t('learn.sections.featured.title')}
              </h2>
              <p className="text-gray-400">
                {t('learn.sections.featured.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <article key={article.id} className="card-bg rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-brand-gold text-black px-3 py-1 rounded-full text-xs font-semibold">
                      {t('learn.articles.featured')}
                    </div>
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {article.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faUser} />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faClock} />
                          <span>{article.publishDate}</span>
                        </div>
                      </div>
                      <span>{article.readTime}</span>
                    </div>
                    
                    <Link 
                      href={`/learn/${article.id}`}
                      className="inline-flex items-center text-brand-gold hover:text-yellow-300 font-medium transition-colors"
                    >
                      {t('learn.articles.readMore')}
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guide du débutant */}
      {selectedCategory === 'beginner' && (
        <section className="py-16 bg-gradient-to-r from-brand-gold/5 to-brand-green/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                {t('learn.sections.beginner.title')}
              </h2>
              <p className="text-gray-400">
                {t('learn.sections.beginner.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {beginnerArticles.map((article) => (
                <article key={article.id} className="card-bg rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-brand-green text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {t('learn.articles.difficulty.beginner')}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faUser} />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faClock} />
                          <span>{article.publishDate}</span>
                        </div>
                      </div>
                      <span>{article.readTime}</span>
                    </div>
                    
                    <Link 
                      href={`/learn/${article.id}`}
                      className="inline-flex items-center text-brand-gold hover:text-yellow-300 font-medium transition-colors"
                    >
                      {t('learn.articles.readMore')}
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filtres et tri */}
      <section className="py-8 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Tri */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">{t('learn.filters.sortBy')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              >
                <option value="newest">{t('learn.filters.newest')}</option>
                <option value="oldest">{t('learn.filters.oldest')}</option>
                <option value="mostRead">{t('learn.filters.mostRead')}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Tous les articles */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('learn.sections.latest.title')}
            </h2>
            <p className="text-gray-400">
              {t('learn.sections.latest.subtitle')}
            </p>
          </div>
          
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <FontAwesomeIcon icon={faSearch} className="text-6xl text-gray-600 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                {t('learn.articles.noArticles')}
              </h3>
              <p className="text-gray-400">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <article key={article.id} className="card-bg rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    {article.featured && (
                      <div className="absolute top-4 left-4 bg-brand-gold text-black px-3 py-1 rounded-full text-xs font-semibold">
                        {t('learn.articles.featured')}
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {article.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faUser} />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faClock} />
                          <span>{article.publishDate}</span>
                        </div>
                      </div>
                      <span>{article.readTime}</span>
                    </div>
                    
                    <Link 
                      href={`/learn/${article.id}`}
                      className="inline-flex items-center text-brand-gold hover:text-yellow-300 font-medium transition-colors"
                    >
                      {t('learn.articles.readMore')}
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
            {t('learn.cta.title')}
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('learn.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
            >
              {t('learn.cta.button')}
            </Link>
            <Link 
              href="/about" 
              className="bg-transparent border-2 border-brand-green text-brand-green font-semibold py-3 px-8 rounded-full hover:bg-brand-green hover:text-black transition-all"
            >
              {t('learn.cta.learnMore')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
