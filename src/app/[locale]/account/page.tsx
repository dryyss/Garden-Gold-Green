'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faShoppingBag, 
  faHeart, 
  faCog,
  faSignOutAlt,
  faEdit
} from '@fortawesome/free-solid-svg-icons'

export default function AccountPage() {
  const { state: authState, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push('/')
    }
  }, [authState.isAuthenticated, router])

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Chargement...</h1>
        </div>
      </div>
    )
  }

  const menuItems = [
    {
      icon: faUser,
      title: 'Informations personnelles',
      description: 'Gérer vos informations de profil',
      href: '/account/profile'
    },
    {
      icon: faShoppingBag,
      title: 'Mes commandes',
      description: 'Voir l\'historique de vos commandes',
      href: '/account/orders'
    },
    {
      icon: faHeart,
      title: 'Favoris',
      description: 'Vos produits préférés',
      href: '/account/favorites'
    },
    {
      icon: faCog,
      title: 'Paramètres',
      description: 'Préférences et confidentialité',
      href: '/account/settings'
    }
  ]

  return (
    <div className="bg-brand-black min-h-screen pt-24">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gold-text-gradient mb-2">
            Mon Compte
          </h1>
          <p className="text-gray-400">
            Bienvenue, {authState.user?.firstName || authState.user?.email}
          </p>
        </div>

        {/* User Info Card */}
        <div className="card-bg rounded-xl p-6 mb-8 border border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-brand-gold/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-2xl text-brand-gold" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white">
                {authState.user?.firstName && authState.user?.lastName 
                  ? `${authState.user.firstName} ${authState.user.lastName}` 
                  : authState.user?.email || 'Utilisateur'}
              </h2>
              <p className="text-gray-400">{authState.user?.email}</p>
              <p className="text-sm text-brand-green">
                {authState.user?.phone && `📞 ${authState.user.phone}`}
              </p>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <FontAwesomeIcon icon={faEdit} className="text-lg" />
            </button>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="card-bg rounded-xl p-6 border border-white/10 hover:border-brand-gold/30 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-gold/30 transition-colors">
                  <FontAwesomeIcon icon={item.icon} className="text-xl text-brand-gold" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/products"
              className="card-bg rounded-xl p-6 border border-white/10 hover:border-brand-green/30 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center group-hover:bg-brand-green/30 transition-colors">
                  <FontAwesomeIcon icon={faShoppingBag} className="text-brand-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Continuer mes achats</h3>
                  <p className="text-sm text-gray-400">Découvrir nos produits</p>
                </div>
              </div>
            </a>

            <a
              href="/account/orders"
              className="card-bg rounded-xl p-6 border border-white/10 hover:border-brand-gold/30 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center group-hover:bg-brand-gold/30 transition-colors">
                  <FontAwesomeIcon icon={faShoppingBag} className="text-brand-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Mes commandes</h3>
                  <p className="text-sm text-gray-400">Suivre mes commandes</p>
                </div>
              </div>
            </a>

            <button
              onClick={logout}
              className="card-bg rounded-xl p-6 border border-white/10 hover:border-red-500/30 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Se déconnecter</h3>
                  <p className="text-sm text-gray-400">Fermer la session</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
