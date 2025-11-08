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
  faPercent,
  faChevronDown,
  faChevronRight,
  faShieldHalved
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
import { useAuth0Context } from '@/contexts/Auth0Context'
import { useTranslation } from '@/contexts/TranslationContext'
import { SearchModal } from './SearchModal'
import { AuthModal } from './AuthModal'
import { LanguageSelector } from './LanguageSelector'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [showFloatingCart, setShowFloatingCart] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true)
  const [isNavigationOpen, setIsNavigationOpen] = useState(true)
  const { state, dispatch } = useCart()
  const { state: authState, logout, isAdmin: isAdminAuth } = useAuth()
  const { state: auth0State, logout: logoutAuth0, isAdmin: isAdminAuth0 } = useAuth0Context()
  const { t } = useTranslation()
  const user = auth0State.user || authState.user
  const isAdmin = auth0State.user ? isAdminAuth0() : isAdminAuth()
  
  // DEBUG: Log pour vérifier le rôle
  useEffect(() => {
    if (user) {
      console.log('🔍 Header - User:', user.email)
      console.log('🔍 Header - Role:', user.role)
      console.log('🔍 Header - Is Admin:', isAdmin)
    }
  }, [user, isAdmin])
  
  // const isLoading = authState.isLoading

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

  const navigationTitle = t('header.navigation.title')
  const navigationLabel = navigationTitle === 'header.navigation.title' ? 'Navigation' : navigationTitle

  return (
    <header className="sticky top-0 z-50 bg-brand-black transition-all duration-300">
      {/* Top Bar - Info Contact et Livraison */}
      <div className="bg-gradient-to-r from-brand-green to-emerald-600 border-b border-emerald-700">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between py-1.5 sm:py-2 text-xs sm:text-sm">
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
      <div className="bg-brand-black/95 backdrop-blur-sm border-b border-white/10 relative z-40 overflow-visible">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 xl:py-6">
          <div
            className={`${isMenuOpen ? 'hidden md:flex' : 'flex'} justify-between items-center gap-2 sm:gap-4`}
          >
            {/* Logo - Hidden on mobile, visible on sm and up */}
            <Link href="/" className="hidden sm:flex items-center flex-shrink-0 group">
              <div className="relative">
                <Image 
                  className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 xl:h-24 xl:w-24 drop-shadow-2xl group-hover:scale-105 transition-transform duration-300" 
                  src="/logo.png" 
                  alt="Garden Gold Green logo"
                  width={96}
                  height={96}
                />
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-brand-gold/30 to-brand-green/30 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-brand-gold/15 to-brand-green/15 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
              </div>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center space-x-6 xl:space-x-8">
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

            {/* Actions - Centered on mobile when logo is hidden */}
            <div className="flex items-center justify-center sm:justify-end flex-1 sm:flex-none space-x-1 sm:space-x-2 lg:space-x-4">
              {/* Language Selector - Hidden on mobile */}
              <div className="hidden sm:block">
                <LanguageSelector variant="header" />
              </div>
              
              {/* Search button */}
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="text-gray-300 hover:text-brand-gold transition-colors duration-300 p-1.5 sm:p-2"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
          
          {/* User Menu */}
          {user ? (
            <div className="relative user-menu-container">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-gray-300 hover:text-brand-gold transition-colors duration-300 flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2"
              >
                <FontAwesomeIcon icon={faUserCircle} className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden lg:block text-xs sm:text-sm">{user.name || user.email}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-brand-black border border-white/20 rounded-md shadow-xl z-50">
                  <div className="py-1">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-xs text-white font-medium truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FontAwesomeIcon icon={faUser} className="w-3 h-3 mr-2" />
                      {t('header.user.profile')}
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="w-3 h-3 mr-2" />
                      {t('header.user.orders')}
                    </Link>
                    <Link
                      href="/track-order"
                      className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FontAwesomeIcon icon={faTruck} className="w-3 h-3 mr-2" />
                      {t('header.user.trackOrder')}
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center px-3 py-2 text-sm text-brand-gold hover:bg-white/10 hover:text-yellow-400 transition-colors border-t border-white/10"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FontAwesomeIcon icon={faShieldHalved} className="w-3 h-3 mr-2" />
                        Admin
                      </Link>
                    )}
                    <Link
                      href="/auth/logout"
                      className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors border-t border-white/10"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="w-3 h-3 mr-2" />
                      {t('header.user.logout')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Link
                href="/auth/login"
                className="text-gray-300 hover:text-brand-gold transition-colors duration-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hidden sm:block"
              >
                {t('header.user.login')}
              </Link>
              <Link
                href="/auth/login?screen_hint=signup"
                className="bg-brand-gold text-black font-semibold px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm hover:shadow-gold-glow transition-all duration-300"
              >
                {t('header.user.register')}
              </Link>
            </div>
          )}

          {/* Cart button */}
          <Link 
            href="/cart"
            className="relative text-gray-300 hover:text-brand-gold transition-colors duration-300 p-1.5 sm:p-2"
            data-cart-icon
          >
            <FontAwesomeIcon icon={faCartShopping} className="w-4 h-4 sm:w-5 sm:h-5" />
            {state.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-green text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                {state.totalItems}
              </span>
            )}
          </Link>

              {/* Mobile menu button */}
              <button
                className="md:hidden text-gray-300 hover:text-brand-gold transition-colors duration-300 p-1.5 sm:p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} className="w-4 h-4 sm:w-5 sm:h-5" />
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
        <div className="md:hidden fixed inset-0 h-full w-full bg-brand-black z-50 overflow-y-auto">
            <div className="px-4 py-3">
              {/* Barre supérieure avec icônes et fermeture */}
              <div className="relative flex flex-col items-center gap-3 mb-3 pb-3 border-b border-white/10">
                <div className="flex items-center justify-center space-x-6">
                  <button onClick={() => setIsSearchModalOpen(true)} className="text-white p-2">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5" />
                  </button>
                  <button className="text-white p-2">
                    <FontAwesomeIcon icon={faUserCircle} className="w-5 h-5" />
                  </button>
                  <Link href="/cart" className="text-white p-2 relative">
                    <FontAwesomeIcon icon={faCartShopping} className="w-5 h-5" />
                    {state.totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-brand-green text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {state.totalItems}
                      </span>
                    )}
                  </Link>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="absolute right-0 top-0 text-white p-2"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                </button>
              </div>

              {/* Titre */}
              <div className="flex items-center justify-center py-2 mb-3 border-b border-white/10">
                <span className="text-white text-base font-bold tracking-wider text-center">
                  {t('header.title')}
                </span>
              </div>

              {/* Sélecteur de langue */}
              <div className="mb-3 pb-3 border-b border-white/10 flex justify-center">
                <LanguageSelector variant="mobile" />
              </div>

              {/* Section utilisateur */}
              {user ? (
                <div className="mb-3 pb-3 border-b border-white/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <FontAwesomeIcon icon={faUserCircle} className="text-brand-gold w-5 h-5" />
                    <div>
                      <p className="text-white font-semibold text-sm text-center">{user.email}</p>
                      <p className="text-gray-400 text-xs text-center">{user.email}</p>
                    </div>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 justify-center text-white hover:text-brand-gold transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                    <span className="text-sm">{t('header.user.profile')}</span>
                  </Link>
                  
                  <Link
                    href="/orders"
                    className="flex items-center space-x-3 justify-center text-white hover:text-brand-gold transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4" />
                    <span className="text-sm">{t('header.user.orders')}</span>
                  </Link>
                  
                  <Link
                    href="/track-order"
                    className="flex items-center space-x-3 justify-center text-white hover:text-brand-gold transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faTruck} className="w-4 h-4" />
                    <span className="text-sm">{t('header.user.trackOrder')}</span>
                  </Link>
                  
                  <Link
                    href="/auth/logout"
                    onClick={(e) => {
                      e.preventDefault()
                      if (auth0State.user) {
                        logoutAuth0()
                      } else {
                        logout()
                      }
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 justify-center text-white hover:text-brand-gold transition-colors py-2"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
                    <span className="text-sm">{t('header.user.logout')}</span>
                  </Link>
                </div>
              ) : (
                <div className="mb-3 pb-3 border-b border-white/10 space-y-2">
                  <button
                    onClick={() => {
                      setAuthMode('register')
                      setShowAuthModal(true)
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-brand-gold text-black font-semibold px-4 py-2 rounded-full hover:shadow-gold-glow transition-all duration-300"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span>{t('header.user.register')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('login')
                      setShowAuthModal(true)
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center space-x-2 text-white hover:text-brand-gold transition-colors py-2"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span>{t('header.user.login')}</span>
                  </button>
                </div>
              )}

              {/* Catégories */}
              <div className="mb-3 pb-3 border-b border-white/10">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="relative w-full flex items-center justify-center px-2 py-2 text-sm font-semibold uppercase tracking-wide text-brand-gold"
                >
                  <span>{t('header.categories.title')}</span>
                  <FontAwesomeIcon
                    icon={isCategoriesOpen ? faChevronDown : faChevronRight}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400"
                  />
                </button>

                {isCategoriesOpen && (
                  <div className="mt-2 space-y-1">
                    {categoryTabs.map((tab) => {
                      const hasSubmenu = !tab.special && tab.name !== t('header.categories.liquidations')
                      const isExpanded = expandedCategories.includes(tab.name)

                      return (
                        <div key={tab.name}>
                          {hasSubmenu ? (
                            <>
                              <button
                                onClick={() => {
                                  if (isExpanded) {
                                    setExpandedCategories(expandedCategories.filter(c => c !== tab.name))
                                  } else {
                                    setExpandedCategories([...expandedCategories, tab.name])
                                  }
                                }}
                                className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium transition-colors text-white hover:text-brand-gold"
                              >
                                <span>{tab.name}</span>
                                <FontAwesomeIcon
                                  icon={isExpanded ? faChevronDown : faChevronRight}
                                  className="w-3 h-3 text-gray-400"
                                />
                              </button>
                              {isExpanded && (
                                <div className="ml-3 mt-1 space-y-0.5 border-l border-white/10 pl-3 pb-2">
                                  <Link
                                    href={tab.href}
                                    className="block px-2 py-1.5 text-xs text-gray-300 hover:text-brand-gold transition-colors text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    Voir tout - {tab.name}
                                  </Link>
                                </div>
                              )}
                            </>
                          ) : (
                            <Link
                              href={tab.href}
                              className={`
                                flex items-center justify-between px-2 py-2 text-sm font-medium transition-colors
                                ${tab.special
                                  ? 'bg-red-600 text-white rounded-md'
                                  : 'text-white hover:text-brand-gold'
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
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Navigation principale */}
              <div className="pb-3 border-b border-white/10">
                <button
                  onClick={() => setIsNavigationOpen(!isNavigationOpen)}
                  className="relative w-full flex items-center justify-center px-2 py-2 text-sm font-semibold uppercase tracking-wide text-white"
                >
                  <span>{navigationLabel}</span>
                  <FontAwesomeIcon
                    icon={isNavigationOpen ? faChevronDown : faChevronRight}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400"
                  />
                </button>

                {isNavigationOpen && (
                  <div className="mt-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block text-white hover:text-brand-gold transition-colors py-2 text-sm font-medium text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
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
