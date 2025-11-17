'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faEdit, faCreditCard, faPaperPlane, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { ResponsiveContainer } from '@/components/ResponsiveContainer'
import { ResponsiveCard } from '@/components/ResponsiveCard'
import { ResponsiveButton } from '@/components/ResponsiveButton'
import { ResponsiveInput } from '@/components/ResponsiveInput'

export default function ProfilePage() {
  const { user, error, isLoading } = useUser()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPortalLoading, setIsPortalLoading] = useState(false)
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [formData, setFormData] = useState({
    name: '',
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
    if (!isLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        address: user.user_metadata?.address || {
          street: '',
          city: '',
          postalCode: '',
          country: 'France'
        }
      })
    }
  }, [user, isLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          address: formData.address
        }),
      })

      if (response.ok) {
        setIsEditing(false)
        // Afficher une notification de succès
        alert('Profil mis à jour avec succès!')
      } else {
        alert('Erreur lors de la mise à jour du profil')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Erreur lors de la mise à jour du profil')
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpenStripePortal = async () => {
    setIsPortalLoading(true)
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Erreur lors de la création du portail Stripe')
      }

      const data = await response.json()
      if (!data.url) {
        throw new Error("URL du portail manquante dans la réponse Stripe")
      }
      window.location.href = data.url
    } catch (error) {
      console.error('Erreur ouverture portail Stripe:', error)
      alert("Impossible d'ouvrir le portail Stripe. Réessaie plus tard.")
    } finally {
      setIsPortalLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setIsResendingVerification(true)
    setVerificationMessage(null)
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setVerificationMessage({
          type: 'success',
          text: 'Email de vérification envoyé ! Vérifiez votre boîte de réception.'
        })
      } else {
        setVerificationMessage({
          type: 'error',
          text: data.error || 'Erreur lors de l\'envoi de l\'email de vérification'
        })
      }
    } catch (error) {
      console.error('Erreur renvoi email vérification:', error)
      setVerificationMessage({
        type: 'error',
        text: 'Erreur lors de l\'envoi de l\'email de vérification'
      })
    } finally {
      setIsResendingVerification(false)
    }
  }

  const isEmailVerified = user?.email_verified ?? false

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-gold mx-auto"></div>
          <p className="text-white mt-4">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-brand-black pt-24">
      <ResponsiveContainer size="md" padding="lg">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Mon Profil</h1>
            <p className="text-gray-400">Gérez vos informations personnelles</p>
          </div>

          {/* Email Verification Alert */}
          {!isEmailVerified && (
            <div className="mb-6">
              <ResponsiveCard variant="glass" padding="md" className="border-2 border-yellow-500/50 bg-yellow-500/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <FontAwesomeIcon 
                      icon={faExclamationTriangle} 
                      className="text-yellow-400 text-xl mt-1 flex-shrink-0" 
                    />
                    <div>
                      <h3 className="text-white font-semibold mb-1">Email non vérifié</h3>
                      <p className="text-gray-300 text-sm">
                        Votre adresse email n'a pas encore été vérifiée. Veuillez vérifier votre boîte de réception et cliquer sur le lien de vérification.
                      </p>
                      {verificationMessage && (
                        <p className={`text-sm mt-2 ${
                          verificationMessage.type === 'success' 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {verificationMessage.text}
                        </p>
                      )}
                    </div>
                  </div>
                  <ResponsiveButton
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                    loading={isResendingVerification}
                    variant="primary"
                    className="flex-shrink-0"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="icon-sm mr-2" />
                    {isResendingVerification ? 'Envoi...' : 'Renvoyer l\'email'}
                  </ResponsiveButton>
                </div>
              </ResponsiveCard>
            </div>
          )}

          {/* Profile Card */}
          <ResponsiveCard variant="glass" padding="lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Informations personnelles</h2>
              <ResponsiveButton
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                size="sm"
              >
                <FontAwesomeIcon icon={faEdit} className="icon-sm mr-2" />
                {isEditing ? 'Annuler' : 'Modifier'}
              </ResponsiveButton>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <ResponsiveInput
                label="Nom complet"
                icon={faUser}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={true}
              />

              <ResponsiveInput
                label="Email"
                icon={faEnvelope}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={true}
              />

              <ResponsiveInput
                label="Téléphone"
                icon={faPhone}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="+33 6 00 00 00 00"
              />

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Adresse</h3>
                <div className="space-y-4">
                  <ResponsiveInput
                    label="Rue"
                    icon={faMapMarkerAlt}
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ResponsiveInput
                      label="Ville"
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <ResponsiveInput
                      label="Code postal"
                      type="text"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <ResponsiveInput
                      label="Pays"
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                  <ResponsiveButton
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="ghost"
                    fullWidth={false}
                  >
                    Annuler
                  </ResponsiveButton>
                  <ResponsiveButton
                    type="submit"
                    disabled={isSaving}
                    loading={isSaving}
                    variant="primary"
                    fullWidth={false}
                  >
                    Sauvegarder
                  </ResponsiveButton>
                </div>
              )}
            </form>
          </ResponsiveCard>

          <div className="mt-6">
            <ResponsiveCard variant="glass" padding="lg">
              <h2 className="text-xl font-semibold text-white mb-4">Gestion des paiements</h2>
              <p className="text-gray-400 mb-6">
                Accédez au portail Stripe pour consulter votre historique d’achats, gérer vos moyens de paiement ou mettre à jour vos abonnements.
              </p>
              <ResponsiveButton
                onClick={handleOpenStripePortal}
                variant="primary"
                disabled={isPortalLoading}
                loading={isPortalLoading}
              >
                <FontAwesomeIcon icon={faCreditCard} className="icon-sm mr-2" />
                {isPortalLoading ? 'Ouverture du portail…' : 'Ouvrir le portail Stripe'}
              </ResponsiveButton>
            </ResponsiveCard>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  )
}

