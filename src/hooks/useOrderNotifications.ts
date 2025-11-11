import { useCallback, useEffect, useRef } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { useNotifications } from '@/contexts/NotificationContext'

interface OrderStatus {
  id: string
  status: string
  updatedAt: string
}

export function useOrderNotifications() {
  const { user } = useUser()
  const { addNotification } = useNotifications()
  const lastCheckedRef = useRef<string | null>(null)
  const displayedNotificationsRef = useRef<Set<string>>(new Set())

  const hasHydratedRef = useRef(false)

  const getUserScopedKey = useCallback(
    (suffix: string) => {
      const userKey = user?.sub ?? 'anonymous'
      return `order-notifications:${userKey}:${suffix}`
    },
    [user?.sub]
  )

  const hydrateFromStorage = useCallback(() => {
    if (hasHydratedRef.current) {
      return
    }

    if (typeof window === 'undefined') {
      return
    }

    try {
      const lastCheckedKey = getUserScopedKey('lastChecked')
      const storedLastChecked = localStorage.getItem(lastCheckedKey)
      if (storedLastChecked) {
        lastCheckedRef.current = storedLastChecked
      }

      const displayedKey = getUserScopedKey('displayed')
      const storedDisplayed = localStorage.getItem(displayedKey)
      if (storedDisplayed) {
        const parsed = JSON.parse(storedDisplayed)
        if (Array.isArray(parsed)) {
          displayedNotificationsRef.current = new Set(parsed)
        }
      }

      hasHydratedRef.current = true
    } catch (error) {
      console.warn('Impossible de restaurer les notifications locales', error)
    }
  }, [getUserScopedKey])

  const persistDisplayedNotifications = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      const key = getUserScopedKey('displayed')
      const serialized = JSON.stringify(Array.from(displayedNotificationsRef.current.values()))
      localStorage.setItem(key, serialized)
    } catch (error) {
      console.warn('Impossible de persister les notifications affichées', error)
    }
  }, [getUserScopedKey])

  const persistLastChecked = useCallback(() => {
    if (typeof window === 'undefined') return
    if (!lastCheckedRef.current) return
    try {
      const key = getUserScopedKey('lastChecked')
      localStorage.setItem(key, lastCheckedRef.current)
    } catch (error) {
      console.warn('Impossible de persister la dernière vérification', error)
    }
  }, [getUserScopedKey])

  const checkOrderUpdates = useCallback(async () => {
    try {
      hydrateFromStorage()

      const currentCheckTime = new Date().toISOString()
      const response = await fetch('/api/orders/status-updates', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lastChecked: lastCheckedRef.current ?? null,
          userId: user?.sub ?? null
        })
      })

      if (!response.ok) return

      const data = await response.json()
      const updates = Array.isArray(data.updates) ? data.updates : []

      // Traiter chaque mise à jour
      updates.forEach((update: OrderStatus) => {
        const statusMessages = {
          'paid': 'Votre commande a été confirmée et est en préparation',
          'shipped': 'Votre commande a été expédiée',
          'delivered': 'Votre commande a été livrée',
          'cancelled': 'Votre commande a été annulée',
          'refunded': 'Votre commande a été remboursée'
        }

        const notificationId = `order-${update.id}-${update.updatedAt}`
        if (displayedNotificationsRef.current.has(notificationId)) {
          return
        }

        const message = statusMessages[update.status as keyof typeof statusMessages]
        if (message) {
          addNotification({
            id: notificationId,
            type: 'success',
            title: 'Mise à jour de commande',
            message: `${message} (Commande #${update.id})`,
            duration: 5000
          })
          displayedNotificationsRef.current.add(notificationId)
          persistDisplayedNotifications()
        }
      })

      // Mettre à jour la dernière vérification
      lastCheckedRef.current = currentCheckTime
      persistLastChecked()

    } catch (error) {
      console.error('Erreur lors de la vérification des mises à jour:', error)
    }
  }, [addNotification, hydrateFromStorage, persistDisplayedNotifications, persistLastChecked, user?.sub])

  useEffect(() => {
    if (!user) return

    hydrateFromStorage()

    // Vérifier les mises à jour des commandes toutes les 30 secondes
    const interval = setInterval(() => {
      checkOrderUpdates()
    }, 30000)

    // Vérifier immédiatement au chargement
    checkOrderUpdates()

    return () => clearInterval(interval)
  }, [checkOrderUpdates, hydrateFromStorage, user])

  return {
    checkOrderUpdates
  }
}
