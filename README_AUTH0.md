# 🔐 Authentification Auth0 - Garden Gold Green

## ✅ Intégration Complète

L'authentification de votre application a été migrée vers **Auth0**, une solution professionnelle utilisée par des milliers d'entreprises.

## 🚀 Démarrage Rapide (3 étapes)

### 1️⃣ Créer `.env.local`

Créez le fichier `garden-gold-green/.env.local` :

```bash
AUTH0_SECRET="b7dbed86f5d5a61ee7b655286ae39bb5fcb2fe063bec840682d4594c5aad949c"
AUTH0_BASE_URL="http://localhost:3002"
AUTH0_ISSUER_BASE_URL="https://dev-1tkaqeynik4yy714.us.auth0.com"
AUTH0_CLIENT_ID="Lt54JQ2uYcmyTU0oo7Tu5EVwJJIIBJX9"
AUTH0_CLIENT_SECRET="cWYxj8kUnzDCkSWvEPiHSnsHkVgxAn-ZeZJHcT7V3_3CjOrVUa4drp_g3bMeSGIg"
DATABASE_URL="file:./dev.db"
```

### 2️⃣ Configurer Auth0 Dashboard

Allez sur https://manage.auth0.com :

**Applications > Garden Gold Green > Settings**

Ajoutez ces URLs et **Save Changes** :

```
Allowed Callback URLs:
http://localhost:3002/api/auth/callback

Allowed Logout URLs:
http://localhost:3002

Allowed Web Origins:
http://localhost:3002
```

### 3️⃣ Lancer l'application

```bash
cd garden-gold-green
npm run dev
```

**C'est tout ! 🎉**

## 🧪 Tester

1. Ouvrez http://localhost:3002
2. Cliquez sur **"Connexion"** dans le header
3. Créez un compte ou connectez-vous
4. Explorez :
   - `/profile` - Votre profil
   - `/orders` - Vos commandes

## 📚 Documentation

- **`DEMARRAGE_RAPIDE_AUTH0.md`** - Guide de démarrage
- **`AUTH0_SETUP.md`** - Configuration complète
- **`AUTH0_INTEGRATION_COMPLETE.md`** - Détails de l'intégration

## 🎨 Personnalisation

### Branding Auth0

Dans Auth0 Dashboard > Branding > Universal Login :

- **Logo** : `/public/logo.png`
- **Couleur primaire** : `#FFD700`
- **Couleur de fond** : `#0a0a0a`

### Social Login (Optionnel)

Activez Google, Facebook, etc. dans :
**Authentication > Social**

## ⚡ Fonctionnalités

- ✅ Connexion / Inscription sécurisée
- ✅ Protection des routes
- ✅ Profil utilisateur
- ✅ Gestion des sessions
- ✅ Déconnexion
- ✅ Interface responsive
- ✅ Compatible mobile

## 🔧 API Routes

- `/api/auth/login` - Connexion
- `/api/auth/logout` - Déconnexion
- `/api/auth/callback` - Callback
- `/api/auth/me` - Utilisateur actuel
- `/api/user/update` - Mise à jour profil

## 💡 Utilisation dans le code

```tsx
import { useUser } from '@auth0/nextjs-auth0/client'

function Component() {
  const { user, error, isLoading } = useUser()
  
  if (isLoading) return <div>Chargement...</div>
  if (!user) return <a href="/api/auth/login">Se connecter</a>
  
  return <div>Bonjour {user.name} !</div>
}
```

## 🆘 Problèmes ?

**Erreur TypeScript sur `@auth0/nextjs-auth0/client` ?**
- Redémarrez votre éditeur (VS Code, Cursor)
- Ou exécutez : `npm install`

**Erreur "Invalid state" ?**
- Vérifiez que `.env.local` existe
- Redémarrez le serveur : `npm run dev`

**Erreur "Callback URL mismatch" ?**
- Vérifiez les URLs dans Auth0 Dashboard
- Pas d'espace, pas de slash final

## 📞 Support

- [Documentation Auth0](https://auth0.com/docs/quickstart/webapp/nextjs)
- [Auth0 Community](https://community.auth0.com/)
- [GitHub Auth0](https://github.com/auth0/nextjs-auth0)

---

**🎉 Profitez de votre authentification professionnelle !**

