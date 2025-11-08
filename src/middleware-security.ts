import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rateLimit'

// Headers de sécurité
export function getSecurityHeaders() {
  return {
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }
}

// Appliquer les headers de sécurité
export function withSecurityHeaders(response: NextResponse) {
  const headers = getSecurityHeaders()
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

// Rate limiting middleware
export function withRateLimit(
  request: NextRequest,
  maxRequests: number = 100,
  windowMs: number = 60000
): NextResponse | null {
  const ip = 
    request.ip || 
    request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') || 
    'unknown'
  
  const result = checkRateLimit(ip, maxRequests, windowMs)
  
  if (!result.allowed) {
    const response = NextResponse.json(
      { error: 'Trop de requêtes, veuillez réessayer plus tard' },
      { status: 429 }
    )
    
    // Ajouter les headers de rate limit
    response.headers.set('X-RateLimit-Limit', maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(result.reset).toISOString())
    
    return withSecurityHeaders(response)
  }
  
  return null
}

// Protection CSRF de base pour les API
export function validateCSRF(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host')
  
  // Vérifier que l'origine correspond au host
  if (origin) {
    try {
      const originHost = new URL(origin).host
      return originHost === host || originHost.endsWith(`.${host}`)
    } catch {
      return false
    }
  }
  
  // Vérifier le referer si pas d'origine
  if (referer) {
    try {
      const refererHost = new URL(referer).host
      return refererHost === host || refererHost.endsWith(`.${host}`)
    } catch {
      return false
    }
  }
  
  return false
}







