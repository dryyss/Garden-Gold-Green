'use client'

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from '@/contexts/TranslationContext'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
}

export default function ContactPage() {
  const { t } = useTranslation()
  
  // Fonction helper pour éviter les erreurs de traduction
  const safeT = (key: string, fallback: string = '') => {
    try {
      const result = t(key)
      return result || fallback
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error)
      return fallback
    }
  }
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<ContactForm>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof ContactForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {}

    if (!form.name.trim()) newErrors.name = t('contact.form.validation.nameRequired')
    if (!form.email.trim()) newErrors.email = t('contact.form.validation.emailRequired')
    if (!form.subject.trim()) newErrors.subject = t('contact.form.validation.subjectRequired')
    if (!form.message.trim()) newErrors.message = t('contact.form.validation.messageRequired')
    
    // Email validation
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t('contact.form.validation.emailInvalid')
    }
    
    // Message length validation
    if (form.message && form.message.length < 10) {
      newErrors.message = t('contact.form.validation.messageMinLength')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSubmitted(true)
      setForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const subjects = [
    { value: 'general', label: t('contact.form.subjects.general') },
    { value: 'product', label: t('contact.form.subjects.product') },
    { value: 'order', label: t('contact.form.subjects.order') },
    { value: 'shipping', label: t('contact.form.subjects.shipping') },
    { value: 'return', label: t('contact.form.subjects.return') },
    { value: 'technical', label: t('contact.form.subjects.technical') },
    { value: 'partnership', label: t('contact.form.subjects.partnership') },
    { value: 'other', label: t('contact.form.subjects.other') }
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faCheckCircle} className="text-brand-green text-3xl" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {t('contact.form.success.title')}
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              {t('contact.form.success.message')}
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
            >
              {t('contact.form.success.button')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-gold/10 to-brand-green/10 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {t('contact.hero.title')}
          </h1>
          <p className="text-lg text-gray-300 mb-4 max-w-3xl mx-auto">
            {t('contact.hero.subtitle')}
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('contact.hero.description')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                {t('contact.form.title')}
              </h2>
              <p className="text-gray-400">
                {t('contact.form.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    {t('contact.form.fields.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.fields.namePlaceholder')}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                      errors.name ? 'border-red-500' : 'border-white/20'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    {t('contact.form.fields.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.fields.emailPlaceholder')}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                      errors.email ? 'border-red-500' : 'border-white/20'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                    {t('contact.form.fields.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.fields.phonePlaceholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                    {t('contact.form.fields.subject')} *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                      errors.subject ? 'border-red-500' : 'border-white/20'
                    }`}
                  >
                    <option value="">{t('contact.form.fields.subjectPlaceholder')}</option>
                    {subjects.map((subject) => (
                      <option key={subject.value} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-400">{errors.subject}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                  {t('contact.form.fields.message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleInputChange}
                  placeholder={t('contact.form.fields.messagePlaceholder')}
                  rows={6}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold resize-none ${
                    errors.message ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-400">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-gold text-black font-semibold py-4 px-8 rounded-lg shadow-gold-glow hover:shadow-gold-glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    {t('contact.form.submitting')}
                  </>
                ) : (
                  t('contact.form.submit')
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                {t('contact.info.title')}
              </h2>
              <p className="text-gray-400">
                {t('contact.info.subtitle')}
              </p>
            </div>

            <div className="space-y-8">
              {/* Phone */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <FontAwesomeIcon icon={faPhone} className="text-brand-gold text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {t('contact.info.phone.title')}
                  </h3>
                  <p className="text-brand-gold text-lg font-medium mb-1">
                    {t('contact.info.phone.number')}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {t('contact.info.phone.hours')}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-brand-green/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} className="text-brand-green text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {t('contact.info.email.title')}
                  </h3>
                  <p className="text-brand-green text-lg font-medium mb-1">
                    {t('contact.info.email.address')}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {t('contact.info.email.response')}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-brand-gold text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {t('contact.info.address.title')}
                  </h3>
                  <p className="text-gray-300 mb-1">
                    {t('contact.info.address.street')}
                  </p>
                  <p className="text-gray-300">
                    {t('contact.info.address.city')}
                  </p>
                </div>
              </div>

              {/* Social */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-brand-green/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <FontAwesomeIcon icon={faClock} className="text-brand-green text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {t('contact.info.social.title')}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {t('contact.info.social.follow')}
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors" aria-label="Instagram">
                      <i className="fa-brands fa-instagram text-xl"></i>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors" aria-label="Facebook">
                      <i className="fa-brands fa-facebook text-xl"></i>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors" aria-label="Twitter">
                      <i className="fa-brands fa-twitter text-xl"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-white mb-6">
                {t('contact.faq.title')}
              </h3>
              <p className="text-gray-400 mb-8">
                {t('contact.faq.subtitle')}
              </p>
              
              <div className="space-y-4">
                {(() => {
                  try {
                    const faqItems = t('contact.faq.items')
                    if (Array.isArray(faqItems)) {
                      return faqItems.map((item: any, index: number) => (
                        <div key={index} className="card-bg rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">
                            {item.question}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {item.answer}
                          </p>
                        </div>
                      ))
                    } else {
                      // Fallback si ce n'est pas un tableau
                      return (
                        <div className="card-bg rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">
                            Comment puis-je vous contacter ?
                          </h4>
                          <p className="text-gray-400 text-sm">
                            Vous pouvez nous contacter par téléphone au +33 7 78 82 38 40, par email à contact@gardengoldgreen.com, ou en remplissant le formulaire ci-dessus.
                          </p>
                        </div>
                      )
                    }
                  } catch (error) {
                    console.warn('Error rendering FAQ items:', error)
                    return (
                      <div className="card-bg rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-2">
                          Comment puis-je vous contacter ?
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Vous pouvez nous contacter par téléphone au +33 7 78 82 38 40, par email à contact@gardengoldgreen.com, ou en remplissant le formulaire ci-dessus.
                        </p>
                      </div>
                    )
                  }
                })()}
              </div>
              
              <div className="mt-6">
                <a 
                  href="/faq" 
                  className="text-brand-gold hover:text-yellow-300 font-medium transition-colors"
                >
                  {t('contact.faq.viewAll')} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
