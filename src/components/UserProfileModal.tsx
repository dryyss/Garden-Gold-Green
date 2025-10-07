'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faXmark, 
  faEnvelope, 
  faUser,
  faPhone,
  faMapMarkerAlt,
  faEdit,
  faSave,
  faSpinner,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/contexts/AuthContext'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    }
  })
  const { state, updateProfile, logout } = useAuth()

  // Charger les données utilisateur dans le formulaire
  useEffect(() => {
    if (state.user) {
      setFormData({
        firstName: state.user.firstName,
        lastName: state.user.lastName,
        email: state.user.email,
        phone: state.user.phone || '',
        address: state.user.address || {
          street: '',
          city: '',
          postalCode: '',
          country: 'France'
        }
      })
    }
  }, [state.user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSave = async () => {
    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch (error) {
      // L'erreur est gérée dans le contexte
    }
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  if (!isOpen || !state.user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-brand-black border border-white/10 rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Mon Profil</h2>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-brand-gold hover:text-brand-green transition-colors p-2"
                title="Modifier le profil"
              >
                <FontAwesomeIcon icon={faEdit} className="text-lg" />
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  disabled={state.isLoading}
                  className="text-brand-green hover:text-green-300 transition-colors p-2 disabled:opacity-50"
                  title="Sauvegarder"
                >
                  {state.isLoading ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-lg" />
                  ) : (
                    <FontAwesomeIcon icon={faSave} className="text-lg" />
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  title="Annuler"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-lg" />
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
              title="Fermer"
            >
              <FontAwesomeIcon icon={faXmark} className="text-lg" />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{state.error}</p>
          </div>
        )}

        {/* Profile Content */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="card-bg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Informations personnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Prénom
                </label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-field w-full pl-12"
                    />
                    <FontAwesomeIcon 
                      icon={faUser} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" 
                    />
                  </div>
                ) : (
                  <p className="text-white">{state.user.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Nom
                </label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-field w-full pl-12"
                    />
                    <FontAwesomeIcon 
                      icon={faUser} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" 
                    />
                  </div>
                ) : (
                  <p className="text-white">{state.user.lastName}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field w-full pl-12"
                  />
                  <FontAwesomeIcon 
                    icon={faEnvelope} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" 
                  />
                </div>
              ) : (
                <p className="text-white">{state.user.email}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Téléphone
              </label>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field w-full pl-12"
                  />
                  <FontAwesomeIcon 
                    icon={faPhone} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" 
                  />
                </div>
              ) : (
                <p className="text-white">{state.user.phone || 'Non renseigné'}</p>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="card-bg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Adresse de livraison</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Adresse
                </label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      className="input-field w-full pl-12"
                      placeholder="123 Rue de la Paix"
                    />
                    <FontAwesomeIcon 
                      icon={faMapMarkerAlt} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" 
                    />
                  </div>
                ) : (
                  <p className="text-white">{state.user.address?.street || 'Non renseignée'}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Ville
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="Paris"
                    />
                  ) : (
                    <p className="text-white">{state.user.address?.city || 'Non renseignée'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Code postal
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="75001"
                    />
                  ) : (
                    <p className="text-white">{state.user.address?.postalCode || 'Non renseigné'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Pays
                  </label>
                  {isEditing ? (
                    <select
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    >
                      <option value="France">France</option>
                      <option value="Belgium">Belgique</option>
                      <option value="Switzerland">Suisse</option>
                      <option value="Germany">Allemagne</option>
                    </select>
                  ) : (
                    <p className="text-white">{state.user.address?.country || 'Non renseigné'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="card-bg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Actions du compte</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => {/* TODO: Implémenter l'historique des commandes */}}
                className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <p className="text-white font-medium">Historique des commandes</p>
                <p className="text-gray-400 text-sm">Voir toutes vos commandes passées</p>
              </button>
              
              <button
                onClick={() => {/* TODO: Implémenter les favoris */}}
                className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <p className="text-white font-medium">Mes favoris</p>
                <p className="text-gray-400 text-sm">Produits sauvegardés</p>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full text-left p-3 bg-red-900/20 hover:bg-red-900/30 rounded-lg transition-colors border border-red-500/30"
              >
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-red-400 mr-3" />
                  <div>
                    <p className="text-red-400 font-medium">Se déconnecter</p>
                    <p className="text-red-300 text-sm">Fermer votre session</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
