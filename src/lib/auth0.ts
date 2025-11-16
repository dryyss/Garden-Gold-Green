// lib/auth0.ts

import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Helper pour extraire le domain depuis AUTH0_ISSUER_BASE_URL
function getAuth0Domain(): string | undefined {
  const issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL;
  if (issuerBaseURL) {
    // Extraire le domain depuis https://domain.auth0.com
    const url = new URL(issuerBaseURL);
    return url.hostname;
  }
  return process.env.AUTH0_DOMAIN;
}

// Initialize the Auth0 client avec les variables d'environnement
// Pour Auth0 v4, les options valides sont :
// - domain: Le domaine Auth0 (sans https://)
// - clientId: L'ID du client Auth0
// - clientSecret: Le secret du client Auth0
// - secret: Le secret pour signer les cookies de session
// - authorizationParams: Paramètres d'autorisation (audience, scope)
// Note: baseURL et issuerBaseURL ne sont pas des options directes dans Auth0Client v4
// L'URL de base est déterminée automatiquement via AUTH0_BASE_URL ou NEXT_PUBLIC_APP_URL
// L'issuerBaseURL est déterminé automatiquement via AUTH0_ISSUER_BASE_URL
export const auth0 = new Auth0Client({
  domain: getAuth0Domain(),
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE || process.env.AUTH0_M2M_AUDIENCE,
    scope: 'openid profile email',
  },
});



