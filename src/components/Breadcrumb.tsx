'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faHome } from '@fortawesome/free-solid-svg-icons'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      <Link 
        href="/" 
        className="hover:text-brand-gold transition-colors flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
        <span>Accueil</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-gray-600" />
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-brand-gold transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

