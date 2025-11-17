# 🚨 Solution Temporaire URGENTE

## Problème

L'application envoie `https://gardengoldgreen.com/auth/callback` au lieu de `https://gardengoldgreen.com/api/auth/callback`.

## Solution Temporaire (pour débloquer maintenant)

Dans Auth0 Dashboard, ajoutez **TEMPORAIREMENT** les deux URLs :

### Allowed Callback URLs

```
https://gardengoldgreen.com/api/auth/callback,https://gardengoldgreen.com/auth/callback,http://localhost:3000/api/auth/callback
```

⚠️ **C'est temporaire** - il faut trouver pourquoi l'app envoie `/auth/callback`.

## Cause probable

Le problème vient probablement de la façon dont `Auth0Client` construit l'URL. Avec `@auth0/nextjs-auth0` v4, le callback path devrait être automatiquement `/api/auth/callback` si la route est `/api/auth/[auth0]`.

## Vérifications à faire

1. **Vérifier qu'il n'y a pas de route `/auth/[auth0]`** :
   - Cherchez `src/app/auth/[auth0]/route.ts`
   - Si elle existe, supprimez-la

2. **Vérifier les variables d'environnement** :
   - Pas de variable `AUTH0_CALLBACK_PATH` ou similaire
   - `APP_BASE_URL=https://gardengoldgreen.com`
   - `AUTH0_BASE_URL=https://gardengoldgreen.com`

3. **Vérifier le cache** :
   - Videz le cache du navigateur
   - Testez en navigation privée

## Solution définitive

Une fois débloqué, il faut identifier pourquoi Auth0Client construit `/auth/callback` au lieu de `/api/auth/callback`. Cela peut venir d'une version incorrecte de `@auth0/nextjs-auth0` ou d'une configuration manquante.

