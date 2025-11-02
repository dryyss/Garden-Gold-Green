import { NextRequest } from 'next/server';

// Dans Auth0 v4 avec Next.js 15, les routes sont gérées par le middleware
// Cette route est un fallback pour assurer la compatibilité
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auth0: string }> }
) {
  // Le middleware devrait avoir intercepté cette requête
  // Si on arrive ici, retourner une erreur
  return Response.json(
    { error: 'Auth route not handled by middleware. Check your middleware configuration.' },
    { status: 500 }
  );
}




