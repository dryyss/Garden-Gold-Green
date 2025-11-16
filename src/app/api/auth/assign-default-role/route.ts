import { NextRequest, NextResponse } from 'next/server';

// Cette route était un prototype temporaire d'assignation de rôle par défaut via l'API Auth0.
// Elle utilisait `getSession` depuis l'ancien SDK Auth0, qui n'existe plus dans la version actuelle,
// et contenait des valeurs en dur (domain, client_id, etc.).
//
// Pour éviter de casser le build de production sur Clever Cloud, on la remplace par un stub
// qui renvoie simplement une erreur explicative. Le reste de l'application (panier, commandes,
// back‑office, etc.) continue de fonctionner normalement.

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      error:
        'La route /api/auth/assign-default-role n’est pas implémentée avec la nouvelle SDK Auth0. ' +
        'Le build est OK, mais cette fonctionnalité devra être réécrite si vous souhaitez l’utiliser.',
    },
    { status: 501 },
  );
}

