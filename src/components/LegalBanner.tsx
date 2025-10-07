'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGavel, faShieldAlt, faTimes } from '@fortawesome/free-solid-svg-icons'

export function LegalBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-amber-900/20 border-b border-amber-800/30">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faGavel} className="text-amber-400 text-sm" />
            <p className="text-xs text-amber-200">
              ⚠️ <strong>Important :</strong> Les produits CBD ne sont pas des médicaments. 
              Consultez votre médecin avant utilisation. Vente réservée aux personnes majeures.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 text-xs">
              <Link 
                href="/terms" 
                className="text-amber-200 hover:text-amber-100 transition-colors flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faGavel} className="text-xs" />
                CGV
              </Link>
              <Link 
                href="/privacy" 
                className="text-amber-200 hover:text-amber-100 transition-colors flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faShieldAlt} className="text-xs" />
                Confidentialité
              </Link>
            </div>
            
            <button
              onClick={() => setIsVisible(false)}
              className="text-amber-400 hover:text-amber-200 transition-colors p-1"
            >
              <FontAwesomeIcon icon={faTimes} className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
