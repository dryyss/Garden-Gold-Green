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
    answer: 'CBD (cannabidiol) is a naturally occurring compound found in hemp plants. It interacts with your body&apos;s endocannabinoid system, which helps regulate various functions like sleep, mood, pain, and immune response. Unlike THC, CBD is non-psychoactive, meaning it won&apos;t make you feel "high."',
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
    question: 'What&apos;s the difference between full-spectrum and isolate CBD?',
    answer: 'Full-spectrum CBD contains all the naturally occurring compounds in hemp, including other cannabinoids, terpenes, and trace amounts of THC (less than 0.3%). CBD isolate is pure CBD with all other compounds removed. Full-spectrum products may offer enhanced benefits due to the "entourage effect."',
    category: 'products'
  },
  {
    id: '5',
    question: 'How much CBD should I take?',
    answer: 'CBD dosage varies from person to person. We recommend starting with 10-20mg per day and gradually increasing until you find your optimal dose. Factors like body weight, metabolism, and the condition you&apos;re addressing can affect dosage. Always consult with a healthcare professional before starting any new supplement.',
    category: 'products'
  },
  {
    id: '6',
    question: 'How long does it take for CBD to work?',
    answer: 'The effects of CBD can vary depending on the method of consumption. Sublingual oils typically take 15-45 minutes, edibles can take 1-2 hours, and topicals may provide immediate relief. It may take 2-4 weeks of consistent use to experience the full benefits.',
    category: 'products'
  },
  {
    id: '7',
    question: 'Are there any side effects?',
    answer: 'CBD is generally well-tolerated, but some people may experience mild side effects like dry mouth, drowsiness, or changes in appetite. These effects are typically mild and temporary. Always consult with a healthcare professional if you have concerns.',
    category: 'products'
  },
  {
    id: '8',
    question: 'Do you test your products?',
    answer: 'Yes! All our products undergo rigorous third-party testing for potency, purity, and safety. We test for cannabinoids, terpenes, heavy metals, pesticides, and microbial contaminants. You can find lab reports for each product on our website.',
    category: 'quality'
  },
  {
    id: '9',
    question: 'Where do you source your hemp?',
    answer: 'We source our hemp from certified organic farms in Colorado and Oregon. Our farmers follow strict organic growing practices and are committed to sustainable agriculture. We maintain close relationships with our suppliers to ensure the highest quality.',
    category: 'quality'
  },
  {
    id: '10',
    question: 'How do you extract CBD?',
    answer: 'We use CO2 extraction, which is considered the gold standard for CBD extraction. This method preserves the plant&apos;s beneficial compounds while removing unwanted substances. It&apos;s clean, safe, and produces high-quality CBD oil.',
    category: 'quality'
  },
  {
    id: '11',
    question: 'What shipping methods do you offer?',
    answer: 'We offer standard shipping (3-5 business days) and express shipping (1-2 business days). All orders over $75 ship free! We use discreet packaging to protect your privacy.',
    category: 'shipping'
  },
  {
    id: '12',
    question: 'Do you ship internationally?',
    answer: 'Currently, we only ship within the United States. We&apos;re working on expanding our international shipping options. Please check back with us or contact our customer service team for updates.',
    category: 'shipping'
  },
  {
    id: '13',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day money-back guarantee on all products. If you&apos;re not completely satisfied, you can return your purchase for a full refund. Items must be unopened and in original packaging.',
    category: 'shipping'
  },
  {
    id: '14',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through encrypted connections.',
    category: 'payment'
  },
  {
    id: '15',
    question: 'Is my personal information secure?',
    answer: 'Absolutely! We use industry-standard encryption to protect your personal and payment information. We never share your data with third parties and comply with all privacy regulations.',
    category: 'payment'
  },
  {
    id: '16',
    question: 'Can I track my order?',
    answer: 'Yes! Once your order ships, you&apos;ll receive a tracking number via email. You can track your package&apos;s progress in real-time through our website or the carrier&apos;s website.',
    category: 'shipping'
  },
  {
    id: '17',
    question: 'Do you offer discounts or promotions?',
    answer: 'Yes! We regularly offer discounts for new customers, bulk purchases, and seasonal promotions. Sign up for our newsletter to stay updated on the latest deals and offers.',
    category: 'general'
  },
  {
    id: '18',
    question: 'How should I store my CBD products?',
    answer: 'Store your CBD products in a cool, dry place away from direct sunlight. Keep them in their original containers and avoid extreme temperatures. Proper storage helps maintain potency and freshness.',
    category: 'products'
  },
  {
    id: '19',
    question: 'Can I take CBD with other medications?',
    answer: 'CBD may interact with certain medications. We strongly recommend consulting with your healthcare provider before taking CBD if you&apos;re currently on any medications, especially blood thinners or seizure medications.',
    category: 'products'
  },
  {
    id: '20',
    question: 'Do you have a customer service team?',
    answer: 'Yes! Our knowledgeable customer service team is available Monday-Friday, 9 AM-6 PM EST. You can reach us via email, phone, or live chat. We&apos;re here to help with any questions or concerns.',
    category: 'general'
  }
]

const categories = [
  { id: 'all', name: 'All Questions', icon: faQuestionCircle },
  { id: 'general', name: 'General', icon: faQuestionCircle },
  { id: 'products', name: 'Products', icon: faLeaf },
  { id: 'quality', name: 'Quality & Testing', icon: faFlask },
  { id: 'shipping', name: 'Shipping & Returns', icon: faTruck },
  { id: 'payment', name: 'Payment & Security', icon: faCreditCard }
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [openItems, setOpenItems] = useState<string[]>([])

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

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
            Find answers to common questions about our CBD products, shipping, quality, and more.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-4 justify-center">
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
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-16">
                <FontAwesomeIcon icon={faQuestionCircle} className="text-6xl text-gray-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">No FAQs Found</h3>
                <p className="text-gray-300">
                  Try adjusting your search terms or category filter.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="card-bg rounded-2xl border border-white/10 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-white pr-4">
                        {faq.question}
                      </h3>
                      <FontAwesomeIcon
                        icon={openItems.includes(faq.id) ? faChevronUp : faChevronDown}
                        className="text-brand-gold text-lg flex-shrink-0"
                      />
                    </button>
                    
                    {openItems.includes(faq.id) && (
                      <div className="px-6 pb-6">
                        <div className="border-t border-white/10 pt-4">
                          <p className="text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-r from-brand-gold/10 to-brand-green/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Still Have Questions?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Our customer service team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="btn-gold text-black font-bold py-4 px-8 rounded-full shadow-gold-glow inline-flex items-center justify-center"
            >
              Contact Us
            </a>
            <a
              href="/products"
              className="bg-white/10 text-white hover:bg-white/20 font-bold py-4 px-8 rounded-full inline-flex items-center justify-center transition-colors"
            >
              Browse Products
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
