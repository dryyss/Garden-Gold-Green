'use client'

import { useEffect } from 'react'
import { useAuth0 } from '@/hooks/useAuth0'
import { useNotifications } from '@/contexts/NotificationContext'

export function useAuthNotifications() {
  const { user, isAuthenticated, error, isLoading } = useAuth0()
  const { addNotification } = useNotifications()

  // Gérer les notifications d'authentification
  useEffect(() => {
    if (error) {
      addNotification({
        type: 'error',
        title: 'Erreur d\'authentification',
        message: error
      })
    }
  }, [error, addNotification])

  // Gérer les notifications de succès
  useEffect(() => {
    if (isAuthenticated && user) {
      // Vérifier si c'est une nouvelle connexion (pas de chargement initial)
      const isNewLogin = !isLoading && user
      if (isNewLogin) {
        addNotification({
          type: 'success',
          title: 'Connexion réussie',
          message: `Bienvenue ${user.given_name || user.name || 'utilisateur'} !`
        })
      }
    }
  }, [isAuthenticated, user, isLoading, addNotification])

  return {
    addAuthNotification: addNotification
  }
}
