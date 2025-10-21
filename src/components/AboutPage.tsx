'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faLeaf, 
  faFlask, 
  faHeart, 
  faAward,
  faUsers,
  faGlobe,
  faShieldAlt,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from '@/contexts/TranslationContext'
import aboutTranslationsFr from '@/locales/about-fr.json'
import aboutTranslationsEn from '@/locales/about-en.json'
import aboutTranslationsEs from '@/locales/about-es.json'
import aboutTranslationsNl from '@/locales/about-nl.json'

const aboutTranslations: Record<string, typeof aboutTranslationsFr> = {
  fr: aboutTranslationsFr,
  en: aboutTranslationsEn,
  es: aboutTranslationsEs,
  nl: aboutTranslationsNl,
}

export default function AboutPage() {
  const { language } = useTranslation()
  const at = aboutTranslations[language] || aboutTranslations.fr

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="hero-bg absolute inset-0"></div>
        <div className="hero-overlay absolute inset-0"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {at.hero.title} <span className="gold-text-gradient">Garden Gold Green</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {at.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">{at.story.title}</h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>{at.story.paragraph1}</p>
                <p>{at.story.paragraph2}</p>
                <p>{at.story.paragraph3}</p>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full h-96 rounded-2xl overflow-hidden">
                <Image
                  src="/images/about-hemp-fields.jpg"
                  alt="Hemp fields in Colorado"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">{at.values.title}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {at.values.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faLeaf} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{at.values.natural.title}</h3>
              <p className="text-gray-300">
                {at.values.natural.description}
              </p>
            </div>

            <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faFlask} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{at.values.labTested.title}</h3>
              <p className="text-gray-300">
                {at.values.labTested.description}
              </p>
            </div>

            <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faHeart} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{at.values.transparent.title}</h3>
              <p className="text-gray-300">
                {at.values.transparent.description}
              </p>
            </div>

            <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faGlobe} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{at.values.sustainable.title}</h3>
              <p className="text-gray-300">
                {at.values.sustainable.description}
              </p>
            </div>

            <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faUsers} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{at.values.customerFirst.title}</h3>
              <p className="text-gray-300">
                {at.values.customerFirst.description}
              </p>
            </div>

            <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faAward} className="text-brand-gold text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{at.values.innovative.title}</h3>
              <p className="text-gray-300">
                {at.values.innovative.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">{at.team.title}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {at.team.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
              <div className="w-24 h-24 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faFlask} className="text-brand-gold text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{at.team.sarah.name}</h3>
              <p className="text-brand-gold font-semibold mb-4">{at.team.sarah.role}</p>
              <p className="text-gray-300">
                {at.team.sarah.description}
              </p>
            </div>

            <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
              <div className="w-24 h-24 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faAward} className="text-brand-gold text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{at.team.marc.name}</h3>
              <p className="text-brand-gold font-semibold mb-4">{at.team.marc.role}</p>
              <p className="text-gray-300">
                {at.team.marc.description}
              </p>
            </div>

            <div className="card-bg rounded-2xl p-8 text-center border border-white/10">
              <div className="w-24 h-24 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faShieldAlt} className="text-brand-gold text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{at.team.lisa.name}</h3>
              <p className="text-brand-gold font-semibold mb-4">{at.team.lisa.role}</p>
              <p className="text-gray-300">
                {at.team.lisa.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">{at.mission.title}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {at.mission.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white text-sm" />
              </div>
              <p className="text-gray-300">{at.mission.goals.quality}</p>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white text-sm" />
              </div>
              <p className="text-gray-300">{at.mission.goals.transparency}</p>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white text-sm" />
              </div>
              <p className="text-gray-300">{at.mission.goals.sustainability}</p>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white text-sm" />
              </div>
              <p className="text-gray-300">{at.mission.goals.education}</p>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white text-sm" />
              </div>
              <p className="text-gray-300">{at.mission.goals.innovation}</p>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white text-sm" />
              </div>
              <p className="text-gray-300">{at.mission.goals.community}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">{at.certifications.title}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {at.certifications.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faLeaf} className="text-brand-gold text-2xl" />
              </div>
              <p className="text-white font-semibold text-sm">{at.certifications.organic}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faAward} className="text-brand-gold text-2xl" />
              </div>
              <p className="text-white font-semibold text-sm">{at.certifications.gmp}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faShieldAlt} className="text-brand-gold text-2xl" />
              </div>
              <p className="text-white font-semibold text-sm">{at.certifications.iso}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faFlask} className="text-brand-gold text-2xl" />
              </div>
              <p className="text-white font-semibold text-sm">{at.certifications.thirdParty}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-brand-gold text-2xl" />
              </div>
              <p className="text-white font-semibold text-sm">{at.certifications.fda}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faHeart} className="text-brand-gold text-2xl" />
              </div>
              <p className="text-white font-semibold text-sm">{at.certifications.cannabis}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">{at.cta.title}</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {at.cta.subtitle}
          </p>
          <Link 
            href="/products" 
            className="btn-gold text-black font-semibold py-4 px-8 rounded-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 inline-flex items-center"
          >
            {at.cta.button}
          </Link>
        </div>
      </section>
    </main>
  )
}
