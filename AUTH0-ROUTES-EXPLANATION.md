# Pourquoi `/api/auth/callback` et pas `/auth/callback` ?

## Explication

Avec la bibliothèque `@auth0/nextjs-auth0` v4, la route par défaut est :

```
/api/auth/[auth0]
```

Cette route **catch-all** gère automatiquement toutes les routes d'authentification Auth0 :

| Route | Action |
|-------|--------|
| `/api/auth/login` | Redirige vers Auth0 pour la connexion |
| `/api/auth/callback` | Gère le callback après authentification Auth0 |
| `/api/auth/logout` | Déconnexion de l'utilisateur |
| `/api/auth/me` | Récupère les informations de l'utilisateur connecté |

## Structure des fichiers

```
src/app/api/auth/
├── [auth0]/
│   └── route.ts          ← Route catch-all Auth0 (gère login, callback, logout)
├── login/
│   └── route.ts          ← Ancien système personnalisé (JWT)
├── register/
│   └── route.ts          ← Ancien système personnalisé (JWT)
└── ...
```

## Pourquoi `/api` ?

Dans Next.js App Router :
- Les routes dans `/app/api/` sont des **API Routes** (server-side)
- Les routes dans `/app/` sont des **pages** (peuvent être client ou server)

Auth0 nécessite des routes API pour :
- Gérer les cookies de session
- Faire des redirections sécurisées
- Communiquer avec le serveur Auth0

## Configuration Auth0 Dashboard

Dans votre Auth0 Dashboard, vous devez configurer :

**Allowed Callback URLs** :
```
https://gardengoldgreen.com/api/auth/callback
```

**PAS** :
```
https://gardengoldgreen.com/auth/callback  ❌
```

## Migration depuis l'ancien système

Si vous aviez configuré `/auth/callback` avant, c'est probablement parce que :
1. Vous utilisiez une autre bibliothèque Auth0
2. Vous aviez une configuration personnalisée
3. Vous n'utilisiez pas encore `@auth0/nextjs-auth0`

Avec `@auth0/nextjs-auth0` v4, la convention est **toujours** `/api/auth/[auth0]`.

## Vérification

Pour vérifier que votre configuration est correcte :

1. Allez sur `https://gardengoldgreen.com/api/auth/login`
2. Vous devriez être redirigé vers Auth0
3. Après connexion, vous serez redirigé vers `/api/auth/callback`
4. Puis vers la page d'origine ou `/`

Si vous voyez l'erreur "state parameter is invalid", c'est que :
- L'URL de callback dans Auth0 Dashboard ne correspond pas à `/api/auth/callback`
- Ou la variable `APP_BASE_URL` n'est pas définie

