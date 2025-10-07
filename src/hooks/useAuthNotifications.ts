'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/contexts/NotificationContext'

export function useAuthNotifications() {
  const { state: authState } = useAuth()
  const { addNotification } = useNotifications()

  // Gérer les notifications d'authentification
  useEffect(() => {
    if (authState.error) {
      addNotification({
        type: 'error',
        title: 'Erreur d\'authentification',
        message: authState.error
      })
    }
  }, [authState.error, addNotification])

  // Gérer les notifications de succès
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      // Vérifier si c'est une nouvelle connexion (pas de chargement initial)
      const isNewLogin = !authState.isLoading && authState.user
      if (isNewLogin) {
        addNotification({
          type: 'success',
          title: 'Connexion réussie',
          message: `Bienvenue ${authState.user.firstName} !`
        })
      }
    }
  }, [authState.isAuthenticated, authState.user, authState.isLoading, addNotification])

  return {
    addAuthNotification: addNotification
  }
}
