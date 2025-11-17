# 🔧 Solution Définitive : Correction du redirect_uri

## Problème

L'application envoie `https://gardengoldgreen.com/auth/callback` au lieu de `https://gardengoldgreen.com/api/auth/callback`.

## Cause probable

Avec `@auth0/nextjs-auth0` v4, le client côté client (`useUser` hook) construit automatiquement l'URL de callback. Par défaut, il peut utiliser `/auth/callback` si la configuration n'est pas explicite.

## Solution : Ajouter la variable d'environnement AUTH0_BASE_PATH

Dans Clever Cloud, ajoutez cette variable d'environnement :

```
AUTH0_BASE_PATH=/api/auth
```

Cette variable indique à Auth0Client que les routes sont dans `/api/auth` et non `/auth`.

## Alternative : Vérifier la configuration du client

Si `AUTH0_BASE_PATH` n'existe pas dans v4, vérifiez que :

1. **La route est bien dans `/api/auth/[auth0]`** ✅ (déjà fait)
2. **Les variables d'environnement sont correctes** :
   - `APP_BASE_URL=https://gardengoldgreen.com`
   - `AUTH0_BASE_URL=https://gardengoldgreen.com`
   - `NEXT_PUBLIC_APP_URL=https://gardengoldgreen.com`

## Solution temporaire (déjà appliquée)

Dans Auth0 Dashboard, vous avez ajouté les deux URLs :
- `https://gardengoldgreen.com/api/auth/callback` ✅
- `https://gardengoldgreen.com/auth/callback` ✅ (temporaire)

## Vérification

Après avoir ajouté `AUTH0_BASE_PATH=/api/auth` dans Clever Cloud :

1. Redéployez l'application
2. Testez la connexion
3. Vérifiez les logs Auth0 - le `redirect_uri` devrait être `/api/auth/callback`
4. Si c'est bon, supprimez `/auth/callback` de Auth0 Dashboard

## Si le problème persiste

Vérifiez la version de `@auth0/nextjs-auth0` :
- Version actuelle : `^4.11.1`
- Vérifiez s'il y a une mise à jour disponible
- Consultez la documentation pour la configuration du basePath dans v4

