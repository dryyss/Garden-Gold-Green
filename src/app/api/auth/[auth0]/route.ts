import { auth0 } from '@/lib/auth0';
import { NextRequest } from 'next/server';

// Route Auth0 catch-all pour gérer toutes les routes d'authentification
// Dans Auth0 v4, on utilise Auth0Client.middleware() pour gérer les routes API
// IMPORTANT: Cette route est dans /api/auth/[auth0], donc le callback sera /api/auth/callback
export async function GET(request: Request) {
  // Convertir Request en NextRequest pour compatibilité
  const nextRequest = new NextRequest(request);
  
  // Log pour diagnostic (à retirer en production)
  if (process.env.NODE_ENV === 'development') {
    const url = new URL(request.url);
    console.log('🔍 Auth0 GET request:', {
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
    console.log('🔍 Auth0 POST request:', {
      pathname: url.pathname,
      searchParams: Object.fromEntries(url.searchParams),
    });
  }
  
  return auth0.middleware(nextRequest);
}
