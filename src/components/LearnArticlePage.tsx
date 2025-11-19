'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft,
  faClock,
  faUser,
  faShare,
  faBookmark,
  faTag,
  faChevronRight
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
    content: `
      <h2>Qu'est-ce que le CBD ?</h2>
      <p>Le CBD, ou cannabidiol, est l'un des plus de 100 cannabinoïdes présents dans la plante de cannabis. Contrairement au THC, le CBD ne produit pas d'effets psychoactifs et est légal dans de nombreux pays, y compris la France.</p>
      
      <h2>Les Bienfaits du CBD</h2>
      <p>Le CBD est reconnu pour ses nombreuses propriétés thérapeutiques :</p>
      <ul>
        <li><strong>Réduction du stress et de l'anxiété</strong> : Le CBD peut aider à gérer le stress quotidien et les troubles anxieux.</li>
        <li><strong>Amélioration du sommeil</strong> : Il favorise un sommeil plus réparateur et naturel.</li>
        <li><strong>Soulagement de la douleur</strong> : Le CBD possède des propriétés anti-inflammatoires et analgésiques.</li>
        <li><strong>Réduction de l'inflammation</strong> : Il peut aider à réduire l'inflammation chronique.</li>
        <li><strong>Amélioration de l'humeur</strong> : Le CBD peut contribuer à un meilleur équilibre émotionnel.</li>
      </ul>
      
      <h2>Comment Utiliser le CBD</h2>
      <p>Il existe plusieurs méthodes d'administration du CBD :</p>
      <ol>
        <li><strong>Huiles sublinguales</strong> : Absorption rapide par la muqueuse buccale (15-30 minutes)</li>
        <li><strong>Gélules</strong> : Absorption lente et prolongée, idéale pour un effet durable</li>
        <li><strong>Gummies</strong> : Alternative discrète et agréable au goût</li>
        <li><strong>Vapotage</strong> : Absorption presque instantanée</li>
        <li><strong>Crèmes topiques</strong> : Application locale pour cibler des zones spécifiques</li>
      </ol>
      
      <h2>Dosage Recommandé</h2>
      <p>Le dosage optimal varie selon plusieurs facteurs : votre poids, votre expérience avec le CBD, l'effet recherché et votre métabolisme. Il est recommandé de commencer par de faibles doses (5-10mg) et d'augmenter progressivement.</p>
    `,
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
    content: `
      <h2>Introduction</h2>
      <p>Le stress fait partie intégrante de notre vie moderne. Heureusement, le CBD peut nous aider à mieux gérer ces moments difficiles. Voici notre sélection des meilleurs produits CBD pour le stress.</p>
      
      <h2>1. Huiles CBD Sublinguales</h2>
      <p>Idéales pour une action rapide contre le stress, les huiles CBD sublinguales sont absorbées par la muqueuse buccale pour une action rapide (15-30 minutes).</p>
      <p><strong>Avantages :</strong></p>
      <ul>
        <li>Action rapide</li>
        <li>Dosage précis</li>
        <li>Facile à utiliser</li>
      </ul>
      <p><strong>Concentration recommandée :</strong> 10-20% pour le stress</p>
      <p><strong>Dosage :</strong> 5-15mg selon l'intensité du stress</p>
      
      <h2>2. Gummies CBD</h2>
      <p>Parfaites pour une consommation discrète et agréable, les gummies CBD offrent un dosage constant et prévisible.</p>
      <p><strong>Avantages :</strong></p>
      <ul>
        <li>Goût agréable</li>
        <li>Dosage fixe</li>
        <li>Pratique</li>
      </ul>
      <p><strong>Concentration recommandée :</strong> 10-25mg par gomme</p>
      <p><strong>Dosage :</strong> 1-2 gummies selon les besoins</p>
      
      <h2>3. Gélules CBD</h2>
      <p>Offrent une absorption lente et prolongée, idéale pour un effet durable tout au long de la journée.</p>
      <p><strong>Avantages :</strong></p>
      <ul>
        <li>Absorption lente</li>
        <li>Effet prolongé</li>
        <li>Sans goût</li>
      </ul>
      <p><strong>Concentration recommandée :</strong> 15-30mg par gélule</p>
      <p><strong>Dosage :</strong> 1-2 gélules matin et soir</p>
      
      <h2>4. Vapote CBD</h2>
      <p>L'inhalation de CBD permet une absorption quasi instantanée, parfaite pour les moments de stress intense.</p>
      <p><strong>Avantages :</strong></p>
      <ul>
        <li>Action immédiate</li>
        <li>Absorption rapide</li>
      </ul>
      <p><strong>Concentration recommandée :</strong> 5-10%</p>
      <p><strong>Dosage :</strong> 2-3 bouffées selon les besoins</p>
      
      <h2>5. Crèmes et Baumes CBD</h2>
      <p>Les produits CBD topiques peuvent aider à réduire les tensions musculaires liées au stress.</p>
    `,
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

interface LearnArticlePageProps {
  articleId: string
}

export default function LearnArticlePage({ articleId }: LearnArticlePageProps) {
  const { t } = useTranslation()
  const article = articles.find(a => a.id === articleId)

  if (!article) {
    return (
      <div className="bg-brand-black min-h-screen text-gray-300 pt-24">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Article non trouvé</h1>
          <p className="text-gray-400 mb-8">L'article que vous recherchez n'existe pas.</p>
          <Link href="/learn" className="btn-gold text-black font-bold py-3 px-6 rounded-full">
            Retour à la section Apprendre
          </Link>
        </div>
      </div>
    )
  }

  const difficultyColors = {
    beginner: 'bg-brand-green/20 text-brand-green',
    intermediate: 'bg-brand-gold/20 text-brand-gold',
    advanced: 'bg-red-500/20 text-red-400'
  }

  const difficultyLabels = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé'
  }

  return (
    <div className="bg-brand-black min-h-screen text-gray-300 pt-24">
      {/* Back Button */}
      <div className="container mx-auto px-6 py-8">
        <Link 
          href="/learn" 
          className="text-gray-400 hover:text-brand-gold transition-colors flex items-center group"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Retour à la section Apprendre
        </Link>
      </div>

      {/* Article Header */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center flex-wrap gap-4 mb-6">
              <span className={`${difficultyColors[article.difficulty]} px-4 py-2 rounded-full text-sm font-semibold`}>
                {difficultyLabels[article.difficulty]}
              </span>
              <span className="bg-brand-green/20 text-brand-green px-4 py-2 rounded-full text-sm font-semibold capitalize">
                {article.category}
              </span>
              <div className="flex items-center text-gray-400 text-sm">
                <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                {new Date(article.publishDate).toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                {article.readTime}
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight gold-text-gradient">
              {article.title}
            </h1>

            <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-300">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Par {article.author}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-400 hover:text-brand-gold transition-colors p-2 hover:bg-white/5 rounded-full">
                  <FontAwesomeIcon icon={faShare} className="text-xl" />
                </button>
                <button className="text-gray-400 hover:text-brand-gold transition-colors p-2 hover:bg-white/5 rounded-full">
                  <FontAwesomeIcon icon={faBookmark} className="text-xl" />
                </button>
              </div>
            </div>

            <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden mb-8">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
              style={{
                color: '#E0E0E0',
                lineHeight: '1.8',
                fontSize: '18px'
              }}
            />
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <FontAwesomeIcon icon={faTag} className="text-brand-gold text-xl" />
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white/10 text-gray-300 px-4 py-2 rounded-full text-sm hover:bg-brand-gold hover:text-black transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-20 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 gold-text-gradient">
              Articles similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles
                .filter(a => a.id !== article.id && a.category === article.category)
                .slice(0, 2)
                .map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/learn/${relatedArticle.id}`}
                    className="card-bg rounded-xl overflow-hidden group hover:shadow-gold-glow transition-all duration-300"
                  >
                    <div className="relative h-48">
                      <Image
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-brand-gold transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="flex items-center text-brand-gold font-semibold">
                        Lire la suite
                        <FontAwesomeIcon icon={faChevronRight} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

