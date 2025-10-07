'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faEdit,
  faSave,
  faTimes,
  faCog,
  faShoppingBag,
  faHeart
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

function ProfileContent() {
  const { state: authState, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: authState.user?.firstName || '',
    lastName: authState.user?.lastName || '',
    email: authState.user?.email || '',
    phone: authState.user?.phone || '',
    address: authState.user?.address || '',
    city: authState.user?.city || '',
    zipCode: authState.user?.zipCode || '',
    country: authState.user?.country || 'France'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: authState.user?.firstName || '',
      lastName: authState.user?.lastName || '',
      email: authState.user?.email || '',
      phone: authState.user?.phone || '',
      address: authState.user?.address || '',
      city: authState.user?.city || '',
      zipCode: authState.user?.zipCode || '',
      country: authState.user?.country || 'France'
    })
    setIsEditing(false)
  }

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Mon Profil</h1>
          <p className="text-gray-400">Gérez vos informations personnelles et préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-bg rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faUser} className="text-brand-gold text-2xl" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {authState.user?.firstName} {authState.user?.lastName}
                </h2>
                <p className="text-gray-400">{authState.user?.email}</p>
              </div>

              <nav className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 p-3 rounded-lg bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>Informations personnelles</span>
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 transition-colors"
                >
                  <FontAwesomeIcon icon={faShoppingBag} />
                  <span>Mes commandes</span>
                </Link>
                <Link
                  href="/favorites"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 transition-colors"
                >
                  <FontAwesomeIcon icon={faHeart} />
                  <span>Mes favoris</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 transition-colors"
                >
                  <FontAwesomeIcon icon={faCog} />
                  <span>Paramètres</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card-bg rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Informations personnelles</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-gold text-black font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="bg-brand-green text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faSave} />
                      Sauvegarder
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      Annuler
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Informations de base</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                          isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                          isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Informations de contact</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                          isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                          isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                        }`}
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                    Adresse
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                          isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                        }`}
                        placeholder="123 Rue de la Paix"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Ville
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                            isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                          }`}
                          placeholder="Paris"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Code postal
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                            isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                          }`}
                          placeholder="75001"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Pays
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                            isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                          }`}
                        >
                          <option value="France">France</option>
                          <option value="Belgique">Belgique</option>
                          <option value="Suisse">Suisse</option>
                          <option value="Canada">Canada</option>
                          <option value="États-Unis">États-Unis</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faEdit,
  faSave,
  faTimes,
  faCog,
  faShoppingBag,
  faHeart
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

function ProfileContent() {
  const { state: authState, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: authState.user?.firstName || '',
    lastName: authState.user?.lastName || '',
    email: authState.user?.email || '',
    phone: authState.user?.phone || '',
    address: authState.user?.address || '',
    city: authState.user?.city || '',
    zipCode: authState.user?.zipCode || '',
    country: authState.user?.country || 'France'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: authState.user?.firstName || '',
      lastName: authState.user?.lastName || '',
      email: authState.user?.email || '',
      phone: authState.user?.phone || '',
      address: authState.user?.address || '',
      city: authState.user?.city || '',
      zipCode: authState.user?.zipCode || '',
      country: authState.user?.country || 'France'
    })
    setIsEditing(false)
  }

  return (
    <main className="bg-brand-black min-h-screen pt-24">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Mon Profil</h1>
          <p className="text-gray-400">Gérez vos informations personnelles et préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-bg rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faUser} className="text-brand-gold text-2xl" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {authState.user?.firstName} {authState.user?.lastName}
                </h2>
                <p className="text-gray-400">{authState.user?.email}</p>
              </div>

              <nav className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 p-3 rounded-lg bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>Informations personnelles</span>
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 transition-colors"
                >
                  <FontAwesomeIcon icon={faShoppingBag} />
                  <span>Mes commandes</span>
                </Link>
                <Link
                  href="/favorites"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 transition-colors"
                >
                  <FontAwesomeIcon icon={faHeart} />
                  <span>Mes favoris</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 transition-colors"
                >
                  <FontAwesomeIcon icon={faCog} />
                  <span>Paramètres</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card-bg rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Informations personnelles</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-gold text-black font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="bg-brand-green text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faSave} />
                      Sauvegarder
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      Annuler
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Informations de base</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                          isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                          isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Informations de contact</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                          isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                          isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                        }`}
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                    Adresse
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                          isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                        }`}
                        placeholder="123 Rue de la Paix"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Ville
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                            isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                          }`}
                          placeholder="Paris"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Code postal
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                            isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                          }`}
                          placeholder="75001"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Pays
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 ${
                            isEditing ? 'border-white/20' : 'border-white/10 bg-white/5'
                          }`}
                        >
                          <option value="France">France</option>
                          <option value="Belgique">Belgique</option>
                          <option value="Suisse">Suisse</option>
                          <option value="Canada">Canada</option>
                          <option value="États-Unis">États-Unis</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}