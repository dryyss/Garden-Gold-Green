'use client'

import React, { useState } from 'react'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
}

export default function ContactPage() {
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

    if (!form.name.trim()) newErrors.name = 'Le nom est requis'
    if (!form.email.trim()) newErrors.email = 'L\'email est requis'
    if (!form.subject.trim()) newErrors.subject = 'Le sujet est requis'
    if (!form.message.trim()) newErrors.message = 'Le message est requis'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitted(true)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <main className="bg-brand-black min-h-screen pt-24">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl text-white">✓</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-6">Message Envoyé !</h1>
            <p className="text-xl text-gray-300 mb-8">
              Merci de nous avoir contactés. Nous vous répondrons dans les 24 heures.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false)
                setForm({ name: '', email: '', subject: '', message: '', phone: '' })
              }}
              className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow"
            >
              Envoyer un Autre Message
            </button>
          </div>
        </div>
      </main>
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
            Contactez-<span className="gold-text-gradient">nous</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Vous avez des questions sur nos produits ? Besoin d'aide avec votre commande ? 
            Nous sommes là pour vous accompagner à chaque étape.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <div className="card-bg rounded-xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Envoyez-nous un Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Nom Complet *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                          errors.name ? 'border-red-500' : 'border-white/20'
                        }`}
                        placeholder="Votre nom complet"
                      />
                    </div>
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Adresse Email *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">✉</span>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                          errors.email ? 'border-red-500' : 'border-white/20'
                        }`}
                        placeholder="votre@email.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Numéro de Téléphone
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📞</span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Sujet *
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleInputChange}
                    className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                      errors.subject ? 'border-red-500' : 'border-white/20'
                    }`}
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="product-inquiry">Question sur un produit</option>
                    <option value="order-support">Support commande</option>
                    <option value="shipping-questions">Questions de livraison</option>
                    <option value="returns-refunds">Retours et remboursements</option>
                    <option value="wholesale">Demande de gros</option>
                    <option value="general">Question générale</option>
                    <option value="other">Autre</option>
                  </select>
                  {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Message *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-4 text-gray-400">💬</span>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full bg-white/5 border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 resize-none ${
                        errors.message ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="Dites-nous comment nous pouvons vous aider..."
                    />
                  </div>
                  {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-full font-bold text-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'btn-gold text-black shadow-gold-glow hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="spinner"></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>✈</span>
                      Envoyer le Message
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="card-bg rounded-xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Informations de Contact</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-gold text-lg">✉</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                    <p className="text-gray-400 mb-2">Nous répondons dans les 24 heures</p>
                    <a 
                      href="mailto:support@gardengoldgreen.com"
                      className="text-brand-gold hover:text-brand-gold/80 transition-colors"
                    >
                      support@gardengoldgreen.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-gold text-lg">📞</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Téléphone</h3>
                    <p className="text-gray-400 mb-2">Lundi - Vendredi, 9h - 18h</p>
                    <a 
                      href="tel:+33-1-23-45-67-89"
                      className="text-brand-gold hover:text-brand-gold/80 transition-colors"
                    >
                      +33 1 23 45 67 89
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-gold text-lg">📍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Adresse</h3>
                    <p className="text-gray-400">
                      123 Rue du CBD<br />
                      75001 Paris<br />
                      France
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-gold text-lg">🕒</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Heures d'Ouverture</h3>
                    <div className="text-gray-400 space-y-1">
                      <p>Lundi - Vendredi : 9h00 - 18h00</p>
                      <p>Samedi : 10h00 - 16h00</p>
                      <p>Dimanche : Fermé</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="card-bg rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Aide Rapide</h2>
              <div className="space-y-4">
                <a 
                  href="/faq"
                  className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <h3 className="text-white font-medium mb-1">Questions Fréquentes</h3>
                  <p className="text-gray-400 text-sm">Trouvez des réponses aux questions courantes</p>
                </a>
                <a 
                  href="/orders"
                  className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <h3 className="text-white font-medium mb-1">Suivre Votre Commande</h3>
                  <p className="text-gray-400 text-sm">Vérifiez le statut de votre commande</p>
                </a>
                <a 
                  href="/privacy"
                  className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <h3 className="text-white font-medium mb-1">Politique de Confidentialité</h3>
                  <p className="text-gray-400 text-sm">Découvrez comment nous protégeons vos données</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
