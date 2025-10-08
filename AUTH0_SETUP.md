# 🔐 Configuration Auth0 - Garden Gold Green

## 📋 Étapes de Configuration

### 1. Créer un compte Auth0

1. Allez sur [auth0.com](https://auth0.com)
2. Créez un compte gratuit
3. Créez une nouvelle application **Regular Web Application**
4. Notez le **Domain**, **Client ID** et **Client Secret**

### 2. Configurer les URLs de callback

Dans votre application Auth0, configurez :

**Allowed Callback URLs:**
```
http://localhost:3000/api/auth/callback
https://votredomaine.com/api/auth/callback
```

**Allowed Logout URLs:**
```
http://localhost:3000
https://votredomaine.com
```

**Allowed Web Origins:**
```
http://localhost:3000
https://votredomaine.com
```

### 3. Activer les connexions sociales

Dans Auth0 Dashboard > Authentication > Social :

#### Google
1. Activez la connexion Google
2. Obtenez vos credentials depuis [Google Cloud Console](https://console.cloud.google.com)
3. Créez un projet OAuth 2.0
4. Ajoutez les URLs de redirection Auth0

#### Facebook
1. Activez la connexion Facebook
2. Créez une app sur [Facebook Developers](https://developers.facebook.com)
3. Obtenez l'App ID et App Secret
4. Configurez les URLs de redirection

#### Apple
1. Activez la connexion Apple
2. Configurez Sign in with Apple depuis [Apple Developer](https://developer.apple.com)
3. Créez un Service ID
4. Configurez les URLs de callback

### 4. Configuration des rôles (optionnel)

Pour gérer les admins, créez une Rule dans Auth0 :

```javascript
function addRolesToUser(user, context, callback) {
  const namespace = 'https://gardengoldgreen.com/roles';
  const adminEmails = ['admin@gardengoldgreen.com'];
  
  if (adminEmails.includes(user.email)) {
    context.idToken[namespace] = ['admin'];
    context.accessToken[namespace] = ['admin'];
  } else {
    context.idToken[namespace] = ['customer'];
    context.accessToken[namespace] = ['customer'];
  }
  
  callback(null, user, context);
}
```

### 5. Variables d'environnement

Mettez à jour votre `.env.local` :

```env
# Auth0 Configuration
AUTH0_SECRET="génère-un-secret-aléatoire-32-caractères-minimum"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://votre-domain.auth0.com"
AUTH0_CLIENT_ID="votre-client-id"
AUTH0_CLIENT_SECRET="votre-client-secret"
```

**Pour générer AUTH0_SECRET :**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. Tester l'authentification

1. Démarrez le serveur : `npm run dev`
2. Allez sur `/auth`
3. Testez la connexion avec :
   - Email/Password
   - Google
   - Facebook  
   - Apple

### 7. URLs importantes

- **Login:** `/api/auth/login`
- **Logout:** `/api/auth/logout`
- **Callback:** `/api/auth/callback`
- **User Profile:** `/api/auth/me`

## 🔒 Sécurité

- ✅ AUTH0_SECRET doit être un secret fort (minimum 32 caractères)
- ✅ Ne commitez jamais vos secrets dans Git
- ✅ Utilisez des URLs HTTPS en production
- ✅ Configurez les CORS correctement
- ✅ Limitez les connexions sociales nécessaires

## 📱 Routes protégées

Les routes suivantes nécessitent une authentification :

- `/account/*` - Compte utilisateur
- `/profile/*` - Profil
- `/orders/*` - Commandes
- `/favorites/*` - Favoris
- `/admin/*` - Administration

## 🚀 En production

1. Changez `AUTH0_BASE_URL` vers votre domaine de production
2. Mettez à jour les Callback URLs dans Auth0
3. Activez le HTTPS
4. Configurez un domaine personnalisé Auth0 (optionnel)
5. Activez MFA pour les admins

## 🆘 Dépannage

### Erreur: "Callback URL mismatch"
→ Vérifiez que les URLs de callback sont correctement configurées dans Auth0

### Erreur: "Invalid state"
→ Vérifiez que AUTH0_SECRET est correctement défini

### L'utilisateur n'est pas redirigé après login
→ Vérifiez AUTH0_BASE_URL et les Allowed Callback URLs

### Les rôles ne fonctionnent pas
→ Vérifiez que la Rule est bien activée dans Auth0 Dashboard

