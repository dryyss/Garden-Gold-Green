'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

export function LegalBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu le banner
    const hasSeenBanner = localStorage.getItem('garden-gold-green-legal-banner-seen')
    if (!hasSeenBanner) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('garden-gold-green-legal-banner-seen', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1">
            <FontAwesomeIcon 
              icon={faExclamationTriangle} 
              className="text-yellow-500 flex-shrink-0"
            />
            <p className="text-sm text-gray-300">
              <strong className="text-white">Avertissement :</strong> Les produits CBD ne sont pas des médicaments et ne doivent pas se substituer à un traitement médical. 
              Réservé aux personnes majeures. Ne pas utiliser pendant la grossesse ou l'allaitement.
            </p>
          </div>
          <button
            onClick={handleAccept}
            className="text-sm bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-4 py-2 rounded-lg transition-colors flex-shrink-0"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  )
}

