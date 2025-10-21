'use client'

import React, { useState } from 'react'
import Link from 'next/link'
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
import { useTranslation } from '@/contexts/TranslationContext'
import faqTranslationsFr from '@/locales/faq-fr.json'
import faqTranslationsEn from '@/locales/faq-en.json'
import faqTranslationsEs from '@/locales/faq-es.json'
import faqTranslationsNl from '@/locales/faq-nl.json'

const faqTranslations: Record<string, typeof faqTranslationsFr> = {
  fr: faqTranslationsFr,
  en: faqTranslationsEn,
  es: faqTranslationsEs,
  nl: faqTranslationsNl,
}

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const { language } = useTranslation()
  const ft = faqTranslations[language] || faqTranslations.fr
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<string[]>([])

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: ft.questions.q1.question,
      answer: ft.questions.q1.answer,
      category: 'general'
    },
    {
      id: '2',
      question: ft.questions.q2.question,
      answer: ft.questions.q2.answer,
      category: 'general'
    },
    {
      id: '3',
      question: ft.questions.q3.question,
      answer: ft.questions.q3.answer,
      category: 'products'
    },
    {
      id: '4',
      question: ft.questions.q4.question,
      answer: ft.questions.q4.answer,
      category: 'products'
    },
    {
      id: '5',
      question: ft.questions.q5.question,
      answer: ft.questions.q5.answer,
      category: 'products'
    },
    {
      id: '6',
      question: ft.questions.q6.question,
      answer: ft.questions.q6.answer,
      category: 'products'
    },
    {
      id: '7',
      question: ft.questions.q7.question,
      answer: ft.questions.q7.answer,
      category: 'products'
    },
    {
      id: '8',
      question: ft.questions.q8.question,
      answer: ft.questions.q8.answer,
      category: 'quality'
    },
    {
      id: '9',
      question: ft.questions.q9.question,
      answer: ft.questions.q9.answer,
      category: 'quality'
    },
    {
      id: '10',
      question: ft.questions.q10.question,
      answer: ft.questions.q10.answer,
      category: 'quality'
    },
    {
      id: '11',
      question: ft.questions.q11.question,
      answer: ft.questions.q11.answer,
      category: 'shipping'
    },
    {
      id: '12',
      question: ft.questions.q12.question,
      answer: ft.questions.q12.answer,
      category: 'shipping'
    },
    {
      id: '13',
      question: ft.questions.q13.question,
      answer: ft.questions.q13.answer,
      category: 'returns'
    },
    {
      id: '14',
      question: ft.questions.q14.question,
      answer: ft.questions.q14.answer,
      category: 'general'
    },
    {
      id: '15',
      question: ft.questions.q15.question,
      answer: ft.questions.q15.answer,
      category: 'general'
    },
    {
      id: '16',
      question: ft.questions.q16.question,
      answer: ft.questions.q16.answer,
      category: 'legal'
    },
    {
      id: '17',
      question: ft.questions.q17.question,
      answer: ft.questions.q17.answer,
      category: 'legal'
    },
    {
      id: '18',
      question: ft.questions.q18.question,
      answer: ft.questions.q18.answer,
      category: 'legal'
    },
    {
      id: '19',
      question: ft.questions.q19.question,
      answer: ft.questions.q19.answer,
      category: 'legal'
    },
    {
      id: '20',
      question: ft.questions.q20.question,
      answer: ft.questions.q20.answer,
      category: 'legal'
    }
  ]

  const categories = [
    { id: 'all', name: ft.categories.all, icon: faQuestionCircle },
    { id: 'general', name: ft.categories.general, icon: faQuestionCircle },
    { id: 'products', name: ft.categories.products, icon: faLeaf },
    { id: 'quality', name: ft.categories.quality, icon: faFlask },
    { id: 'shipping', name: ft.categories.shipping, icon: faTruck },
    { id: 'returns', name: ft.categories.returns, icon: faCreditCard },
    { id: 'legal', name: ft.categories.legal, icon: faShieldAlt }
  ]

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
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
            {ft.hero.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {ft.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={ft.search.placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-brand-gold text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <FontAwesomeIcon icon={category.icon} className="text-sm" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faQuestionCircle} className="text-6xl text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{ft.search.noResults}</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="card-bg rounded-xl border border-white/10 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
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
                      <div className="px-6 pb-4">
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

      {/* Contact CTA */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{ft.contact.title}</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {ft.contact.subtitle}
          </p>
          <Link
            href="/contact"
            className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 inline-flex items-center"
          >
            {ft.contact.button}
          </Link>
        </div>
      </section>
    </main>
  )
}
