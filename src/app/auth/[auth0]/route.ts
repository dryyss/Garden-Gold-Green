import { auth0 } from '@/lib/auth0';
import { NextRequest } from 'next/server';

/**
 * Route Auth0 catch-all pour /auth/[auth0]
 * Cette route utilise le même middleware que /api/auth/[auth0]
 * pour maintenir la compatibilité avec la configuration Auth0 qui utilise /auth/callback
 */
export async function GET(request: Request) {
  // Convertir Request en NextRequest pour compatibilité
  const nextRequest = new NextRequest(request);
  
  // Log pour diagnostic (à retirer en production)
  if (process.env.NODE_ENV === 'development') {
    const url = new URL(request.url);
    console.log('🔍 Auth0 GET request (/auth):', {
      pathname: url.pathname,
      searchParams: Object.fromEntries(url.searchParams),
    });
  }
  
  return auth0.middleware(nextRequest);
}

export async function POST(request: Request) {
  // Convertir Request en NextRequest pour compatibilité
  const nextRequest = new NextRequest(request);
  
  // Log pour diagnostic (à retirer en production)
  if (process.env.NODE_ENV === 'development') {
    const url = new URL(request.url);
    console.log('🔍 Auth0 POST request (/auth):', {
      pathname: url.pathname,
      searchParams: Object.fromEntries(url.searchParams),
    });
  }
  
  return auth0.middleware(nextRequest);
}

