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

// Données fictives pour le blog
const blogPosts = [
  {
    id: 1,
    title: "Guide Complet du CBD : Tout ce que vous devez savoir",
    slug: "guide-complet-cbd",
    excerpt: "Découvrez tout ce qu&apos;il faut savoir sur le CBD : ses bienfaits, son utilisation, les dosages recommandés et les précautions à prendre.",
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
    excerpt: "Notre sélection des produits CBD les plus efficaces pour gérer le stress et l&apos;anxiété au quotidien.",
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
    title: "La Science derrière le CBD : Recherches et Découvertes",
    slug: "science-cbd-recherches",
    excerpt: "Explorez les dernières recherches scientifiques sur le CBD et ses effets sur le corps humain.",
    content: "La recherche sur le CBD progresse rapidement. De nouvelles études révèlent des bénéfices prometteurs...",
    author: "Dr. Pierre Moreau",
    date: "2024-01-01",
    readTime: "10 min",
    category: "Science",
    image: "https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=Science+CBD",
    featured: true
  },
  {
    id: 5,
    title: "Comment choisir la bonne concentration de CBD ?",
    slug: "choisir-concentration-cbd",
    excerpt: "Un guide pratique pour déterminer la concentration de CBD qui vous convient le mieux.",
    content: "Choisir la bonne concentration de CBD peut sembler complexe. Voici nos conseils d&apos;experts...",
    author: "Lisa Chen",
    date: "2023-12-28",
    readTime: "4 min",
    category: "Guide",
    image: "https://via.placeholder.com/600x400/10B981/FFFFFF?text=Concentration",
    featured: false
  },
  {
    id: 6,
    title: "CBD et Sport : Performance et Récupération",
    slug: "cbd-sport-performance",
    excerpt: "Découvrez comment le CBD peut améliorer vos performances sportives et accélérer votre récupération.",
    content: "Les athlètes découvrent de plus en plus les bénéfices du CBD pour leurs performances...",
    author: "Marc Rodriguez",
    date: "2023-12-20",
    readTime: "7 min",
    category: "Sport",
    image: "https://via.placeholder.com/600x400/F59E0B/FFFFFF?text=Sport+Recovery",
    featured: false
  }
]

const categories = [
  { name: "Tous", slug: "all" },
  { name: "Éducation", slug: "education" },
  { name: "Produits", slug: "produits" },
  { name: "Bien-être", slug: "bien-etre" },
  { name: "Science", slug: "science" },
  { name: "Guide", slug: "guide" },
  { name: "Sport", slug: "sport" }
]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="hero-bg absolute inset-0"></div>
        <div className="hero-overlay absolute inset-0"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Blog <span className="gold-text-gradient">Garden Gold Green</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Découvrez nos articles experts sur le CBD, le bien-être et les dernières tendances du secteur.
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
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <button
                  key={category.slug}
                  className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-full hover:bg-white/20 transition-colors"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Articles en Vedette
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="card-bg rounded-2xl overflow-hidden border border-white/10 hover:border-brand-gold/50 transition-all group"
                  >
                    <div className="relative h-64">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-brand-gold text-black px-3 py-1 rounded-full text-sm font-semibold">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-gold transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <FontAwesomeIcon icon={faUser} />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FontAwesomeIcon icon={faCalendar} />
                            <span>{new Date(post.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                        <span>{post.readTime}</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-brand-gold hover:text-brand-gold/80 font-semibold group-hover:translate-x-1 transition-all"
                      >
                        Lire la suite
                        <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Tous les Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article
                  key={post.id}
                  className="card-bg rounded-2xl overflow-hidden border border-white/10 hover:border-brand-gold/50 transition-all group"
                >
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-brand-gold text-black px-3 py-1 rounded-full text-sm font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-brand-gold transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-2 text-sm">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <FontAwesomeIcon icon={faUser} />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FontAwesomeIcon icon={faCalendar} />
                          <span>{new Date(post.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-brand-gold hover:text-brand-gold/80 font-semibold text-sm group-hover:translate-x-1 transition-all"
                    >
                      Lire la suite
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </Link>
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

