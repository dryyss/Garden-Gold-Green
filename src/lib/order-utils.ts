/**
 * Génère un numéro de commande formaté à partir d'un ID de commande
 * @param orderId - L'ID de la commande (peut être brut ou déjà formaté)
 * @param createdAt - Date de création optionnelle pour générer un numéro déterministe
 * @returns Un numéro de commande formaté (ex: CMD-20250115-1234)
 */
export function generateOrderNumber(orderId: string, createdAt?: string): string {
  // Si l'ID est déjà au format CMD-YYYYMMDD-NNNN, l'utiliser tel quel
  if (orderId.startsWith('CMD-')) {
    return orderId
  }

  // Si l'ID ressemble à un sessionId Stripe (cs_test_... ou cs_live_...), formater différemment
  if (orderId.startsWith('cs_test_') || orderId.startsWith('cs_live_')) {
    // Utiliser la date actuelle si createdAt n'est pas fourni
    const date = createdAt ? new Date(createdAt) : new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    // Utiliser les 4 derniers caractères alphanumériques de l'ID
    const idSuffix = orderId.slice(-4).toUpperCase().replace(/[^0-9A-Z]/g, '0').padStart(4, '0')
    return `CMD-${year}${month}${day}-${idSuffix}`
  }

  // Sinon, générer un format similaire à partir de la date de création et de l'ID
  if (createdAt) {
    const date = new Date(createdAt)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    // Utiliser les 4 derniers caractères de l'ID pour créer un numéro déterministe
    const idSuffix = orderId.slice(-4).toUpperCase().replace(/[^0-9A-Z]/g, '0').padStart(4, '0')
    return `CMD-${year}${month}${day}-${idSuffix}`
  }

  // Fallback: générer un format basé sur la date actuelle et l'ID
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const idSuffix = orderId.slice(-4).toUpperCase().replace(/[^0-9A-Z]/g, '0').padStart(4, '0')
  return `CMD-${year}${month}${day}-${idSuffix}`
}

