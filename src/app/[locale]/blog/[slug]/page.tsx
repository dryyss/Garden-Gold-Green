import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCalendar, 
  faUser, 
  faArrowLeft,
  faShare,
  faHeart,
  faBookmark,
  faTag
} from '@fortawesome/free-solid-svg-icons'

// Données fictives pour les articles de blog
const blogPosts = {
  "guide-complet-cbd": {
    id: 1,
    title: "Guide Complet du CBD : Tout ce que vous devez savoir",
    slug: "guide-complet-cbd",
    content: `
      <h2>Qu'est-ce que le CBD ?</h2>
      <p>Le CBD (cannabidiol) est un composé naturel extrait du chanvre, une variété de cannabis. Contrairement au THC, le CBD ne produit pas d'effets psychoactifs et est légal dans de nombreux pays, y compris la France.</p>
      
      <h2>Les Bienfaits du CBD</h2>
      <p>Le CBD est reconnu pour ses nombreuses propriétés thérapeutiques :</p>
      <ul>
        <li><strong>Réduction du stress et de l'anxiété</strong> : Le CBD peut aider à gérer le stress quotidien et les troubles anxieux.</li>
        <li><strong>Amélioration du sommeil</strong> : Il favorise un sommeil plus réparateur et naturel.</li>
        <li><strong>Soulagement de la douleur</strong> : Le CBD possède des propriétés anti-inflammatoires et analgésiques.</li>
        <li><strong>Réduction de l'inflammation</strong> : Il peut aider à réduire l'inflammation chronique.</li>
        <li><strong>Amélioration de l'humeur</strong> : Le CBD peut contribuer à un meilleur équilibre émotionnel.</li>
      </ul>
      
      <h2>Comment Choisir le Bon Produit CBD</h2>
      <p>Voici les critères essentiels à considérer :</p>
      <ol>
        <li><strong>Concentration en CBD</strong> : Commencez par des concentrations faibles (5-10%) et ajustez selon vos besoins.</li>
        <li><strong>Type d'extraction</strong> : Privilégiez les extraits full-spectrum ou broad-spectrum pour l'effet d'entourage.</li>
        <li><strong>Tests de laboratoire</strong> : Vérifiez que le produit est testé par des laboratoires indépendants.</li>
        <li><strong>Origine du chanvre</strong> : Choisissez du chanvre cultivé en Europe, de préférence biologique.</li>
        <li><strong>Méthode d'administration</strong> : Huiles sublinguales, gélules, gummies, crèmes... choisissez selon vos préférences.</li>
      </ol>
      
      <h2>Dosage et Utilisation</h2>
      <p>Le dosage optimal varie selon plusieurs facteurs :</p>
      <ul>
        <li>Votre poids corporel</li>
        <li>Votre expérience avec le CBD</li>
        <li>L'effet recherché</li>
        <li>Votre métabolisme</li>
      </ul>
      <p><strong>Conseil d'expert :</strong> Commencez toujours par la dose la plus faible et augmentez progressivement jusqu'à trouver votre dosage optimal.</p>
      
      <h2>Précautions et Contre-indications</h2>
      <p>Bien que le CBD soit généralement bien toléré, certaines précautions sont à prendre :</p>
      <ul>
        <li>Consultez votre médecin si vous prenez des médicaments</li>
        <li>Évitez pendant la grossesse et l'allaitement</li>
        <li>Respectez les dosages recommandés</li>
        <li>Choisissez des produits de qualité</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Le CBD offre de nombreuses possibilités pour améliorer votre bien-être au quotidien. Chez Garden Gold Green, nous nous engageons à vous fournir des produits de la plus haute qualité, testés en laboratoire et conformes à la réglementation française.</p>
    `,
    author: "Dr. Marie Dubois",
    date: "2024-01-15",
    readTime: "8 min",
    category: "Éducation",
    image: "https://via.placeholder.com/800x400/00C853/FFFFFF?text=CBD+Guide",
    tags: ["CBD", "Bien-être", "Guide", "Éducation"]
  },
  "meilleurs-produits-cbd-stress": {
    id: 2,
    title: "Les 5 Meilleurs Produits CBD pour le Stress",
    slug: "meilleurs-produits-cbd-stress",
    content: `
      <h2>Introduction</h2>
      <p>Le stress fait partie intégrante de notre vie moderne. Heureusement, le CBD peut nous aider à mieux gérer ces moments difficiles. Voici notre sélection des meilleurs produits CBD pour lutter contre le stress.</p>
      
      <h2>1. Huile CBD 10% - Relax</h2>
      <p>Notre huile CBD 10% est parfaite pour les débutants. Sa concentration modérée permet une approche douce du CBD, idéale pour gérer le stress quotidien.</p>
      <p><strong>Avantages :</strong></p>
      <ul>
        <li>Absorption rapide par voie sublinguale</li>
        <li>Dosage précis avec la pipette</li>
        <li>Goût neutre et agréable</li>
        <li>Testé en laboratoire</li>
      </ul>
      
      <h2>2. Gummies CBD 25mg</h2>
      <p>Les gummies CBD offrent une alternative discrète et pratique pour consommer du CBD au travail ou en déplacement.</p>
      <p><strong>Avantages :</strong></p>
      <ul>
        <li>Dosage précis par gomme</li>
        <li>Goût fruité agréable</li>
        <li>Consommation discrète</li>
        <li>Effet prolongé</li>
      </ul>
      
      <h2>3. Capsules CBD 15mg</h2>
      <p>Les capsules sont idéales pour ceux qui préfèrent un dosage fixe et une consommation sans goût.</p>
      
      <h2>4. Vape CBD</h2>
      <p>La vaporisation offre l'absorption la plus rapide du CBD, parfaite pour les moments de stress intense.</p>
      
      <h2>5. Crème CBD Relax</h2>
      <p>L'application topique permet de cibler des zones spécifiques de tension dans le corps.</p>
      
      <h2>Conseils d'Utilisation</h2>
      <p>Pour maximiser les effets anti-stress du CBD :</p>
      <ol>
        <li>Prenez le CBD de manière régulière</li>
        <li>Commencez par de faibles doses</li>
        <li>Associez à des techniques de relaxation</li>
        <li>Maintenez un mode de vie sain</li>
      </ol>
    `,
    author: "Sophie Laurent",
    date: "2024-01-10",
    readTime: "5 min",
    category: "Produits",
    image: "https://via.placeholder.com/800x400/FFD700/000000?text=Stress+Relief",
    tags: ["Stress", "Produits", "CBD", "Bien-être"]
  }
}

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = blogPosts[slug as keyof typeof blogPosts]
  
  if (!post) {
    return {
      title: 'Article non trouvé',
    }
  }

  return {
    title: post.title,
    description: post.content.replace(/<[^>]*>/g, '').substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.replace(/<[^>]*>/g, '').substring(0, 160),
      images: [post.image],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = blogPosts[slug as keyof typeof blogPosts]
  
  if (!post) {
    return (
      <div className="bg-brand-black min-h-screen text-gray-300 pt-36">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Article non trouvé</h1>
          <p className="text-gray-400 mb-8">L'article que vous recherchez n'existe pas.</p>
          <Link href="/blog" className="btn-gold text-black font-bold py-3 px-6 rounded-full">
            Retour au blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-brand-black min-h-screen text-gray-300 pt-36">
      {/* Back Button */}
      <div className="container mx-auto px-6 py-8">
        <Link 
          href="/blog" 
          className="text-gray-400 hover:text-brand-gold transition-colors flex items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Retour au blog
        </Link>
      </div>

      {/* Article Header */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-sm font-semibold">
                {post.category}
              </span>
              <div className="flex items-center text-gray-400 text-sm">
                <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                {new Date(post.date).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                {post.readTime}
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 gold-text-gradient">
              {post.title}
            </h1>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-300">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Par {post.author}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-400 hover:text-brand-gold transition-colors">
                  <FontAwesomeIcon icon={faShare} className="text-xl" />
                </button>
                <button className="text-gray-400 hover:text-brand-gold transition-colors">
                  <FontAwesomeIcon icon={faHeart} className="text-xl" />
                </button>
                <button className="text-gray-400 hover:text-brand-gold transition-colors">
                  <FontAwesomeIcon icon={faBookmark} className="text-xl" />
                </button>
              </div>
            </div>

            <div className="relative h-96 rounded-xl overflow-hidden mb-8">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
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
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                color: '#E0E0E0',
                lineHeight: '1.7'
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
              <FontAwesomeIcon icon={faTag} className="text-brand-gold" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-brand-gold hover:text-black transition-colors cursor-pointer"
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
              <div className="card-bg rounded-xl overflow-hidden group hover:shadow-gold-glow transition-all duration-300">
                <div className="relative h-48">
                  <Image
                    src="https://via.placeholder.com/400x300/00C853/FFFFFF?text=Related+Article"
                    alt="Article similaire"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-brand-gold transition-colors">
                    <Link href="/blog/cbd-sommeil-repos">
                      CBD et Sommeil : Comment améliorer votre repos
                    </Link>
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Découvrez comment le CBD peut vous aider à retrouver un sommeil réparateur...
                  </p>
                  <Link
                    href="/blog/cbd-sommeil-repos"
                    className="text-brand-gold hover:text-brand-gold/80 font-semibold"
                  >
                    Lire la suite →
                  </Link>
                </div>
              </div>

              <div className="card-bg rounded-xl overflow-hidden group hover:shadow-gold-glow transition-all duration-300">
                <div className="relative h-48">
                  <Image
                    src="https://via.placeholder.com/400x300/FFD700/000000?text=Related+Article"
                    alt="Article similaire"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-brand-gold transition-colors">
                    <Link href="/blog/differences-cbd-cbg-cbn">
                      Les Différences entre CBD, CBG et CBN
                    </Link>
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Comprendre les différents cannabinoïdes et leurs effets spécifiques...
                  </p>
                  <Link
                    href="/blog/differences-cbd-cbg-cbn"
                    className="text-brand-gold hover:text-brand-gold/80 font-semibold"
                  >
                    Lire la suite →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
