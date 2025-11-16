import { handleAuth, handleLogin, handleLogout, handleCallback, handleProfile } from '@auth0/nextjs-auth0';

// Route Auth0 catch-all pour gérer toutes les routes d'authentification
// Cela crée automatiquement les routes suivantes :
// - /api/auth/login
// - /api/auth/logout
// - /api/auth/callback
// - /api/auth/me (via handleProfile)
export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile email',
    },
  }),
  logout: handleLogout({
    returnTo: process.env.AUTH0_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || '/',
  }),
  callback: handleCallback(),
  profile: handleProfile(),
});
