// Rate limiting simple en mémoire (pour développement/test)
// En production, utilisez Redis ou un middleware dédié

interface RateLimitStore {
  [key: string]: number[]
}

const rateLimitStore: RateLimitStore = {}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const windowStart = now - windowMs

  // Initialiser ou nettoyer les anciennes requêtes
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = []
  }

  // Nettoyer les requêtes hors de la fenêtre
  rateLimitStore[key] = rateLimitStore[key].filter(
    (timestamp) => timestamp > windowStart
  )

  // Vérifier si la limite est dépassée
  const requestCount = rateLimitStore[key].length
  const allowed = requestCount < maxRequests

  if (allowed) {
    rateLimitStore[key].push(now)
  }

  const remaining = Math.max(0, maxRequests - requestCount - (allowed ? 1 : 0))
  const reset = now + windowMs

  return { allowed, remaining, reset }
}

// Nettoyer le store toutes les heures
setInterval(() => {
  const now = Date.now()
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].every((timestamp) => timestamp < now - 3600000)) {
      delete rateLimitStore[key]
    }
  })
}, 3600000)

