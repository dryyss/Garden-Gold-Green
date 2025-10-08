import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/',
  }),
  callback: handleCallback({
    redirectUri: process.env.AUTH0_BASE_URL + '/api/auth/callback',
  }),
  signup: handleLogin({
    authorizationParams: {
      screen_hint: 'signup',
    },
    returnTo: '/',
  }),
});

