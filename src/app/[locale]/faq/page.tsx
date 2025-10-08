'use client'

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChevronDown, 
  faChevronUp,
  faQuestionCircle,
  faSearch,
  faLeaf,
  faFlask,
  faTruck,
  faCreditCard,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'What is CBD and how does it work?',
    answer: 'CBD (cannabidiol) is a naturally occurring compound found in hemp plants. It interacts with your body\'s endocannabinoid system, which helps regulate various functions like sleep, mood, pain, and immune response. Unlike THC, CBD is non-psychoactive, meaning it won\'t make you feel "high."',
    category: 'general'
  },
  {
    id: '2',
    question: 'Are your products legal?',
    answer: 'Yes! All our products are made from hemp and contain less than 0.3% THC, making them legal under federal law. We comply with all state and federal regulations regarding hemp-derived CBD products.',
    category: 'general'
  },
  {
    id: '3',
    question: 'How do I choose the right CBD product for me?',
    answer: 'The right product depends on your needs and preferences. Oils are great for precise dosing and quick absorption, gummies are convenient and tasty, topicals are perfect for targeted relief, and capsules offer consistent dosing. Start with a low dose and gradually increase until you find what works best for you.',
    category: 'products'
  },
  {
    id: '4',
    question: 'What\'s the difference between full-spectrum and isolate CBD?',
    answer: 'Full-spectrum CBD contains all the naturally occurring compounds in hemp, including other cannabinoids, terpenes, and trace amounts of THC (less than 0.3%). CBD isolate is pure CBD with all other compounds removed. Full-spectrum products may offer enhanced benefits due to the "entourage effect."',
    category: 'products'
  },
  {
    id: '5',
    question: 'How long does shipping take?',
    answer: 'We typically process orders within 1-2 business days. Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. You\'ll receive tracking information once your order ships.',
    category: 'shipping'
  },
  {
    id: '6',
    question: 'Do you offer free shipping?',
    answer: 'Yes! We offer free standard shipping on all orders over $50. Orders under $50 have a $9.99 shipping fee.',
    category: 'shipping'
  },
  {
    id: '7',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day money-back guarantee on all products. If you\'re not satisfied with your purchase, you can return it within 30 days for a full refund. Products must be unopened and in original packaging.',
    category: 'returns'
  },
  {
    id: '8',
    question: 'How do I return a product?',
    answer: 'To return a product, contact our customer service team at support@gardengoldgreen.com or call (555) 123-4567. We\'ll provide you with a return authorization number and shipping instructions.',
    category: 'returns'
  },
  {
    id: '9',
    question: 'Are your products tested for quality?',
    answer: 'Absolutely! Every batch of our products is tested by third-party laboratories for potency, purity, and safety. We test for cannabinoid content, pesticides, heavy metals, and microbial contaminants. All lab results are available on our website.',
    category: 'quality'
  },
  {
    id: '10',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay. All payments are processed securely through encrypted connections.',
    category: 'payment'
  },
  {
    id: '11',
    question: 'Is my personal information secure?',
    answer: 'Yes, we take your privacy seriously. We use industry-standard encryption to protect your personal and payment information. We never sell or share your data with third parties. You can read our full privacy policy for more details.',
    category: 'privacy'
  },
  {
    id: '12',
    question: 'Can I take CBD with other medications?',
    answer: 'While CBD is generally well-tolerated, it can interact with certain medications. We recommend consulting with your healthcare provider before starting any CBD regimen, especially if you\'re taking prescription medications.',
    category: 'health'
  },
  {
    id: '13',
    question: 'How should I store my CBD products?',
    answer: 'Store your CBD products in a cool, dry place away from direct sunlight. Keep oils and tinctures in their original bottles, and store gummies and capsules in their original containers. Proper storage helps maintain potency and freshness.',
    category: 'storage'
  },
  {
    id: '14',
    question: 'Do you offer wholesale pricing?',
    answer: 'Yes! We offer wholesale pricing for retailers, practitioners, and bulk buyers. Contact our wholesale team at wholesale@gardengoldgreen.com for pricing and minimum order requirements.',
    category: 'wholesale'
  },
  {
    id: '15',
    question: 'What if I have a question not answered here?',
    answer: 'We\'re here to help! Contact our customer service team at support@gardengoldgreen.com or call (555) 123-4567. Our knowledgeable team is available Monday-Friday, 9 AM - 6 PM EST.',
    category: 'support'
  }
]

const categories = [
  { id: 'all', name: 'All Questions', icon: faQuestionCircle },
  { id: 'general', name: 'General', icon: faQuestionCircle },
  { id: 'products', name: 'Products', icon: faLeaf },
  { id: 'shipping', name: 'Shipping', icon: faTruck },
  { id: 'returns', name: 'Returns', icon: faShieldAlt },
  { id: 'quality', name: 'Quality', icon: faFlask },
  { id: 'payment', name: 'Payment', icon: faCreditCard },
  { id: 'privacy', name: 'Privacy', icon: faShieldAlt },
  { id: 'health', name: 'Health', icon: faQuestionCircle },
  { id: 'storage', name: 'Storage', icon: faQuestionCircle },
  { id: 'wholesale', name: 'Wholesale', icon: faQuestionCircle },
  { id: 'support', name: 'Support', icon: faQuestionCircle }
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="hero-bg absolute inset-0"></div>
        <div className="hero-overlay absolute inset-0"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Frequently Asked <span className="gold-text-gradient">Questions</span>
            </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about our products, shipping, returns, and more. 
            Can't find what you're looking for? Contact us!
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
                placeholder="Search questions..."
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
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-16">
              <FontAwesomeIcon icon={faQuestionCircle} className="text-6xl text-gray-600 mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">No Questions Found</h2>
              <p className="text-gray-400 mb-8">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <div key={faq.id} className="card-bg rounded-xl overflow-hidden">
                          <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                            <FontAwesomeIcon 
                    icon={openItems.has(faq.id) ? faChevronUp : faChevronDown} 
                              className="text-brand-gold flex-shrink-0" 
                            />
                          </button>
                {openItems.has(faq.id) && (
                  <div className="px-6 pb-6">
                              <div className="border-t border-white/10 pt-4">
                                <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="card-bg rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Our customer service team is here to help with any questions you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow inline-flex items-center justify-center gap-2"
              >
                Contact Us
              </a>
              <a 
                href="mailto:support@gardengoldgreen.com"
                className="border border-white/20 text-white font-semibold py-3 px-8 rounded-full hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faQuestionCircle} />
                Email Support
              </a>
            </div>
          </div>
        </div>
    </div>
    </main>
  )
}
  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    )
  }

  const faqData = [
    {
      category: "Produits CBD",
      questions: [
        {
          question: "Qu'est-ce que le CBD ?",
          answer: "Le CBD (cannabidiol) est un composé naturel extrait du chanvre. Contrairement au THC, il ne produit pas d'effets psychoactifs et est légal en France. Il est reconnu pour ses propriétés apaisantes et relaxantes."
        },
        {
          question: "Comment choisir le bon dosage de CBD ?",
          answer: "Le dosage optimal dépend de plusieurs facteurs : votre poids, votre expérience avec le CBD, et l'effet recherché. Nous recommandons de commencer par 5-10mg par jour et d'ajuster progressivement selon vos besoins. Nos experts peuvent vous conseiller gratuitement."
        },
        {
          question: "Vos produits sont-ils testés en laboratoire ?",
          answer: "Oui, tous nos produits sont testés par des laboratoires indépendants certifiés. Les certificats d'analyse (COA) sont disponibles sur demande et garantissent la pureté, la concentration en CBD, et l'absence de contaminants."
        },
        {
          question: "Quelle est la différence entre huile CBD et gummies ?",
          answer: "L'huile CBD offre une absorption rapide par voie sublinguale (2-3 minutes), idéale pour un effet immédiat. Les gummies ont une absorption plus lente (30-60 minutes) mais un goût agréable et un dosage précis. Le choix dépend de vos préférences et de vos besoins."
        }
      ]
    },
    {
      category: "Commandes et Livraison",
      questions: [
        {
          question: "Quels sont les délais de livraison ?",
          answer: "Nous livrons en France métropolitaine sous 24-48h pour les commandes passées avant 14h. Les livraisons en Europe prennent 3-5 jours ouvrés. Vous recevrez un numéro de suivi par email dès l'expédition."
        },
        {
          question: "Quels sont les frais de port ?",
          answer: "La livraison est gratuite dès 50€ d'achat en France métropolitaine. Sinon, les frais de port sont de 4,90€. Pour l'Europe, la livraison gratuite s'applique dès 100€ d'achat."
        },
        {
          question: "Puis-je modifier ou annuler ma commande ?",
          answer: "Vous pouvez modifier ou annuler votre commande dans les 2h suivant la validation, tant qu'elle n'a pas été expédiée. Contactez-nous par email ou téléphone pour toute modification."
        },
        {
          question: "Comment suivre ma commande ?",
          answer: "Dès l'expédition, vous recevrez un email avec votre numéro de suivi. Vous pouvez également vous connecter à votre compte pour voir l'état de vos commandes en temps réel."
        }
      ]
    },
    {
      category: "Retours et Garanties",
      questions: [
        {
          question: "Puis-je retourner un produit ?",
          answer: "Oui, vous disposez de 14 jours pour retourner un produit non ouvert et dans son emballage d'origine. Les frais de retour sont à votre charge, sauf en cas de défaut du produit. Contactez-nous avant tout retour."
        },
        {
          question: "Quelle est votre garantie qualité ?",
          answer: "Nous garantissons la qualité de tous nos produits. Si vous n'êtes pas satisfait, nous vous remboursons ou échangeons le produit. Notre service client est disponible pour toute question ou problème."
        },
        {
          question: "Que faire si mon produit est défectueux ?",
          answer: "En cas de produit défectueux, contactez-nous immédiatement avec photos à l'appui. Nous vous enverrons un produit de remplacement gratuitement et prendrons en charge les frais de retour."
        }
      ]
    },
    {
      category: "Légalité et Sécurité",
      questions: [
        {
          question: "Le CBD est-il légal en France ?",
          answer: "Oui, le CBD est légal en France depuis 2021, à condition qu'il contienne moins de 0,3% de THC. Tous nos produits respectent cette réglementation et sont conformes à la législation française."
        },
        {
          question: "Y a-t-il des effets secondaires ?",
          answer: "Le CBD est généralement bien toléré. Les effets secondaires rares peuvent inclure somnolence, sécheresse buccale, ou légère baisse de tension. Consultez votre médecin si vous prenez des médicaments."
        },
        {
          question: "Puis-je conduire après avoir pris du CBD ?",
          answer: "Le CBD n'altère pas les capacités de conduite contrairement au THC. Cependant, si vous ressentez de la somnolence, évitez de conduire. Écoutez votre corps et adaptez votre consommation."
        },
        {
          question: "Le CBD est-il addictif ?",
          answer: "Non, le CBD n'est pas addictif selon l'OMS. Il n'y a pas de dépendance physique ou psychologique associée à sa consommation. Vous pouvez arrêter à tout moment sans symptômes de sevrage."
        }
      ]
    }
  ]

  const filteredData = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="bg-brand-black min-h-screen text-gray-300 pt-24">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 gold-text-gradient">
              Questions Fréquentes
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Trouvez rapidement les réponses à vos questions sur nos produits CBD, 
              nos services et nos garanties.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une question..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field w-full pl-12 pr-4 py-4 text-lg"
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
                <FontAwesomeIcon icon={faQuestionCircle} className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Aucune question trouvée</h3>
              <p className="text-gray-400 mb-6">
                Essayez avec d'autres mots-clés ou contactez-nous directement.
              </p>
              <a 
                href="/contact" 
                className="btn-gold text-black font-bold py-2 px-6 rounded-full inline-flex items-center"
              >
                Nous contacter
              </a>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">
              {filteredData.map((category, categoryIndex) => (
                <div key={categoryIndex} className="card-bg rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 gold-text-gradient">
                    {category.category}
                  </h2>
                  
                  <div className="space-y-4">
                    {category.questions.map((item, itemIndex) => {
                      const globalIndex = categoryIndex * 100 + itemIndex
                      const isOpen = openItems.includes(globalIndex)
                      
                      return (
                        <div key={itemIndex} className="border border-white/10 rounded-lg">
                          <button
                            onClick={() => toggleItem(globalIndex)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                          >
                            <span className="font-semibold text-white pr-4">
                              {item.question}
                            </span>
                            <FontAwesomeIcon 
                              icon={isOpen ? faChevronUp : faChevronDown} 
                              className="text-brand-gold flex-shrink-0" 
                            />
                          </button>
                          
                          {isOpen && (
                            <div className="px-6 pb-4">
                              <div className="border-t border-white/10 pt-4">
                                <p className="text-gray-300 leading-relaxed">
                                  {item.answer}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="card-bg rounded-xl p-12 text-center border border-brand-gold/20">
            <h2 className="text-4xl font-bold text-white mb-6 gold-text-gradient">
              Vous ne trouvez pas votre réponse ?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Notre équipe d'experts est là pour vous accompagner et répondre 
              à toutes vos questions personnalisées.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="btn-gold text-black font-bold py-3 px-8 rounded-full shadow-gold-glow"
              >
                Nous contacter
              </a>
              <a 
                href="tel:+33123456789" 
                className="bg-transparent border-2 border-brand-green text-brand-green font-bold py-3 px-8 rounded-full hover:bg-brand-green hover:text-black transition-all duration-300"
              >
                Appeler maintenant
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
