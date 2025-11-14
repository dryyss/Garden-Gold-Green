'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useAuth0Context } from '@/contexts/Auth0Context'
import { ProtectedRoute } from '@/components/ProtectedRoute'

function ProfileContent() {
  const { state: authState } = useAuth()
  const { state: auth0State } = useAuth0Context()
  
  const user = auth0State.user || authState.user

  return (
    <div className="bg-brand-black min-h-screen text-gray-300 pt-24">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold gold-text-gradient mb-8">Mon Profil</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Summary */}
            <div className="lg:col-span-1">
              <div className="card-bg rounded-xl p-6 sticky top-32">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-brand-gold">
                      {user?.firstName?.charAt(0) || ''}{user?.lastName?.charAt(0) || ''}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-400">{user?.email}</p>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Membre depuis</span>
                    <span className="text-white">
                      {user?.createdAt ? 
                        new Date(user.createdAt).toLocaleDateString('fr-FR') : 
                        'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dernière mise à jour</span>
                    <span className="text-white">
                      {user?.updatedAt ? 
                        new Date(user.updatedAt).toLocaleDateString('fr-FR') : 
                        'N/A'
                      }
                    </span>
                  </div>
                  {user?.id && (
                    <div className="pt-3 border-t border-white/10">
                      <div className="text-xs">
                        <span className="text-gray-500">ID:</span>
                        <p className="text-gray-400 font-mono break-all mt-1">{user.id}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="card-bg rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Informations personnelles</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Prénom</label>
                      <p className="text-white">{user?.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Nom</label>
                      <p className="text-white">{user?.lastName}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <p className="text-white">{user?.email}</p>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Téléphone</label>
                    <p className="text-white">{user?.phone || 'Non renseigné'}</p>
                  </div>
                </div>

                {/* Address Information */}
                <div className="card-bg rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Adresse de livraison</h3>
                  
                  {user?.address ? (
                    <div className="space-y-2">
                      <p className="text-white">{user.address.street}</p>
                      <p className="text-white">
                        {user.address.postalCode} {user.address.city}
                      </p>
                      <p className="text-white">{user.address.country}</p>
                    </div>
                  ) : (
                    <p className="text-gray-400">Aucune adresse renseignée</p>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="card-bg rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Actions rapides</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href="/orders"
                      className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left block"
                    >
                      <h4 className="text-white font-medium mb-1">Mes commandes</h4>
                      <p className="text-gray-400 text-sm">Voir l'historique de vos commandes</p>
                    </Link>
                    
                    <button
                      onClick={() => {/* TODO: Implémenter les favoris */}}
                      className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                    >
                      <h4 className="text-white font-medium mb-1">Mes favoris</h4>
                      <p className="text-gray-400 text-sm">Produits sauvegardés</p>
                    </button>
                    
                    <button
                      onClick={() => {/* TODO: Implémenter les paramètres de notification */}}
                      className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                    >
                      <h4 className="text-white font-medium mb-1">Notifications</h4>
                      <p className="text-gray-400 text-sm">Gérer vos préférences</p>
                    </button>
                    
                    <button
                      onClick={() => {/* TODO: Implémenter l'aide */}}
                      className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                    >
                      <h4 className="text-white font-medium mb-1">Aide & Support</h4>
                      <p className="text-gray-400 text-sm">Centre d'aide et contact</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}
