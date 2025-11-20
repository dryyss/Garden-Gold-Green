import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';

// Route Auth0 catch-all pour gérer toutes les routes d'authentification
// Dans Auth0 v4, on utilise Auth0Client.middleware() pour gérer les routes API
// IMPORTANT: Cette route est dans /api/auth/[auth0], donc le callback sera /api/auth/callback
export async function GET(request: Request) {
  try {
    // Convertir Request en NextRequest pour compatibilité
    const nextRequest = new NextRequest(request);
    
    // Log pour diagnostic
    const url = new URL(request.url);
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Auth0 GET request:', {
        pathname: url.pathname,
        searchParams: Object.fromEntries(url.searchParams),
      });
    }
    
    const response = await auth0.middleware(nextRequest);
    return response;
  } catch (error) {
    console.error('❌ Erreur Auth0 middleware:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la requête Auth0' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Convertir Request en NextRequest pour compatibilité
    const nextRequest = new NextRequest(request);
    
    // Log pour diagnostic
    const url = new URL(request.url);
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Auth0 POST request:', {
        pathname: url.pathname,
        searchParams: Object.fromEntries(url.searchParams),
      });
    }
    
    const response = await auth0.middleware(nextRequest);
    return response;
  } catch (error) {
    console.error('❌ Erreur Auth0 middleware:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la requête Auth0' },
      { status: 500 }
    );
  }
}
