import { useEffect, useState } from 'react'
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
  const [lastChecked, setLastChecked] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    // Vérifier les mises à jour des commandes toutes les 30 secondes
    const interval = setInterval(() => {
      checkOrderUpdates()
    }, 30000)

    // Vérifier immédiatement au chargement
    checkOrderUpdates()

    return () => clearInterval(interval)
  }, [user])

  const checkOrderUpdates = async () => {
    try {
      const response = await fetch('/api/orders/status-updates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lastChecked: lastChecked || new Date().toISOString()
        })
      })

      if (!response.ok) return

      const data = await response.json()
      const updates = data.updates || []

      // Traiter chaque mise à jour
      updates.forEach((update: OrderStatus) => {
        const statusMessages = {
          'paid': 'Votre commande a été confirmée et est en préparation',
          'shipped': 'Votre commande a été expédiée',
          'delivered': 'Votre commande a été livrée',
          'cancelled': 'Votre commande a été annulée',
          'refunded': 'Votre commande a été remboursée'
        }

        const message = statusMessages[update.status as keyof typeof statusMessages]
        if (message) {
          addNotification({
            id: `order-${update.id}-${update.updatedAt}`,
            type: 'success',
            title: 'Mise à jour de commande',
            message: `${message} (Commande #${update.id})`,
            duration: 5000
          })
        }
      })

      // Mettre à jour la dernière vérification
      if (updates.length > 0) {
        setLastChecked(new Date().toISOString())
      }

    } catch (error) {
      console.error('Erreur lors de la vérification des mises à jour:', error)
    }
  }

  return {
    checkOrderUpdates
  }
}
