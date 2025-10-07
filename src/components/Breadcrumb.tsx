'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faHome } from '@fortawesome/free-solid-svg-icons'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: any
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {/* Accueil */}
      <Link 
        href="/" 
        className="text-gray-400 hover:text-brand-gold transition-colors duration-200 flex items-center"
      >
        <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
        <span className="sr-only">Accueil</span>
      </Link>

      {/* Séparateur */}
      <FontAwesomeIcon icon={faChevronRight} className="text-gray-500 w-3 h-3" />

      {/* Items du breadcrumb */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {item.href ? (
            <Link 
              href={item.href}
              className="text-gray-400 hover:text-brand-gold transition-colors duration-200 flex items-center"
            >
              {item.icon && <FontAwesomeIcon icon={item.icon} className="w-4 h-4 mr-1" />}
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium flex items-center">
              {item.icon && <FontAwesomeIcon icon={item.icon} className="w-4 h-4 mr-1" />}
              {item.label}
            </span>
          )}

          {/* Séparateur (sauf pour le dernier item) */}
          {index < items.length - 1 && (
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-500 w-3 h-3" />
          )}
        </div>
      ))}
    </nav>
  )
}

// Hook pour générer automatiquement les breadcrumbs
export function useBreadcrumb() {
  const generateBreadcrumbs = (pathname: string, productName?: string) => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    let currentPath = ''
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Mapper les segments aux labels français
      let label = segment
      let icon = undefined
      
      switch (segment) {
        case 'products':
          label = 'Boutique'
          break
        case 'cart':
          label = 'Panier'
          break
        case 'checkout':
          label = 'Commande'
          break
        case 'orders':
          label = 'Mes commandes'
          break
        case 'profile':
          label = 'Mon profil'
          break
        case 'about':
          label = 'À propos'
          break
        case 'contact':
          label = 'Contact'
          break
        case 'faq':
          label = 'FAQ'
          break
        case 'learn':
          label = 'Apprendre'
          break
        case 'blog':
          label = 'Blog'
          break
        case 'auth':
          label = 'Connexion'
          break
        case 'search':
          label = 'Recherche'
          break
        case 'admin':
          label = 'Administration'
          break
        case 'privacy':
          label = 'Confidentialité'
          break
        case 'terms':
          label = 'CGV'
          break
        default:
          // Si c'est un slug de produit et qu'on a le nom du produit
          if (index === segments.length - 1 && productName) {
            label = productName
          } else {
            // Capitaliser la première lettre
            label = segment.charAt(0).toUpperCase() + segment.slice(1)
          }
      }

      // Le dernier item n'a pas de lien
      const isLast = index === segments.length - 1
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        icon
      })
    })

    return breadcrumbs
  }

  return { generateBreadcrumbs }
}

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faHome } from '@fortawesome/free-solid-svg-icons'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: any
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {/* Accueil */}
      <Link 
        href="/" 
        className="text-gray-400 hover:text-brand-gold transition-colors duration-200 flex items-center"
      >
        <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
        <span className="sr-only">Accueil</span>
      </Link>

      {/* Séparateur */}
      <FontAwesomeIcon icon={faChevronRight} className="text-gray-500 w-3 h-3" />

      {/* Items du breadcrumb */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {item.href ? (
            <Link 
              href={item.href}
              className="text-gray-400 hover:text-brand-gold transition-colors duration-200 flex items-center"
            >
              {item.icon && <FontAwesomeIcon icon={item.icon} className="w-4 h-4 mr-1" />}
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium flex items-center">
              {item.icon && <FontAwesomeIcon icon={item.icon} className="w-4 h-4 mr-1" />}
              {item.label}
            </span>
          )}

          {/* Séparateur (sauf pour le dernier item) */}
          {index < items.length - 1 && (
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-500 w-3 h-3" />
          )}
        </div>
      ))}
    </nav>
  )
}

// Hook pour générer automatiquement les breadcrumbs
export function useBreadcrumb() {
  const generateBreadcrumbs = (pathname: string, productName?: string) => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    let currentPath = ''
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Mapper les segments aux labels français
      let label = segment
      let icon = undefined
      
      switch (segment) {
        case 'products':
          label = 'Boutique'
          break
        case 'cart':
          label = 'Panier'
          break
        case 'checkout':
          label = 'Commande'
          break
        case 'orders':
          label = 'Mes commandes'
          break
        case 'profile':
          label = 'Mon profil'
          break
        case 'about':
          label = 'À propos'
          break
        case 'contact':
          label = 'Contact'
          break
        case 'faq':
          label = 'FAQ'
          break
        case 'learn':
          label = 'Apprendre'
          break
        case 'blog':
          label = 'Blog'
          break
        case 'auth':
          label = 'Connexion'
          break
        case 'search':
          label = 'Recherche'
          break
        case 'admin':
          label = 'Administration'
          break
        case 'privacy':
          label = 'Confidentialité'
          break
        case 'terms':
          label = 'CGV'
          break
        default:
          // Si c'est un slug de produit et qu'on a le nom du produit
          if (index === segments.length - 1 && productName) {
            label = productName
          } else {
            // Capitaliser la première lettre
            label = segment.charAt(0).toUpperCase() + segment.slice(1)
          }
      }

      // Le dernier item n'a pas de lien
      const isLast = index === segments.length - 1
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        icon
      })
    })

    return breadcrumbs
  }

  return { generateBreadcrumbs }
}
