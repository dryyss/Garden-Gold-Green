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
    excerpt: "Découvrez tout ce qu'il faut savoir sur le CBD : ses bienfaits, son utilisation, les dosages recommandés et les précautions à prendre.",
    content: "Le CBD (cannabidiol) est devenu un sujet de conversation majeur dans le monde du bien-être...",
    author: "Dr. Marie Dubois",
    date: "2024-01-15",
    readTime: "8 min",
    category: "Éducation",
    image: "/logo.png",
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
    image: "/logo2.png",
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
    image: "/logo.png",
    featured: false
  },
  {
    id: 4,
    title: "L'Histoire du Chanvre : De l'Antiquité à nos jours",
    slug: "histoire-chanvre-antiquite",
    excerpt: "Un voyage à travers l'histoire fascinante du chanvre et de son utilisation à travers les âges.",
    content: "Le chanvre accompagne l'humanité depuis des millénaires. Découvrez son histoire riche...",
    author: "Dr. Marie Dubois",
    date: "2024-01-01",
    readTime: "10 min",
    category: "Histoire",
    image: "/logo2.png",
    featured: false
  },
  {
    id: 5,
    title: "CBD et Sport : Optimisez vos performances",
    slug: "cbd-sport-performances",
    excerpt: "Comment le CBD peut aider les sportifs à récupérer plus rapidement et améliorer leurs performances.",
    content: "Les sportifs découvrent de plus en plus les bienfaits du CBD pour la récupération...",
    author: "Sophie Laurent",
    date: "2023-12-28",
    readTime: "7 min",
    category: "Sport",
    image: "/logo.png",
    featured: false
  },
  {
    id: 6,
    title: "Les Différences entre CBD, CBG et CBN",
    slug: "differences-cbd-cbg-cbn",
    excerpt: "Comprendre les différents cannabinoïdes et leurs effets spécifiques sur l'organisme.",
    content: "Le CBD n'est qu'un des nombreux cannabinoïdes présents dans le chanvre. Découvrez les autres...",
    author: "Jean Martin",
    date: "2023-12-25",
    readTime: "9 min",
    category: "Éducation",
    image: "/logo2.png",
    featured: false
  }
]

const categories = ["Tous", "Éducation", "Produits", "Bien-être", "Histoire", "Sport"]

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="bg-brand-black min-h-screen text-gray-300 pt-24">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-brand-gold/10 to-brand-green/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 gold-text-gradient">
              Blog Garden Gold Green
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Découvrez nos articles d'experts sur le CBD, le bien-être et les dernières 
              tendances du secteur.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  category === "Tous"
                    ? "bg-brand-gold text-black"
                    : "bg-white/10 text-gray-300 hover:bg-brand-gold hover:text-black"
                }`}
              >
                <FontAwesomeIcon icon={faTag} className="mr-2" />
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="pb-16">
          <div className="container mx-auto px-6">
            <div className="card-bg rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-80 lg:h-auto">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-brand-gold text-black px-3 py-1 rounded-full text-sm font-bold">
                      Article vedette
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-sm font-semibold">
                      {featuredPost.category}
                    </span>
                    <div className="flex items-center text-gray-400 text-sm">
                      <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                      {new Date(featuredPost.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4 gold-text-gradient">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="btn-gold text-black font-bold py-3 px-6 rounded-full shadow-gold-glow inline-flex items-center"
                  >
                    Lire l'article
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="card-bg rounded-xl overflow-hidden group hover:shadow-gold-glow transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-3 text-sm text-gray-400">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                      {new Date(post.date).toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-brand-gold transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="text-brand-gold hover:text-brand-gold/80 font-semibold inline-flex items-center">
                    Lire la suite
                    <FontAwesomeIcon icon={faArrowRight} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="card-bg rounded-xl p-12 text-center border border-brand-gold/20">
            <h2 className="text-4xl font-bold text-white mb-6 gold-text-gradient">
              Restez informé
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Recevez nos derniers articles et conseils d'experts directement dans votre boîte mail.
            </p>
            <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="input-field flex-1"
              />
              <button
                type="submit"
                className="btn-gold text-black font-bold py-3 px-8 rounded-full shadow-gold-glow whitespace-nowrap"
              >
                S'abonner
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-4">
              Pas de spam, désabonnement possible à tout moment.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
