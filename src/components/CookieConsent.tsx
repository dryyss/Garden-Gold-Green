'use client'

import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCookie, faTimes, faCog } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from '@/contexts/TranslationContext'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setIsVisible(true)
    } else {
      const savedPreferences = JSON.parse(consent)
      setPreferences(savedPreferences)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true
    }
    setPreferences(allAccepted)
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
    setIsVisible(false)
    // Ici vous pouvez initialiser tous les cookies/trackers
    initializeCookies(allAccepted)
  }

  const handleRejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false
    }
    setPreferences(onlyEssential)
    localStorage.setItem('cookie-consent', JSON.stringify(onlyEssential))
    setIsVisible(false)
    // Ici vous pouvez supprimer les cookies non essentiels
    removeNonEssentialCookies()
  }

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    setIsVisible(false)
    // Appliquer les préférences
    if (preferences.analytics) {
      initializeAnalytics()
    }
    if (preferences.marketing) {
      initializeMarketing()
    }
    if (!preferences.analytics || !preferences.marketing) {
      removeNonEssentialCookies()
    }
  }

  const initializeCookies = (prefs: CookiePreferences) => {
    if (prefs.analytics) {
      initializeAnalytics()
    }
    if (prefs.marketing) {
      initializeMarketing()
    }
  }

  const initializeAnalytics = () => {
    // Initialiser Google Analytics ou autres outils d'analyse
    console.log('Analytics cookies initialized')
  }

  const initializeMarketing = () => {
    // Initialiser les cookies marketing
    console.log('Marketing cookies initialized')
  }

  const removeNonEssentialCookies = () => {
    // Supprimer les cookies non essentiels
    console.log('Non-essential cookies removed')
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="card-bg rounded-2xl p-6 shadow-2xl border border-white/10">
          {!showPreferences ? (
            // Vue principale
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faCookie} className="text-brand-gold text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {t('cookies.title')}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {t('cookies.description')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="bg-white/10 text-white font-medium py-2 px-4 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faCog} />
                  {t('cookies.customize')}
                </button>
                <button
                  onClick={handleRejectAll}
                  className="bg-gray-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {t('cookies.rejectAll')}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="btn-gold text-black font-semibold py-2 px-6 rounded-lg shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300"
                >
                  {t('cookies.acceptAll')}
                </button>
              </div>
            </div>
          ) : (
            // Vue des préférences
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Préférences des cookies
                </h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Cookies essentiels */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">Cookies essentiels</h4>
                    <p className="text-gray-300 text-sm mb-2">
                      Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
                    </p>
                    <p className="text-xs text-gray-400">
                      Fonctionnalités : panier d'achat, authentification, sécurité
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-brand-green rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Cookies analytiques */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">Cookies analytiques</h4>
                    <p className="text-gray-300 text-sm mb-2">
                      Ces cookies nous aident à comprendre comment vous utilisez notre site.
                    </p>
                    <p className="text-xs text-gray-400">
                      Outils : Google Analytics, mesure d'audience
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.analytics ? 'bg-brand-gold' : 'bg-gray-600'
                      }`}
                      aria-label={`Toggle analytics cookies ${preferences.analytics ? 'on' : 'off'}`}
                      role="switch"
                      aria-checked={preferences.analytics}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                </div>

                {/* Cookies marketing */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">Cookies marketing</h4>
                    <p className="text-gray-300 text-sm mb-2">
                      Ces cookies permettent de personnaliser les publicités et le contenu.
                    </p>
                    <p className="text-xs text-gray-400">
                      Outils : Facebook Pixel, Google Ads, publicité personnalisée
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.marketing ? 'bg-brand-gold' : 'bg-gray-600'
                      }`}
                      aria-label={`Toggle marketing cookies ${preferences.marketing ? 'on' : 'off'}`}
                      role="switch"
                      aria-checked={preferences.marketing}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={handleRejectAll}
                  className="bg-gray-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Refuser tout
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="btn-gold text-black font-semibold py-3 px-6 rounded-lg shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 flex-1"
                >
                  Enregistrer mes préférences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



