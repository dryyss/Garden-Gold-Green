'use client'

import { useParams } from 'next/navigation'
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
  faTag,
  faClock
} from '@fortawesome/free-solid-svg-icons'

// Données réelles pour les articles de blog
const blogPosts = {
  "guide-complet-cbd": {
    id: 1,
    title: "Guide Complet du CBD : Tout ce que vous devez savoir",
    slug: "guide-complet-cbd",
    excerpt: "Découvrez tout ce qu'il faut savoir sur le CBD : ses bienfaits, son utilisation, les dosages recommandés et les précautions à prendre.",
    content: `
      <div class="prose prose-invert prose-lg max-w-none">
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
        
        <p><strong>Conseil d'expert :</strong> Commencez toujours par de faibles doses (5-10mg) et augmentez progressivement jusqu'à trouver votre dose optimale.</p>
        
        <h2>Précautions et Contre-indications</h2>
        <p>Bien que le CBD soit généralement bien toléré, il est important de :</p>
        <ul>
          <li>Consulter un professionnel de santé avant utilisation</li>
          <li>Vérifier les interactions médicamenteuses</li>
          <li>Respecter les dosages recommandés</li>
          <li>Choisir des produits de qualité certifiée</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Le CBD offre de nombreux avantages potentiels pour la santé et le bien-être. En choisissant des produits de qualité et en respectant les bonnes pratiques d'utilisation, vous pourrez profiter pleinement de ses bienfaits.</p>
      </div>
    `,
    author: "Dr. Marie Dubois",
    date: "2024-01-15",
    readTime: "8 min",
    category: "Éducation",
    image: "https://images.unsplash.com/photo-1599859024952-3430181536b1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    featured: true,
    tags: ["CBD", "Éducation", "Bien-être", "Guide"]
  },
  "meilleurs-produits-cbd-stress": {
    id: 2,
    title: "Les 5 Meilleurs Produits CBD pour le Stress",
    slug: "meilleurs-produits-cbd-stress",
    excerpt: "Notre sélection des produits CBD les plus efficaces pour gérer le stress et l'anxiété au quotidien.",
    content: `
      <div class="prose prose-invert prose-lg max-w-none">
        <h2>Introduction</h2>
        <p>Le stress fait partie intégrante de notre vie moderne. Heureusement, le CBD peut nous aider à mieux gérer ces moments difficiles. Voici notre sélection des meilleurs produits CBD pour le stress.</p>
        
        <h2>1. Huiles CBD Sublinguales</h2>
        <p>Les huiles CBD sublinguales sont idéales pour un soulagement rapide du stress. L'absorption par la muqueuse buccale permet une action rapide en 15-30 minutes.</p>
        <ul>
          <li><strong>Avantages :</strong> Action rapide, dosage précis, facile à utiliser</li>
          <li><strong>Concentration recommandée :</strong> 10-20% pour le stress</li>
          <li><strong>Dosage :</strong> 5-15mg selon l'intensité du stress</li>
        </ul>
        
        <h2>2. Gummies CBD</h2>
        <p>Parfaites pour une consommation discrète et agréable, les gummies CBD offrent un dosage constant et prévisible.</p>
        <ul>
          <li><strong>Avantages :</strong> Goût agréable, dosage fixe, pratique</li>
          <li><strong>Concentration recommandée :</strong> 10-25mg par gummy</li>
          <li><strong>Dosage :</strong> 1-2 gummies selon les besoins</li>
        </ul>
        
        <h2>3. Gélules CBD</h2>
        <p>Les gélules offrent une absorption lente et prolongée, idéale pour un effet durable tout au long de la journée.</p>
        <ul>
          <li><strong>Avantages :</strong> Absorption lente, effet prolongé, sans goût</li>
          <li><strong>Concentration recommandée :</strong> 15-30mg par gélule</li>
          <li><strong>Dosage :</strong> 1-2 gélules matin et soir</li>
        </ul>
        
        <h2>4. Vapote CBD</h2>
        <p>L'inhalation de CBD permet une absorption quasi-instantanée, parfaite pour les moments de stress intense.</p>
        <ul>
          <li><strong>Avantages :</strong> Action immédiate, absorption rapide</li>
          <li><strong>Concentration recommandée :</strong> 5-10%</li>
          <li><strong>Dosage :</strong> 2-3 bouffées selon les besoins</li>
        </ul>
        
        <h2>5. Crèmes et Baumes CBD</h2>
        <p>Les topiques CBD peuvent aider à réduire la tension musculaire liée au stress.</p>
        <ul>
          <li><strong>Avantages :</strong> Application locale, soulagement ciblé</li>
          <li><strong>Concentration recommandée :</strong> 100-500mg par pot</li>
          <li><strong>Application :</strong> 2-3 fois par jour sur les zones tendues</li>
        </ul>
        
        <h2>Conseils d'Utilisation</h2>
        <p>Pour maximiser les effets anti-stress du CBD :</p>
        <ul>
          <li>Utilisez régulièrement pour des effets durables</li>
          <li>Combinez avec des techniques de relaxation</li>
          <li>Respectez les dosages recommandés</li>
          <li>Choisissez des produits de qualité certifiée</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Le CBD peut être un excellent allié pour gérer le stress quotidien. Choisissez le format qui vous convient le mieux et n'hésitez pas à consulter un professionnel de santé pour un accompagnement personnalisé.</p>
      </div>
    `,
    author: "Sophie Laurent",
    date: "2024-01-10",
    readTime: "5 min",
    category: "Produits",
    image: "https://images.unsplash.com/photo-1544367524-897229736294?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    featured: false,
    tags: ["CBD", "Stress", "Produits", "Bien-être"]
  },
  "cbd-sommeil-repos": {
    id: 3,
    title: "CBD et Sommeil : Comment améliorer votre repos",
    slug: "cbd-sommeil-repos",
    excerpt: "Découvrez comment le CBD peut vous aider à retrouver un sommeil réparateur et naturel.",
    content: `
      <div class="prose prose-invert prose-lg max-w-none">
        <h2>Le Sommeil et le CBD</h2>
        <p>Un bon sommeil est essentiel pour notre santé physique et mentale. Le CBD peut être un allié précieux pour améliorer la qualité de votre repos nocturne.</p>
        
        <h2>Comment le CBD Améliore le Sommeil</h2>
        <p>Le CBD agit sur plusieurs mécanismes pour favoriser un meilleur sommeil :</p>
        <ul>
          <li><strong>Réduction de l'anxiété</strong> : Il aide à calmer l'esprit et à réduire les pensées anxieuses</li>
          <li><strong>Régulation du cycle circadien</strong> : Il peut aider à synchroniser votre horloge biologique</li>
          <li><strong>Soulagement de la douleur</strong> : Il réduit les douleurs qui peuvent perturber le sommeil</li>
          <li><strong>Amélioration de la phase REM</strong> : Il favorise un sommeil plus profond et réparateur</li>
        </ul>
        
        <h2>Meilleurs Produits CBD pour le Sommeil</h2>
        
        <h3>1. Huiles CBD avec Mélatonine</h3>
        <p>La combinaison CBD + mélatonine est particulièrement efficace pour l'endormissement.</p>
        <ul>
          <li>Dosage recommandé : 10-25mg de CBD + 1-3mg de mélatonine</li>
          <li>Prise : 30-60 minutes avant le coucher</li>
        </ul>
        
        <h3>2. Gummies CBD Sommeil</h3>
        <p>Les gummies sont pratiques et souvent enrichies en herbes relaxantes.</p>
        <ul>
          <li>Dosage recommandé : 15-30mg de CBD</li>
          <li>Prise : 1-2 gummies 1 heure avant le coucher</li>
        </ul>
        
        <h3>3. Thés CBD Relaxants</h3>
        <p>Les infusions CBD combinent relaxation et hydratation.</p>
        <ul>
          <li>Dosage recommandé : 5-15mg de CBD</li>
          <li>Prise : 1-2 heures avant le coucher</li>
        </ul>
        
        <h2>Conseils pour Optimiser l'Effet Sommeil</h2>
        <ul>
          <li><strong>Timing</strong> : Prenez le CBD 30-60 minutes avant le coucher</li>
          <li><strong>Routine</strong> : Créez une routine relaxante avant le coucher</li>
          <li><strong>Environnement</strong> : Assurez-vous que votre chambre est sombre et fraîche</li>
          <li><strong>Écrans</strong> : Évitez les écrans 1 heure avant le coucher</li>
          <li><strong>Régularité</strong> : Utilisez le CBD de manière régulière pour des effets durables</li>
        </ul>
        
        <h2>Dosage Recommandé</h2>
        <p>Le dosage optimal varie selon plusieurs facteurs :</p>
        <ul>
          <li><strong>Débutant</strong> : 5-10mg de CBD</li>
          <li><strong>Intermédiaire</strong> : 10-20mg de CBD</li>
          <li><strong>Expérimenté</strong> : 20-40mg de CBD</li>
        </ul>
        
        <h2>Précautions</h2>
        <ul>
          <li>Commencez toujours par de faibles doses</li>
          <li>Consultez un professionnel de santé si vous prenez des médicaments</li>
          <li>Évitez l'alcool en combinaison avec le CBD</li>
          <li>Testez d'abord en week-end pour évaluer les effets</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Le CBD peut être un excellent complément pour améliorer la qualité de votre sommeil. Associé à une bonne hygiène de vie, il peut vous aider à retrouver un repos réparateur et naturel.</p>
      </div>
    `,
    author: "Jean Martin",
    date: "2024-01-05",
    readTime: "6 min",
    category: "Bien-être",
    image: "https://images.unsplash.com/photo-1579126038374-6064e937166e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    featured: false,
    tags: ["CBD", "Sommeil", "Bien-être", "Repos"]
  }
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const post = blogPosts[slug as keyof typeof blogPosts]
  
  if (!post) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Article non trouvé</h1>
          <p className="text-gray-400 mb-8">L'article que vous recherchez n'existe pas.</p>
          <Link 
            href="/blog"
            className="btn-gold text-black font-bold py-3 px-8 rounded-full shadow-gold-glow"
          >
            Retour au blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-brand-gold/10 to-brand-green/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link 
                href="/blog"
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Retour au blog
              </Link>
            </nav>

            {/* Article Header */}
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="bg-brand-gold/20 text-brand-gold px-4 py-2 rounded-full text-sm font-semibold">
                  {post.category}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                {post.excerpt}
              </p>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                  <span>{new Date(post.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-2" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Image */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-96 rounded-2xl overflow-hidden">
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
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </section>

      {/* Article Tags */}
      <section className="py-8 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-gray-400 font-semibold">Tags :</span>
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-brand-gold/20 hover:text-brand-gold transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faTag} className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Article Actions */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
                  <FontAwesomeIcon icon={faHeart} />
                  <span>J'aime</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
                  <FontAwesomeIcon icon={faBookmark} />
                  <span>Sauvegarder</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
                  <FontAwesomeIcon icon={faShare} />
                  <span>Partager</span>
                </button>
              </div>
              
              <Link
                href="/blog"
                className="btn-gold text-black font-bold py-3 px-8 rounded-full shadow-gold-glow"
              >
                Voir tous les articles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

