# 🚨 IMPORTANT : Créer le fichier `.env.local`

## ⚠️ L'application ne fonctionnera pas sans ce fichier !

### 📝 Instructions

1. **Créez un nouveau fichier** nommé `.env.local` à la racine du dossier `garden-gold-green/`

2. **Copiez-collez** exactement ce contenu dans le fichier :

```bash
# Database
DATABASE_URL="file:./dev.db"

# Auth0 Configuration
AUTH0_SECRET="b7dbed86f5d5a61ee7b655286ae39bb5fcb2fe063bec840682d4594c5aad949c"
AUTH0_BASE_URL="http://localhost:3002"
AUTH0_ISSUER_BASE_URL="https://dev-1tkaqeynik4yy714.us.auth0.com"
AUTH0_CLIENT_ID="Lt54JQ2uYcmyTU0oo7Tu5EVwJJIIBJX9"
AUTH0_CLIENT_SECRET="cWYxj8kUnzDCkSWvEPiHSnsHkVgxAn-ZeZJHcT7V3_3CjOrVUa4drp_g3bMeSGIg"

# Stripe (optionnel pour le moment)
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

3. **Sauvegardez** le fichier

4. **Redémarrez** le serveur :
   ```bash
   npm run dev
   ```

### 📁 Structure des fichiers

```
garden-gold-green/
├── .env.local          ← CRÉEZ CE FICHIER ICI
├── .env.example
├── package.json
├── src/
└── ...
```

### ✅ Vérification

Le fichier `.env.local` doit être au **même niveau** que :
- `package.json`
- `next.config.ts`
- Le dossier `src/`

### 🔒 Sécurité

⚠️ **Important :** Le fichier `.env.local` est déjà dans `.gitignore`, il ne sera **jamais** envoyé sur Git.

---

**Une fois le fichier créé, rechargez la page et cliquez à nouveau sur "Connexion" !**

