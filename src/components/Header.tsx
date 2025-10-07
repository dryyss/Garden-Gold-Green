'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faMagnifyingGlass, 
  faUser, 
  faCartShopping, 
  faShoppingCart,
  faBars, 
  faXmark,
  faSignOutAlt,
  faUserCircle,
  faCog
} from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { SearchModal } from './SearchModal'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { state } = useCart()
  const { state: authState, logout, isAdmin } = useAuth()

  // Fermer les menus quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        const target = event.target as HTMLElement
        if (!target.closest('.user-menu-container')) {
          setShowUserMenu(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Boutique', href: '/products' },
    { name: 'À propos', href: '/about' },
    { name: 'Apprendre', href: '/learn' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
            <Image 
              className="h-12 w-12 mr-3" 
              src="/logo.png" 
              alt="3G - Garden Gold Green logo, gold, green, and silver colors, luxurious, premium CBD brand"
              width={48}
              height={48}
            />
          <span className="text-white text-xl font-bold tracking-wider">GARDEN GOLD GREEN</span>
        </div>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-300 hover:text-brand-gold transition-colors duration-300 cursor-pointer"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
          {/* Search button */}
          <button 
            onClick={() => setIsSearchModalOpen(true)}
            className="text-gray-300 hover:text-brand-gold transition-colors duration-300 p-2"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="icon-responsive-md" />
          </button>
          
          {/* User Menu */}
          {authState.isAuthenticated ? (
            <div className="relative user-menu-container">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-gray-300 hover:text-brand-gold transition-colors duration-300 flex items-center space-x-2 p-2"
              >
                <FontAwesomeIcon icon={faUserCircle} className="icon-responsive-md" />
                <span className="hidden lg:block text-sm">{authState.user?.firstName || authState.user?.email}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-brand-black border border-white/10 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm text-white font-medium">{authState.user?.firstName} {authState.user?.lastName}</p>
                      <p className="text-xs text-gray-400">{authState.user?.email}</p>
                    </div>
                    {isAdmin() && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-brand-gold hover:bg-white/10 hover:text-white transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FontAwesomeIcon icon={faCog} className="icon-sm mr-2" />
                        Dashboard Admin
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FontAwesomeIcon icon={faUser} className="icon-sm mr-2" />
                      Mon profil
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="icon-sm mr-2" />
                      Mes commandes
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setShowUserMenu(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="icon-sm mr-2" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/auth"
                className="text-gray-300 hover:text-brand-gold transition-colors duration-300 px-3 py-2 text-sm font-medium"
              >
                Connexion
              </Link>
              <Link
                href="/auth"
                className="bg-brand-gold text-black font-semibold px-4 py-2 rounded-full text-sm hover:shadow-gold-glow transition-all duration-300"
              >
                Inscription
              </Link>
            </div>
          )}

          {/* Cart button */}
          <Link 
            href="/cart"
            className="relative text-gray-300 hover:text-brand-gold transition-colors duration-300 p-2"
            data-cart-icon
          >
            <FontAwesomeIcon icon={faCartShopping} className="icon-responsive-md" />
            {state.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-green text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                {state.totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-brand-gold transition-colors duration-300 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} className="icon-responsive-md" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-black/95 backdrop-blur-sm border-t border-white/10">
          <div className="px-6 py-4 space-y-4">
            {/* Navigation Links */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-brand-gold block text-base font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile User Actions */}
            <div className="border-t border-white/10 pt-4 mt-4">
              {authState.isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 py-2">
                    <FontAwesomeIcon icon={faUserCircle} className="text-brand-gold" />
                    <div>
                      <p className="text-white font-medium">{authState.user?.firstName} {authState.user?.lastName}</p>
                      <p className="text-gray-400 text-sm">{authState.user?.email}</p>
                    </div>
                  </div>
                  
                  {isAdmin() && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-3 text-brand-gold hover:text-white transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faCog} />
                      <span>Dashboard Admin</span>
                    </Link>
                  )}
                  
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span>Mon profil</span>
                  </Link>
                  
                  <Link
                    href="/orders"
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                    <span>Mes commandes</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2 w-full text-left"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/auth"
                    className="flex items-center space-x-3 text-gray-300 hover:text-brand-gold transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span>Connexion</span>
                  </Link>
                  <Link
                    href="/auth"
                    className="flex items-center space-x-3 bg-brand-gold text-black font-semibold px-4 py-2 rounded-full hover:shadow-gold-glow transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span>Inscription</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Legal disclaimer banner */}
      <div className="bg-amber-900/20 border-b border-amber-800/30">
        <div className="container mx-auto px-6 py-2">
          <p className="text-xs text-amber-200 text-center">
            ⚠️ Les produits CBD ne sont pas des médicaments. Consultez votre médecin avant utilisation. 
            Vente réservée aux personnes majeures.
          </p>
        </div>
      </div>

            {/* Search Modal */}
            <SearchModal
              isOpen={isSearchModalOpen}
              onClose={() => setIsSearchModalOpen(false)}
            />
          </header>
  )
}
