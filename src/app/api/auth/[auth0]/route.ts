import { NextRequest, NextResponse } from 'next/server';

// NOTE IMPORTANTE :
// -----------------
// La version actuelle de `@auth0/nextjs-auth0` (>=4) n'expose plus `handleAuth` comme dans les anciens exemples.
// La route `/api/auth/[auth0]` ci‑dessous est donc volontairement réduite à un stub
// pour permettre au build de production de réussir sur Clever Cloud.
// 
// Si vous souhaitez utiliser Auth0 côté serveur (login/logout/callback via cette route),
// il faudra mettre en place une intégration basée sur `AuthClient` depuis
// `@auth0/nextjs-auth0/server` en suivant la documentation officielle.

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    {
      error: 'Auth0 route non implémentée avec la nouvelle SDK. ' +
        'Le build est OK, mais le flux Auth0 /api/auth/[auth0] reste à finaliser.',
    },
    { status: 501 },
  );
}

export const POST = GET;




