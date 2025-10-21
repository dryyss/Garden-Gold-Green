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
import { useTranslation } from '@/contexts/TranslationContext'
import { SearchModal } from './SearchModal'
import { AuthModal } from './AuthModal'
import { LanguageSelector } from './LanguageSelector'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showFloatingCart, setShowFloatingCart] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const { state, dispatch } = useCart()
  const { state: authState, logout } = useAuth()
  const { t } = useTranslation()
  const user = authState.user
  const isLoading = authState.isLoading

  // Gérer le scroll pour réduire la barre jaune et afficher le panier flottant
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)
      setShowFloatingCart(scrollY > 200) // Afficher le panier après 200px de scroll
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
    { name: t('header.categories.promos'), href: '/products?category=promo', badge: 'HOT', color: 'text-red-500' },
    { name: t('header.categories.flowers'), href: '/products?category=fleurs-cbd' },
    { name: t('header.categories.resins'), href: '/products?category=resines' },
    { name: t('header.categories.packs'), href: '/products?category=packs' },
    { name: t('header.categories.liquids'), href: '/products?category=liquides' },
    { name: t('header.categories.oils'), href: '/products?category=huiles-cbd' },
    { name: t('header.categories.accessories'), href: '/products?category=accessoires' },
    { name: t('header.categories.liquidations'), href: '/products?category=liquidations', special: true },
  ]

  const navigation = [
    { name: t('header.navigation.home'), href: '/' },
    { name: t('header.navigation.shop'), href: '/products' },
    { name: t('header.navigation.about'), href: '/about' },
    { name: t('header.navigation.learn'), href: '/learn' },
    { name: t('header.navigation.blog'), href: '/blog' },
    { name: t('header.navigation.contact'), href: '/contact' },
    { name: t('header.navigation.faq'), href: '/faq' },
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
                <span className="hidden sm:inline">{t('header.phone')}</span>
              </a>
              <a href="mailto:contact@gardengoldgreen.com" className="flex items-center space-x-1 sm:space-x-2 text-white hover:text-brand-gold transition-colors">
                <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" />
                <span className="hidden md:inline">{t('header.email')}</span>
              </a>
            </div>

            {/* Promo Info */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="flex items-center space-x-2 text-white">
                <FontAwesomeIcon icon={faTruck} className="w-3 h-3 sm:w-4 sm:h-4 text-brand-gold" />
                <span className="font-semibold">{t('header.freeShipping')}</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2 text-white">
                <FontAwesomeIcon icon={faPercent} className="w-3 h-3 sm:w-4 sm:h-4 text-brand-gold" />
                <span className="font-semibold">{t('header.discount')}</span>
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

      {/* Main Navbar - Logo, Navigation, Search, Actions */}
      <div className="bg-brand-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex justify-between items-center gap-4">
            {/* Logo - Plus gros */}
            <Link href="/" className="flex items-center flex-shrink-0 group">
              <div className="relative">
                <Image 
                  className="h-20 w-20 sm:h-24 sm:w-24 drop-shadow-2xl group-hover:scale-105 transition-transform duration-300" 
                  src="/logo.png" 
                  alt="Garden Gold Green logo"
                  width={96}
                  height={96}
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-brand-gold/30 to-brand-green/30 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-brand-gold/15 to-brand-green/15 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
              </div>
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
              {/* Language Selector */}
              <LanguageSelector variant="header" />
              
              {/* Search button */}
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="text-gray-300 hover:text-brand-gold transition-colors duration-300 p-2"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5" />
              </button>
          
          {/* User Menu */}
          {user ? (
            <div className="relative user-menu-container">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-gray-300 hover:text-brand-gold transition-colors duration-300 flex items-center space-x-2 p-2"
              >
                <FontAwesomeIcon icon={faUserCircle} className="icon-responsive-md" />
                <span className="hidden lg:block text-sm">{user.name || user.email}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-brand-black border border-white/10 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm text-white font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FontAwesomeIcon icon={faUser} className="icon-sm mr-2" />
                      {t('header.user.profile')}
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="icon-sm mr-2" />
                      {t('header.user.orders')}
                    </Link>
                    <Link
                      href="/api/auth/logout"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="icon-sm mr-2" />
                      {t('header.user.logout')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/api/auth/login"
                className="text-gray-300 hover:text-brand-gold transition-colors duration-300 px-3 py-2 text-sm font-medium"
              >
                {t('header.user.login')}
              </Link>
              <Link
                href="/api/auth/login?screen_hint=signup"
                className="bg-brand-gold text-black font-semibold px-4 py-2 rounded-full text-sm hover:shadow-gold-glow transition-all duration-300"
              >
                {t('header.user.register')}
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
            {/* Titre du menu mobile */}
            <div className="flex items-center justify-center pb-4 border-b border-white/10">
              <span className="text-white text-lg font-bold tracking-wider drop-shadow-lg">
                {t('header.title')}
              </span>
            </div>
            
            {/* Category Tabs - Mobile */}
            <div className="border-b border-white/10 pb-4 mb-4">
              <h3 className="text-brand-gold text-sm font-semibold mb-3 uppercase">{t('header.categories.title')}</h3>
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
            
            {/* Language Selector Mobile */}
            <div className="border-t border-white/10 pt-4">
              <LanguageSelector variant="mobile" />
            </div>
            
            {/* Mobile User Actions */}
            <div className="border-t border-white/10 pt-4 mt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 py-2">
                    <FontAwesomeIcon icon={faUserCircle} className="text-brand-gold" />
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span>{t('header.user.profile')}</span>
                  </Link>
                  
                  <Link
                    href="/orders"
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                    <span>{t('header.user.orders')}</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 text-gray-300 hover:text-brand-gold transition-colors py-2 w-full text-left"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>{t('header.user.logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setAuthMode('login')
                      setShowAuthModal(true)
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 text-gray-300 hover:text-brand-gold transition-colors py-2 w-full text-left"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span>{t('header.user.login')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register')
                      setShowAuthModal(true)
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 bg-brand-gold text-black font-semibold px-4 py-2 rounded-full hover:shadow-gold-glow transition-all duration-300 w-full justify-center"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span>{t('header.user.register')}</span>
                  </button>
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

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      {/* Panier flottant - apparaît quand on scrolle */}
      {showFloatingCart && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
            className="relative bg-brand-black hover:bg-brand-black/90 text-white border border-brand-gold p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
          >
            <FontAwesomeIcon icon={faCartShopping} className="text-xl text-brand-gold" />
            {state.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-black text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                {state.totalItems}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  )
}
