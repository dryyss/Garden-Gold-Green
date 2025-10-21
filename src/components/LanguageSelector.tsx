'use client'

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useTranslation, useLanguage, useSetLanguage, SupportedLanguage } from '@/contexts/TranslationContext'

// Configuration des langues supportées
const languages = [
  { code: 'fr' as SupportedLanguage, name: 'Français', flag: '🇫🇷' },
  { code: 'en' as SupportedLanguage, name: 'English', flag: '🇬🇧' },
  { code: 'es' as SupportedLanguage, name: 'Español', flag: '🇪🇸' },
  { code: 'nl' as SupportedLanguage, name: 'Nederlands', flag: '🇳🇱' }
]

interface LanguageSelectorProps {
  variant?: 'header' | 'footer' | 'mobile'
  className?: string
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'header', 
  className = '' 
}) => {
  const { t } = useTranslation()
  const currentLanguage = useLanguage()
  const setLanguage = useSetLanguage()
  const [isOpen, setIsOpen] = useState(false)

  // Trouver la langue actuelle
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]

  const handleLanguageChange = async (languageCode: SupportedLanguage) => {
    if (languageCode !== currentLanguage) {
      await setLanguage(languageCode)
    }
    setIsOpen(false)
  }

  // Styles selon la variante
  const getStyles = () => {
    switch (variant) {
      case 'header':
        return {
          container: 'relative',
          button: 'flex items-center space-x-2 text-gray-300 hover:text-brand-gold transition-colors duration-300 p-2',
          dropdown: 'absolute right-0 mt-2 w-48 bg-brand-black border border-white/10 rounded-lg shadow-lg z-50',
          item: 'flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer'
        }
      case 'footer':
        return {
          container: 'relative',
          button: 'flex items-center space-x-2 text-gray-400 hover:text-brand-gold transition-colors duration-300 p-2',
          dropdown: 'absolute bottom-full mb-2 right-0 w-48 bg-brand-black border border-white/10 rounded-lg shadow-lg z-50',
          item: 'flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer'
        }
      case 'mobile':
        return {
          container: 'relative',
          button: 'flex items-center space-x-3 text-gray-300 hover:text-brand-gold transition-colors py-2 w-full text-left',
          dropdown: 'absolute top-full left-0 mt-2 w-full bg-brand-black border border-white/10 rounded-lg shadow-lg z-50',
          item: 'flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer'
        }
      default:
        return {
          container: 'relative',
          button: 'flex items-center space-x-2 text-gray-300 hover:text-brand-gold transition-colors duration-300 p-2',
          dropdown: 'absolute right-0 mt-2 w-48 bg-brand-black border border-white/10 rounded-lg shadow-lg z-50',
          item: 'flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer'
        }
    }
  }

  const styles = getStyles()

  return (
    <div className={`${styles.container} ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.button}
        aria-label={t('common.language')}
      >
        <FontAwesomeIcon icon={faGlobe} className="w-4 h-4" />
        <span className="ml-2 text-sm font-semibold">{currentLang.code.toUpperCase()}</span>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay pour fermer le dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={styles.dropdown}>
            <div className="py-2">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`
                    ${styles.item}
                    ${lang.code === currentLanguage ? 'bg-white/5 text-brand-gold' : ''}
                  `}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                  {lang.code === currentLanguage && (
                    <span className="ml-auto text-brand-gold">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Composant simple pour afficher la langue actuelle (sans dropdown)
export const CurrentLanguage: React.FC<{ className?: string }> = ({ className = '' }) => {
  const currentLanguage = useLanguage()
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-semibold">{currentLang.code.toUpperCase()}</span>
    </div>
  )
}

