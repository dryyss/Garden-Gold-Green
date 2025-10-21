'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Types pour les langues supportées
export type SupportedLanguage = 'fr' | 'en' | 'es' | 'nl'

// Interface pour les traductions
interface Translations {
  [key: string]: any
}

// Interface pour le contexte
interface TranslationContextType {
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
  t: (key: string) => string
  isLoading: boolean
}

// Création du contexte
const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Hook pour utiliser le contexte
export const useTranslation = () => {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}

// Fonction pour obtenir la langue par défaut basée sur le navigateur
const getDefaultLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return 'fr' // SSR fallback
  
  const browserLang = navigator.language.toLowerCase()
  
  // Détection des langues supportées
  if (browserLang.startsWith('fr')) return 'fr'
  if (browserLang.startsWith('en')) return 'en'
  if (browserLang.startsWith('es')) return 'es'
  if (browserLang.startsWith('nl')) return 'nl'
  
  // Si la langue n'est pas supportée, retourner l'anglais par défaut
  return 'en'
}

// Fonction pour charger les traductions
const loadTranslations = async (language: SupportedLanguage): Promise<Translations> => {
  try {
    // Import dynamique des traductions principales
    const mainTranslations = await import(`@/locales/${language}.json`)
    
    // Charger les traductions spécialisées
    const [contactTranslations, faqTranslations] = await Promise.all([
      import(`@/locales/contact-${language}.json`).catch(() => ({ default: {} })),
      import(`@/locales/faq-${language}.json`).catch(() => ({ default: {} }))
    ])
    
    // Fusionner toutes les traductions
    return {
      ...mainTranslations.default,
      contact: contactTranslations.default,
      faq: faqTranslations.default
    }
  } catch (error) {
    console.error(`Erreur lors du chargement des traductions pour ${language}:`, error)
    // Fallback vers le français si la langue n'est pas trouvée
    if (language !== 'fr') {
      try {
        const fallbackTranslations = await import('@/locales/fr.json')
        return fallbackTranslations.default
      } catch (fallbackError) {
        console.error('Failed to load fallback translations:', fallbackError)
        return {}
      }
    }
    return {}
  }
}

// Fonction utilitaire pour obtenir une valeur imbriquée dans un objet
const getNestedValue = (obj: any, path: string): string => {
  const result = path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined
  }, obj)
  
  // Si la traduction n'est pas trouvée, essayer des fallbacks
  if (!result) {
    const fallbacks: { [key: string]: string } = {
      'products.new': 'Nouveau',
      'products.bestSeller': 'Best-seller',
      'products.inStock': 'En stock',
      'products.outOfStock': 'Rupture de stock',
      'products.quantity': 'Quantité',
      'products.viewDetails': 'Voir les détails',
      'products.addToCart': 'Ajouter au panier',
      'products.adding': 'Ajout...',
      'products.added': 'Ajouté !',
      'actions.increase': 'Augmenter',
      'actions.decrease': 'Diminuer',
      'cart.inCart': 'dans le panier'
    }
    
    return fallbacks[path] || path
  }
  
  return result
}

// Props pour le provider
interface TranslationProviderProps {
  children: ReactNode
}

// Provider principal
export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('fr')
  const [translations, setTranslations] = useState<Translations>({})
  const [isLoading, setIsLoading] = useState(true)

  // Fonction pour changer de langue
  const setLanguage = async (newLanguage: SupportedLanguage) => {
    if (newLanguage === language) return
    
    setIsLoading(true)
    try {
      const newTranslations = await loadTranslations(newLanguage)
      setTranslations(newTranslations)
      setLanguageState(newLanguage)
      
      // Sauvegarder la préférence dans localStorage
      localStorage.setItem('preferred-language', newLanguage)
      
      // Mettre à jour l'attribut lang du HTML
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLanguage
      }
    } catch (error) {
      console.error('Erreur lors du changement de langue:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de traduction
  const t = (key: string): string => {
    return getNestedValue(translations, key)
  }

  // Initialisation au montage du composant
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Vérifier s'il y a une préférence sauvegardée
        const savedLanguage = localStorage.getItem('preferred-language') as SupportedLanguage
        
        // Utiliser la langue sauvegardée ou détecter automatiquement
        const initialLanguage = savedLanguage && ['fr', 'en', 'es', 'nl'].includes(savedLanguage) 
          ? savedLanguage 
          : getDefaultLanguage()
        
        // Charger les traductions
        const initialTranslations = await loadTranslations(initialLanguage)
        setTranslations(initialTranslations)
        setLanguageState(initialLanguage)
        
        // Mettre à jour l'attribut lang du HTML
        if (typeof document !== 'undefined') {
          document.documentElement.lang = initialLanguage
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des traductions:', error)
        // Fallback vers le français
        const fallbackTranslations = await loadTranslations('fr')
        setTranslations(fallbackTranslations)
        setLanguageState('fr')
      } finally {
        setIsLoading(false)
      }
    }

    initializeLanguage()
  }, [])

  const value: TranslationContextType = {
    language,
    setLanguage,
    t,
    isLoading
  }

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

// Hook pour obtenir la langue actuelle
export const useLanguage = (): SupportedLanguage => {
  const { language } = useTranslation()
  return language
}

// Hook pour obtenir la fonction de traduction
export const useT = () => {
  const { t } = useTranslation()
  return t
}

// Hook pour changer de langue
export const useSetLanguage = () => {
  const { setLanguage } = useTranslation()
  return setLanguage
}

