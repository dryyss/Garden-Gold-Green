'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faSave,
  faArrowLeft,
  faEdit
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

export default function ProfilePage() {
  const { state: authState, updateProfile } = useAuth()
  const router = useRouter()
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

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push('/')
      return
    }

    if (authState.user) {
      setFormData({
        firstName: authState.user.firstName || '',
        lastName: authState.user.lastName || '',
        email: authState.user.email || '',
        phone: authState.user.phone || '',
        address: {
          street: authState.user.address?.street || '',
          city: authState.user.address?.city || '',
          postalCode: authState.user.address?.postalCode || '',
          country: authState.user.address?.country || 'France'
        }
      })
    }
  }, [authState.isAuthenticated, authState.user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
    }
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Chargement...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-brand-black min-h-screen pt-36">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/account"
              className="text-gray-400 hover:text-brand-gold transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold gold-text-gradient mb-2">
                Mon Profil
              </h1>
              <p className="text-gray-400">
                Gérez vos informations personnelles
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              isEditing 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30'
            }`}
          >
            <FontAwesomeIcon icon={faEdit} />
            <span>{isEditing ? 'Annuler' : 'Modifier'}</span>
          </button>
        </div>

        {/* Profile Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="card-bg rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <FontAwesomeIcon icon={faUser} className="mr-3 text-brand-gold" />
                Informations personnelles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field w-full pl-12"
                      disabled={!isEditing}
                      required
                    />
                    <FontAwesomeIcon 
                      icon={faEnvelope} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field w-full pl-12"
                      disabled={!isEditing}
                      placeholder="+33 6 12 34 56 78"
                    />
                    <FontAwesomeIcon 
                      icon={faPhone} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="card-bg rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 text-brand-gold" />
                Adresse de livraison
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    disabled={!isEditing}
                    placeholder="123 Rue de la Paix"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      disabled={!isEditing}
                      placeholder="Paris"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      disabled={!isEditing}
                      placeholder="75001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Pays
                    </label>
                    <select
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      disabled={!isEditing}
                    >
                      <option value="France">France</option>
                      <option value="Belgium">Belgique</option>
                      <option value="Switzerland">Suisse</option>
                      <option value="Germany">Allemagne</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="btn-gold text-black font-bold py-3 px-8 rounded-full shadow-gold-glow flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faSave} />
                  <span>Sauvegarder les modifications</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
