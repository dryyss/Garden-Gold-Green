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
  faCog,
  faPhone,
  faEnvelope,
  faTruck,
  faPercent
} from '@fortawesome/free-solid-svg-icons'
import { 
  faFacebook, 
  faTwitter, 
  faInstagram, 
  faLinkedin, 
  faWhatsapp 
} from '@fortawesome/free-brands-svg-icons'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { SearchModal } from './SearchModal'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { state, dispatch } = useCart()
  const { state: authState, logout, isAdmin } = useAuth()

  // Gérer le scroll pour réduire la barre jaune
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const categoryTabs = [
    { name: 'Promos -50%', href: '/products?category=promo', badge: 'HOT', color: 'text-red-500' },
    { name: 'Fleurs CBD', href: '/products?category=fleurs-cbd' },
    { name: 'Résines', href: '/products?category=resines' },
    { name: 'Nos packs', href: '/products?category=packs' },
    { name: 'E-liquides/Vap Pens', href: '/products?category=liquides' },
    { name: 'Huiles CBD', href: '/products?category=huiles-cbd' },
    { name: 'Accessoires', href: '/products?category=accessoires' },
    { name: 'LIQUIDATIONS', href: '/products?category=liquidations', special: true },
  ]

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
    <header className="sticky top-0 z-50 bg-brand-black transition-all duration-300">
      {/* Top Bar - Info Contact et Livraison */}
      <div className="bg-gradient-to-r from-brand-green to-emerald-600 border-b border-emerald-700">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between py-2 text-xs sm:text-sm">
            {/* Contact Info */}
            <div className="flex items-center space-x-4 sm:space-x-6 mb-2 sm:mb-0">
              <a href="tel:+33778823840" className="flex items-center space-x-1 sm:space-x-2 text-white hover:text-brand-gold transition-colors">
                <FontAwesomeIcon icon={faPhone} className="w-3 h-3" />
                <span className="hidden sm:inline">+33 7 78 82 38 40</span>
              </a>
              <a href="mailto:contact@gardengoldgreen.com" className="flex items-center space-x-1 sm:space-x-2 text-white hover:text-brand-gold transition-colors">
                <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" />
                <span className="hidden md:inline">contact@gardengoldgreen.com</span>
              </a>
            </div>

            {/* Promo Info */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="flex items-center space-x-2 text-white">
                <FontAwesomeIcon icon={faTruck} className="w-3 h-3 sm:w-4 sm:h-4 text-brand-gold" />
                <span className="font-semibold">Livraison offerte à partir de 50€</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2 text-white">
                <FontAwesomeIcon icon={faPercent} className="w-3 h-3 sm:w-4 sm:h-4 text-brand-gold" />
                <span className="font-semibold">10% offert dès 90€ 🎁</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="hidden lg:flex items-center space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-gold transition-colors">
                <FontAwesomeIcon icon={faFacebook} className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-gold transition-colors">
                <FontAwesomeIcon icon={faTwitter} className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-gold transition-colors">
                <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-gold transition-colors">
                <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4" />
              </a>
              <a href="https://wa.me/33778823840" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-gold transition-colors">
                <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar - Logo, Search, Actions */}
      <div className="bg-brand-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex justify-between items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image 
                className="h-14 w-14 sm:h-16 sm:w-16" 
                src="/logo.png" 
                alt="Garden Gold Green logo"
                width={64}
                height={64}
              />
              <span className="hidden sm:block text-white text-xl sm:text-2xl font-bold tracking-wider ml-3">
                GARDEN GOLD GREEN
              </span>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-brand-gold transition-colors duration-300 text-sm xl:text-base font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search button */}
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="text-gray-300 hover:text-brand-gold transition-colors duration-300 p-2"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5" />
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
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
            className="relative text-gray-300 hover:text-brand-gold transition-colors duration-300 p-2"
            data-cart-icon
          >
            <FontAwesomeIcon icon={faCartShopping} className="icon-responsive-md" />
            {state.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-green text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                {state.totalItems}
              </span>
            )}
          </button>

              {/* Mobile menu button */}
              <button
                className="lg:hidden text-gray-300 hover:text-brand-gold transition-colors duration-300 p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation Tabs - Se réduit au scroll */}
      <div className={`
        hidden lg:block bg-brand-gold border-b border-yellow-600 overflow-hidden
        transition-all duration-300
        ${isScrolled ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'}
      `}>
        <div className="container mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between py-3">
            {categoryTabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`
                  relative px-3 xl:px-4 py-2 text-sm xl:text-base font-semibold transition-all duration-300
                  ${tab.special 
                    ? 'bg-red-600 text-white rounded-md hover:bg-red-700 animate-pulse' 
                    : tab.color 
                    ? `${tab.color} hover:text-white` 
                    : 'text-black hover:text-white'
                  }
                `}
              >
                {tab.name}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-brand-black/95 backdrop-blur-sm border-t border-white/10">
          <div className="px-6 py-4 space-y-4">
            {/* Category Tabs - Mobile */}
            <div className="border-b border-white/10 pb-4 mb-4">
              <h3 className="text-brand-gold text-sm font-semibold mb-3 uppercase">Catégories</h3>
              <div className="space-y-2">
                {categoryTabs.map((tab) => (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${tab.special 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{tab.name}</span>
                    {tab.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

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

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </header>
  )
}
