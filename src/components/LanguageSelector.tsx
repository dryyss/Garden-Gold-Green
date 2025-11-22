'use client'

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { useTranslation, useLanguage } from '@/contexts/TranslationContext'

// Configuration des langues supportées
const languages = [
  { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
  { code: 'en' as const, name: 'English', flag: '🇬🇧' },
  { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
  { code: 'nl' as const, name: 'Nederlands', flag: '🇳🇱' }
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

  // Trouver la langue actuelle
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]

  // Styles selon la variante
  const getStyles = () => {
    switch (variant) {
      case 'header':
        return {
          container: 'inline-flex items-center justify-center gap-2 text-gray-300 hover:text-brand-gold transition-colors duration-300 p-2 whitespace-nowrap',
        }
      case 'footer':
        return {
          container: 'inline-flex items-center justify-center gap-2 text-gray-400 hover:text-brand-gold transition-colors duration-300 p-2 whitespace-nowrap',
        }
      case 'mobile':
        return {
          container: 'flex items-center space-x-3 text-gray-300 py-2',
        }
      default:
        return {
          container: 'inline-flex items-center justify-center gap-2 text-gray-300 hover:text-brand-gold transition-colors duration-300 p-2',
        }
    }
  }

  const styles = getStyles()

  return (
    <div className={`${styles.container} ${className}`} aria-label={t('common.language')}>
      <FontAwesomeIcon icon={faGlobe} className="w-4 h-4" />
      <span className="text-sm font-semibold">{currentLang.code.toUpperCase()}</span>
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

