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
    title: 'Le Guide Complet du CBD : Bienfaits, Utilisations et Dosage',
    excerpt: 'Apprenez tout ce qu&apos;il faut savoir sur le CBD, de ses bienfaits potentiels pour la santé aux directives de dosage appropriées.',
    content: 'Le CBD, ou cannabidiol, est l&apos;un des plus de 100 cannabinoïdes présents dans la plante de cannabis...',
    author: 'Dr. Sarah Johnson',
    publishDate: '2024-01-15',
    readTime: '8 min de lecture',
    category: 'education',
    image: 'https://images.unsplash.com/photo-1599859024952-3430181536b1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['CBD', 'Éducation', 'Santé', 'Bien-être'],
    featured: true
  },
  {
    id: '2',
    title: 'CBD et Sommeil : Comment Améliorer Votre Repos',
    excerpt: 'Découvrez comment le CBD peut vous aider à retrouver un sommeil réparateur et naturel.',
    content: 'Un bon sommeil est essentiel pour notre santé physique et mentale. Le CBD peut être un allié précieux...',
    author: 'Dr. Marie Dubois',
    publishDate: '2024-01-10',
    readTime: '6 min de lecture',
    category: 'wellness',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['CBD', 'Sommeil', 'Bien-être', 'Santé'],
    featured: true
  },
  {
    id: '3',
    title: 'La Science derrière le CBD : Recherches et Découvertes',
    excerpt: 'Explorez les dernières recherches scientifiques sur le CBD et ses effets sur le corps humain.',
    content: 'La recherche sur le CBD progresse rapidement. De nouvelles études révèlent des bénéfices prometteurs...',
    author: 'Dr. Pierre Moreau',
    publishDate: '2024-01-05',
    readTime: '10 min de lecture',
    category: 'science',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['CBD', 'Science', 'Recherche', 'Médecine'],
    featured: false
  },
  {
    id: '4',
    title: 'CBD et Stress : Gérer l&apos;Anxiété Naturellement',
    excerpt: 'Apprenez comment le CBD peut vous aider à gérer le stress et l&apos;anxiété au quotidien.',
    content: 'Le stress fait partie intégrante de notre vie moderne. Heureusement, le CBD peut nous aider...',
    author: 'Sophie Laurent',
    publishDate: '2024-01-01',
    readTime: '7 min de lecture',
    category: 'wellness',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['CBD', 'Stress', 'Anxiété', 'Bien-être'],
    featured: false
  },
  {
    id: '5',
    title: 'Comment Choisir le Bon Produit CBD',
    excerpt: 'Un guide complet pour choisir le produit CBD qui correspond le mieux à vos besoins.',
    content: 'Avec tant d&apos;options disponibles, choisir le bon produit CBD peut sembler complexe...',
    author: 'Lisa Chen',
    publishDate: '2023-12-28',
    readTime: '5 min de lecture',
    category: 'guide',
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c43a3e1?q=80&w=2827&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['CBD', 'Guide', 'Produits', 'Conseils'],
    featured: false
  },
  {
    id: '6',
    title: 'CBD et Sport : Performance et Récupération',
    excerpt: 'Découvrez comment le CBD peut améliorer vos performances sportives et accélérer votre récupération.',
    content: 'Les athlètes découvrent de plus en plus les bénéfices du CBD pour leurs performances...',
    author: 'Marc Rodriguez',
    publishDate: '2023-12-20',
    readTime: '6 min de lecture',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['CBD', 'Sport', 'Performance', 'Récupération'],
    featured: false
  }
]

const categories = [
  { id: 'all', name: 'Tous', icon: faBookOpen },
  { id: 'education', name: 'Éducation', icon: faFlask },
  { id: 'wellness', name: 'Bien-être', icon: faHeart },
  { id: 'science', name: 'Science', icon: faBrain },
  { id: 'guide', name: 'Guide', icon: faShieldAlt },
  { id: 'sports', name: 'Sport', icon: faLeaf }
]

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    } else if (sortBy === 'oldest') {
      return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
    } else if (sortBy === 'readTime') {
      return parseInt(a.readTime) - parseInt(b.readTime)
    }
    return 0
  })

  const featuredArticles = filteredArticles.filter(article => article.featured)
  const regularArticles = filteredArticles.filter(article => !article.featured)

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="hero-bg absolute inset-0"></div>
        <div className="hero-overlay absolute inset-0"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Centre d&apos;<span className="gold-text-gradient">Apprentissage</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Découvrez tout ce qu&apos;il faut savoir sur le CBD grâce à nos articles experts, guides pratiques et dernières recherches.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher des articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full border transition-all ${
                    selectedCategory === category.id
                      ? 'bg-brand-gold text-black border-brand-gold'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  <FontAwesomeIcon icon={category.icon} />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex justify-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
              >
                <option value="newest">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="readTime">Temps de lecture</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Articles en Vedette
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredArticles.map((article) => (
                  <article
                    key={article.id}
                    className="card-bg rounded-2xl overflow-hidden border border-white/10 hover:border-brand-gold/50 transition-all group"
                  >
                    <div className="relative h-64">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-brand-gold text-black px-3 py-1 rounded-full text-sm font-semibold">
                          {categories.find(cat => cat.id === article.category)?.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-gold transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <FontAwesomeIcon icon={faUser} />
                            <span>{article.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FontAwesomeIcon icon={faClock} />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                        <span>{new Date(article.publishDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button className="inline-flex items-center text-brand-gold hover:text-brand-gold/80 font-semibold group-hover:translate-x-1 transition-all">
                        Lire l&apos;article
                        <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Regular Articles */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Tous les Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <article
                  key={article.id}
                  className="card-bg rounded-2xl overflow-hidden border border-white/10 hover:border-brand-gold/50 transition-all group"
                >
                  <div className="relative h-48">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-brand-gold text-black px-3 py-1 rounded-full text-sm font-semibold">
                        {categories.find(cat => cat.id === article.category)?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-brand-gold transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-2 text-sm">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <FontAwesomeIcon icon={faUser} />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FontAwesomeIcon icon={faClock} />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <span>{new Date(article.publishDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="inline-flex items-center text-brand-gold hover:text-brand-gold/80 font-semibold text-sm group-hover:translate-x-1 transition-all">
                      Lire l&apos;article
                      <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-r from-brand-gold/10 to-brand-green/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Restez Informé
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Abonnez-vous à notre newsletter pour recevoir les derniers articles et conseils sur le CBD.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
            />
            <button className="btn-gold text-black font-bold px-6 py-3 rounded-full shadow-gold-glow">
              S&apos;abonner
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}