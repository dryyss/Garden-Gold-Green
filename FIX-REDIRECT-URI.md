# 🔧 Correction du redirect_uri : /auth/callback au lieu de /api/auth/callback

## Problème identifié

Les logs Auth0 montrent :
- **redirect_uri envoyé** : `https://gardengoldgreen.com/auth/callback` ❌
- **URLs autorisées** : `https://gardengoldgreen.com/api/auth/callback` ✅

L'application construit l'URL avec `/auth/callback` au lieu de `/api/auth/callback`.

## Cause possible

Avec `@auth0/nextjs-auth0` v4, le callback path est automatiquement déterminé par l'emplacement de la route. Si la route est `/api/auth/[auth0]`, le callback devrait être `/api/auth/callback`.

Le problème peut venir de :
1. Une variable d'environnement qui définit un chemin incorrect
2. Une configuration Auth0Client qui utilise un mauvais basePath
3. Un appel direct à Auth0 qui construit l'URL manuellement

## Solution 1 : Vérifier les variables d'environnement

Dans Clever Cloud, vérifiez que ces variables sont correctes :

```
APP_BASE_URL=https://gardengoldgreen.com
AUTH0_BASE_URL=https://gardengoldgreen.com
NEXT_PUBLIC_APP_URL=https://gardengoldgreen.com
```

**Ne définissez PAS** de variable comme :
- `AUTH0_CALLBACK_PATH=/auth` ❌
- `AUTH0_ROUTES_BASE=/auth` ❌

## Solution 2 : Vérifier la route Auth0

La route doit être dans `/api/auth/[auth0]` :
- Fichier : `src/app/api/auth/[auth0]/route.ts` ✅
- URL : `/api/auth/[auth0]` ✅
- Callback automatique : `/api/auth/callback` ✅

## Solution 3 : Vérifier qu'il n'y a pas de route /auth/[auth0]

Assurez-vous qu'il n'y a **PAS** de route dans :
- `src/app/auth/[auth0]/route.ts` ❌ (ne doit pas exister)

Si cette route existe, supprimez-la car elle créerait un callback `/auth/callback`.

## Solution 4 : Vérifier les appels directs à Auth0

Cherchez dans le code s'il y a des appels directs à Auth0 qui construisent l'URL manuellement :

```typescript
// ❌ MAUVAIS
const redirectUri = `${baseUrl}/auth/callback`

// ✅ BON (laisser Auth0Client gérer automatiquement)
// Ne pas définir redirect_uri manuellement
```

## Solution 5 : Forcer le basePath dans Auth0Client (si nécessaire)

Si le problème persiste, essayez d'ajouter explicitement le basePath dans la configuration (mais vérifiez d'abord la documentation v4) :

```typescript
// Note: basePath n'existe peut-être pas dans v4
// Vérifiez la documentation officielle
export const auth0 = new Auth0Client({
  // ... autres options
  // basePath: '/api/auth', // Si cette option existe dans v4
});
```

## Solution 6 : Vérifier le cache

1. Videz le cache du navigateur
2. Testez en navigation privée
3. Vérifiez les cookies dans DevTools (F12 > Application > Cookies)
4. Supprimez tous les cookies liés à Auth0

## Solution 7 : Vérifier les logs de build

Vérifiez les logs Clever Cloud lors du build pour voir si Auth0Client est correctement initialisé.

## Diagnostic

Pour identifier d'où vient le problème, ajoutez des logs temporaires :

```typescript
// Dans src/lib/auth0.ts
console.log('🔍 Auth0 Configuration:', {
  appBaseUrl: getAppBaseURL(),
  domain: getAuth0Domain(),
  // Vérifiez si basePath est disponible
});
```

## Solution temporaire (si urgent)

Si vous devez débloquer rapidement, ajoutez temporairement `/auth/callback` dans Auth0 Dashboard :

```
https://gardengoldgreen.com/api/auth/callback,https://gardengoldgreen.com/auth/callback,http://localhost:3000/api/auth/callback
```

⚠️ **Ce n'est qu'une solution temporaire**. Il faut trouver pourquoi l'app envoie `/auth/callback`.

## Vérification finale

Après correction, les logs Auth0 devraient montrer :
- `"redirect_uri": "https://gardengoldgreen.com/api/auth/callback"` ✅

