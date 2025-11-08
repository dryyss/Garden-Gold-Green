import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

// ⚠️ TEMPORAIRE : Valeurs en dur pour tester
// Remplacez ces valeurs par les vôtres :
const DOMAIN = 'dev-1tkaqeynik4yy714.us.auth0.com'; // Votre domaine Auth0 (sans https://)
const CLIENT_ID = 'VOTRE_CLIENT_ID_M2M'; // ID de votre application M2M
const CLIENT_SECRET = 'VOTRE_CLIENT_SECRET_M2M'; // Secret de votre application M2M
const DEFAULT_ROLE_ID = 'rol_XXXXXXXXXXXXX'; // ID du rôle par défaut (commence par rol_)

// Note: Cette route utilise l'API REST Auth0 directement car ManagementClient
// nécessite le package 'auth0' qui n'est pas installé. On utilise fetch côté serveur.

export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est authentifié
    const session = await getSession(request);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.sub; // Auth0 user ID

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Utiliser les valeurs en dur (TEMPORAIRE pour test)
    const domain = DOMAIN;
    const clientId = CLIENT_ID;
    const clientSecret = CLIENT_SECRET;
    const defaultRoleId = DEFAULT_ROLE_ID;

    console.log('🔍 DEBUG - Domain:', domain);
    console.log('🔍 DEBUG - Client ID:', clientId ? `${clientId.substring(0, 5)}...` : 'MANQUANT');
    console.log('🔍 DEBUG - Client Secret:', clientSecret ? 'PRÉSENT' : 'MANQUANT');
    console.log('🔍 DEBUG - Default Role ID:', defaultRoleId);
    console.log('🔍 DEBUG - User ID:', userId);

    if (!domain || !clientId || !clientSecret || !defaultRoleId || defaultRoleId === 'rol_XXXXXXXXXXXXX') {
      const missing = [];
      if (!domain) missing.push('domain');
      if (!clientId || clientId === 'VOTRE_CLIENT_ID_M2M') missing.push('CLIENT_ID');
      if (!clientSecret || clientSecret === 'VOTRE_CLIENT_SECRET_M2M') missing.push('CLIENT_SECRET');
      if (!defaultRoleId || defaultRoleId === 'rol_XXXXXXXXXXXXX') missing.push('DEFAULT_ROLE_ID');
      
      console.error('❌ Configuration manquante:', missing.join(', '));
      return NextResponse.json(
        { 
          error: 'Server configuration missing', 
          missing: missing,
          message: 'Vérifiez les valeurs en dur dans le code (lignes 6-9)'
        },
        { status: 500 }
      );
    }

    // Étape 1 : Obtenir un token d'accès pour l'API Management
    const tokenResponse = await fetch(`https://${domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: `https://${domain}/api/v2/`,
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Erreur lors de l\'obtention du token:', errorText);
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    const access_token = tokenData.access_token;

    if (!access_token) {
      return NextResponse.json(
        { error: 'No access token received' },
        { status: 500 }
      );
    }

    // Étape 2 : Vérifier les rôles actuels de l'utilisateur
    const userRolesResponse = await fetch(
      `https://${domain}/api/v2/users/${userId}/roles`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (userRolesResponse.ok) {
      const userRoles = await userRolesResponse.json();
      if (userRoles.length > 0) {
        return NextResponse.json({
          message: 'User already has roles',
          roles: userRoles.map((r: any) => r.name || r.id),
        });
      }
    }

    // Étape 3 : Assigner le rôle par défaut
    const assignResponse = await fetch(
      `https://${domain}/api/v2/users/${userId}/roles`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roles: [defaultRoleId],
        }),
      }
    );

    if (!assignResponse.ok) {
      const errorText = await assignResponse.text();
      console.error('❌ Erreur lors de l\'assignation du rôle:', errorText);
      return NextResponse.json(
        { error: 'Failed to assign role', details: errorText },
        { status: assignResponse.status }
      );
    }

    return NextResponse.json({
      message: 'Default role assigned successfully',
      roleId: defaultRoleId,
    });
  } catch (error: any) {
    console.error('Error assigning default role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to assign role' },
      { status: 500 }
    );
  }
}

