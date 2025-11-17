# 🔧 Correction du Callback URL Mismatch

## Problème identifié

Auth0 redirige vers `https://gardengoldgreen.com/auth/callback` au lieu de `https://gardengoldgreen.com/api/auth/callback`.

## Cause

Le problème vient de la configuration dans **Auth0 Dashboard**, pas du code. Même si le code est correct, Auth0 Dashboard doit avoir la bonne URL dans "Allowed Callback URLs".

## Solution

### Étape 1 : Vérifier Auth0 Dashboard

1. Allez sur https://manage.auth0.com/
2. **Applications** > "Garden Gold Green"
3. **Settings** > Scroll jusqu'à "Application URIs"

### Étape 2 : Corriger "Allowed Callback URLs"

**SUPPRIMEZ** toutes les URLs contenant `/auth/callback` (sans `/api`)

**AJOUTEZ** uniquement ces URLs (séparées par des virgules, SANS virgule à la fin) :

```
https://gardengoldgreen.com/api/auth/callback,http://localhost:3000/api/auth/callback
```

⚠️ **IMPORTANT** :
- Utilisez `/api/auth/callback` (PAS `/auth/callback`)
- Pas de virgule à la fin
- Pas d'espace après les virgules
- Utilisez `https://` pour la production

### Étape 3 : Vérifier "Allowed Logout URLs"

```
https://gardengoldgreen.com,http://localhost:3000
```

### Étape 4 : Vérifier "Allowed Web Origins"

```
https://gardengoldgreen.com,http://localhost:3000
```

### Étape 5 : Sauvegarder

Cliquez sur **"Save Changes"** en bas de la page.

## Pourquoi `/api/auth/callback` ?

Avec `@auth0/nextjs-auth0` v4 :
- La route est : `/api/auth/[auth0]` (dans `src/app/api/auth/[auth0]/route.ts`)
- Le callback est automatiquement : `/api/auth/callback`
- C'est la convention standard de la bibliothèque

## Vérification

Après correction, testez :

1. Allez sur `https://gardengoldgreen.com`
2. Cliquez sur "Se connecter"
3. Vous devriez être redirigé vers Auth0
4. Après connexion, vous devriez être redirigé vers `/api/auth/callback` **SANS erreur**

## Si le problème persiste

1. Videz le cache du navigateur
2. Testez en navigation privée
3. Vérifiez les logs Auth0 Dashboard pour voir l'URL exacte utilisée
4. Vérifiez que `APP_BASE_URL` est bien `https://gardengoldgreen.com` dans Clever Cloud

