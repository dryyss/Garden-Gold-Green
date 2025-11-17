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

// Helper pour obtenir l'URL de base de l'application
function getAppBaseURL(): string | undefined {
  return (
    process.env.APP_BASE_URL ||
    process.env.AUTH0_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL
  );
}

// Initialize the Auth0 client avec les variables d'environnement
// Pour Auth0 v4, les options valides sont :
// - domain: Le domaine Auth0 (sans https://)
// - clientId: L'ID du client Auth0
// - clientSecret: Le secret du client Auth0
// - secret: Le secret pour signer les cookies de session
// - appBaseUrl: L'URL de base de l'application (requis)
// - authorizationParameters: Paramètres d'autorisation (audience, scope)
// - session: Configuration des cookies de session
// 
// NOTE: Le callback path est automatiquement déterminé par l'emplacement de la route.
// Si la route est /api/auth/[auth0], le callback sera /api/auth/callback
// Assurez-vous que Auth0 Dashboard a /api/auth/callback dans "Allowed Callback URLs"
export const auth0 = new Auth0Client({
  domain: getAuth0Domain(),
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,
  appBaseUrl: getAppBaseURL(),
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE || process.env.AUTH0_M2M_AUDIENCE,
    scope: 'openid profile email',
  },
});



