'use client'

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faClock,
  faPaperPlane,
  faCheckCircle,
  faUser,
  faMessage
} from '@fortawesome/free-solid-svg-icons'

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

    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    if (!form.subject.trim()) newErrors.subject = 'Subject is required'
    if (!form.message.trim()) newErrors.message = 'Message is required'

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
              <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-6">Message Sent!</h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false)
                setForm({ name: '', email: '', subject: '', message: '', phone: '' })
              }}
              className="btn-gold text-black font-semibold py-3 px-8 rounded-full shadow-gold-glow"
            >
              Send Another Message
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
            Get in <span className="gold-text-gradient">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Have questions about our products? Need help with your order? 
            We're here to help you every step of the way.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <div className="card-bg rounded-xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon 
                        icon={faUser} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                      />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                          errors.name ? 'border-red-500' : 'border-white/20'
                        }`}
                        placeholder="Your full name"
                      />
                    </div>
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon 
                        icon={faEnvelope} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                      />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                          errors.email ? 'border-red-500' : 'border-white/20'
                        }`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faPhone} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleInputChange}
                    className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                      errors.subject ? 'border-red-500' : 'border-white/20'
                    }`}
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="order-support">Order Support</option>
                    <option value="shipping-questions">Shipping Questions</option>
                    <option value="returns-refunds">Returns & Refunds</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="general">General Question</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Message *
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faMessage} 
                      className="absolute left-3 top-4 text-gray-400" 
                    />
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full bg-white/5 border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 resize-none ${
                        errors.message ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="Tell us how we can help you..."
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
                      Sending Message...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <FontAwesomeIcon icon={faPaperPlane} />
                      Send Message
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
              <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faEnvelope} className="text-brand-gold text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                    <p className="text-gray-400 mb-2">We'll respond within 24 hours</p>
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
                    <FontAwesomeIcon icon={faPhone} className="text-brand-gold text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
                    <p className="text-gray-400 mb-2">Monday - Friday, 9 AM - 6 PM EST</p>
                    <a 
                      href="tel:+1-555-123-4567"
                      className="text-brand-gold hover:text-brand-gold/80 transition-colors"
                    >
                      (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-brand-gold text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Address</h3>
                    <p className="text-gray-400">
                      123 Hemp Street<br />
                      Denver, CO 80202<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faClock} className="text-brand-gold text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Business Hours</h3>
                    <div className="text-gray-400 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                      <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="card-bg rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Quick Help</h2>
              <div className="space-y-4">
                <a 
                  href="/faq"
                  className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <h3 className="text-white font-medium mb-1">Frequently Asked Questions</h3>
                  <p className="text-gray-400 text-sm">Find answers to common questions</p>
                </a>
                <a 
                  href="/orders"
                  className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <h3 className="text-white font-medium mb-1">Track Your Order</h3>
                  <p className="text-gray-400 text-sm">Check the status of your order</p>
                </a>
                <a 
                  href="/privacy"
                  className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <h3 className="text-white font-medium mb-1">Privacy Policy</h3>
                  <p className="text-gray-400 text-sm">Learn how we protect your data</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="card-bg rounded-xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faEnvelope} className="text-brand-gold text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                    <p className="text-gray-400 mb-2">We'll respond within 24 hours</p>
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
                    <FontAwesomeIcon icon={faPhone} className="text-brand-gold text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
                    <p className="text-gray-400 mb-2">Monday - Friday, 9 AM - 6 PM EST</p>
                    <a 
                      href="tel:+1-555-123-4567"
                      className="text-brand-gold hover:text-brand-gold/80 transition-colors"
                    >
                      (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-brand-gold text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Address</h3>
                    <p className="text-gray-400">
                      123 Hemp Street<br />
                      Denver, CO 80202<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faClock} className="text-brand-gold text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Business Hours</h3>
                    <div className="text-gray-400 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                      <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="card-bg rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Quick Help</h2>
              <div className="space-y-4">
                <a 
                  href="/faq"
                  className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <h3 className="text-white font-medium mb-1">Frequently Asked Questions</h3>
                  <p className="text-gray-400 text-sm">Find answers to common questions</p>
                </a>
                <a 
                  href="/orders"
                  className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <h3 className="text-white font-medium mb-1">Track Your Order</h3>
                  <p className="text-gray-400 text-sm">Check the status of your order</p>
                </a>
                <a 
                  href="/privacy"
                  className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <h3 className="text-white font-medium mb-1">Privacy Policy</h3>
                  <p className="text-gray-400 text-sm">Learn how we protect your data</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}