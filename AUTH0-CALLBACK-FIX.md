# Correction de l'erreur "The state parameter is invalid"

## Problème

L'erreur "The state parameter is invalid" se produit lors du callback Auth0. Cela indique généralement un problème de configuration des URLs de callback ou des cookies.

## Solutions

### 1. Ajouter APP_BASE_URL dans Clever Cloud (CRITIQUE)

Cette variable est **absolument nécessaire** pour qu'Auth0 puisse construire correctement les URLs de callback.

```json
{
  "name": "APP_BASE_URL",
  "value": "https://gardengoldgreen.com"
}
```

### 2. Configurer les URLs de callback dans Auth0 Dashboard

Connectez-vous à votre [Auth0 Dashboard](https://manage.auth0.com/) et allez dans **Applications** > Votre application.

#### Allowed Callback URLs

**IMPORTANT** : Le chemin correct est `/api/auth/callback` (pas `/auth/callback`)

Ajoutez ces URLs (séparées par des virgules, **SANS virgule à la fin**) :

```
https://gardengoldgreen.com/api/auth/callback,http://localhost:3000/api/auth/callback
```

**⚠️ Attention** : 
- Ne mettez **PAS** de virgule à la fin (cela crée une entrée vide et provoque une erreur)
- Utilisez `/api/auth/callback` et non `/auth/callback`

#### Allowed Logout URLs

Ajoutez ces URLs (séparées par des virgules, **SANS virgule à la fin**) :

```
https://gardengoldgreen.com,http://localhost:3000,https://app-ae805b7f-84c1-4812-ad56-d4a60f2360cc.cleverapps.io
```

**⚠️ Attention** : 
- Ne dupliquez pas les URLs (évitez `https://www.gardengoldgreen.com` ET `https://gardengoldgreen.com` si ce sont les mêmes)
- Ne mettez **PAS** de virgule à la fin

#### Allowed Web Origins

Ajoutez (séparées par des virgules, **SANS virgule à la fin**) :

```
https://gardengoldgreen.com,http://localhost:3000,https://app-ae805b7f-84c1-4812-ad56-d4a60f2360cc.cleverapps.io
```

**⚠️ Attention** : 
- Ne dupliquez pas les URLs
- Ne mettez **PAS** de virgule à la fin

### 3. Vérifier les variables d'environnement

Assurez-vous que toutes ces variables sont correctement définies dans Clever Cloud :

- ✅ `APP_BASE_URL` = `https://gardengoldgreen.com` (NOUVEAU - À AJOUTER)
- ✅ `AUTH0_BASE_URL` = `https://gardengoldgreen.com`
- ✅ `NEXT_PUBLIC_APP_URL` = `https://gardengoldgreen.com`
- ✅ `AUTH0_CLIENT_ID` = (votre client ID)
- ✅ `AUTH0_CLIENT_SECRET` = (votre client secret)
- ✅ `AUTH0_SECRET` = (votre secret)
- ✅ `AUTH0_ISSUER_BASE_URL` = `https://dev-1tkaqeynik4yy714.us.auth0.com`

### 4. Redéployer l'application

Après avoir :
1. Ajouté `APP_BASE_URL` dans Clever Cloud
2. Configuré les URLs de callback dans Auth0 Dashboard
3. Corrigé l'espace dans `SENDGRID_FROM_EMAIL`

Redéployez l'application pour que les changements prennent effet.

## Vérification

Après le redéploiement, testez l'authentification :
1. Allez sur `https://gardengoldgreen.com`
2. Cliquez sur "Se connecter" ou accédez à `/api/auth/login`
3. Vous devriez être redirigé vers Auth0
4. Après la connexion, vous devriez être redirigé vers `/api/auth/callback` sans erreur

## Dépannage

Si l'erreur persiste :

1. **Vérifiez les logs Clever Cloud** pour voir si `APP_BASE_URL` est bien défini
2. **Vérifiez les cookies** dans les DevTools du navigateur :
   - Ouvrez les DevTools (F12)
   - Allez dans l'onglet "Application" > "Cookies"
   - Vérifiez que les cookies Auth0 sont présents et ont le bon domaine
3. **Vérifiez la console du navigateur** pour d'autres erreurs
4. **Testez en navigation privée** pour éliminer les problèmes de cache

## Note importante

L'erreur "state parameter is invalid" peut aussi être causée par :
- Des cookies bloqués par le navigateur
- Un problème de CORS
- Un problème de redirection HTTPS/HTTP
- Un secret Auth0 qui a changé

Assurez-vous que tous les paramètres ci-dessus sont correctement configurés.

