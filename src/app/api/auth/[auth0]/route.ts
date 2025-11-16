import { auth0 } from '@/lib/auth0';
import { NextRequest } from 'next/server';

// Route Auth0 catch-all pour gérer toutes les routes d'authentification
// Dans Auth0 v4, on utilise Auth0Client.middleware() pour gérer les routes API
export async function GET(request: Request) {
  // Convertir Request en NextRequest pour compatibilité
  const nextRequest = new NextRequest(request);
  return auth0.middleware(nextRequest);
}

export async function POST(request: Request) {
  // Convertir Request en NextRequest pour compatibilité
  const nextRequest = new NextRequest(request);
  return auth0.middleware(nextRequest);
}
