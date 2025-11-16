# 🔴 CORRECTION URGENTE - Callback URL Mismatch Auth0

## Problème identifié

Les logs Auth0 montrent des erreurs "Callback URL mismatch" :
- Auth0 redirige vers : `https://gardengoldgreen.com/auth/callback`
- L'application attend : `https://gardengoldgreen.com/api/auth/callback`

## Solution immédiate

### 1. Connectez-vous à Auth0 Dashboard

Allez sur : https://manage.auth0.com/

### 2. Allez dans Applications > Votre application "Garden Gold Green"

### 3. Modifiez les URLs de callback

#### Allowed Callback URLs

**SUPPRIMEZ** toutes les URLs contenant `/auth/callback`

**AJOUTEZ** uniquement ces URLs (séparées par des virgules, SANS virgule à la fin) :

```
https://gardengoldgreen.com/api/auth/callback,http://localhost:3000/api/auth/callback
```

⚠️ **IMPORTANT** :
- Utilisez `/api/auth/callback` (PAS `/auth/callback`)
- Pas de virgule à la fin
- Pas d'espace après les virgules

#### Allowed Logout URLs

```
https://gardengoldgreen.com,http://localhost:3000
```

#### Allowed Web Origins

```
https://gardengoldgreen.com,http://localhost:3000
```

### 4. Vérifiez les variables d'environnement dans Clever Cloud

Assurez-vous que ces variables sont définies :

- ✅ `APP_BASE_URL` = `https://gardengoldgreen.com`
- ✅ `AUTH0_BASE_URL` = `https://gardengoldgreen.com`
- ✅ `NEXT_PUBLIC_APP_URL` = `https://gardengoldgreen.com`

### 5. Sauvegardez dans Auth0 Dashboard

Cliquez sur "Save Changes" en bas de la page.

### 6. Testez

1. Allez sur `https://gardengoldgreen.com`
2. Cliquez sur "Se connecter"
3. Vous devriez être redirigé vers Auth0
4. Après connexion, vous devriez être redirigé vers `/api/auth/callback` SANS erreur

## Vérification dans les logs Auth0

Après correction, les logs Auth0 devraient montrer :
- ✅ "Success Login" avec "Successful login"
- ❌ Plus de "Failed Login" avec "Callback URL mismatch"

## Si le problème persiste

1. Videz le cache du navigateur
2. Testez en navigation privée
3. Vérifiez les cookies dans DevTools (F12 > Application > Cookies)
4. Vérifiez que `APP_BASE_URL` est bien injecté dans Clever Cloud (regardez les logs de déploiement)

