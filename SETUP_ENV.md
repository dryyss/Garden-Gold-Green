# 🔧 Configuration des Variables d'Environnement

## ⚡ Configuration Rapide

### 1. Créer le fichier `.env.local`

Créez un fichier `.env.local` à la racine du projet avec ce contenu :

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Auth0 Configuration
AUTH0_SECRET="GENERER_AVEC_COMMANDE_CI_DESSOUS"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://YOUR-DOMAIN.auth0.com"
AUTH0_CLIENT_ID="YOUR-CLIENT-ID"
AUTH0_CLIENT_SECRET="YOUR-CLIENT-SECRET"

# Stripe Configuration - VOS CLÉS
STRIPE_PUBLISHABLE_KEY="pk_test_51SFEUKQfe0IoO1BoeOfpKCEKF4DSXMkY6ycMuvMevZF7LUuMmtvrYR5cgArHR4XEZupAtmsTlaG4WkpT8mJjyEb900cBvetumJ"
STRIPE_SECRET_KEY="sk_test_VOTRE_CLE_SECRETE_STRIPE"
STRIPE_WEBHOOK_SECRET="whsec_GENERER_AVEC_STRIPE_CLI"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="GENERER_AVEC_COMMANDE_CI_DESSOUS"

# JWT Secret
JWT_SECRET="GENERER_AVEC_COMMANDE_CI_DESSOUS"

# Application
NODE_ENV="development"
```

### 2. Générer les Secrets

#### Option A: Avec OpenSSL
```bash
openssl rand -hex 32
```

#### Option B: Avec Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Option C: Avec PowerShell
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### 3. Configuration Stripe Complète

Vous avez fourni la clé publique :
```
pk_test_51SFEUKQfe0IoO1BoeOfpKCEKF4DSXMkY6ycMuvMevZF7LUuMmtvrYR5cgArHR4XEZupAtmsTlaG4WkpT8mJjyEb900cBvetumJ
```

**Il vous faut aussi :**

1. **Clé secrète Stripe** (commence par `sk_test_`)
   - Aller sur https://dashboard.stripe.com/test/apikeys
   - Copier la "Secret key"
   - La mettre dans `STRIPE_SECRET_KEY`

2. **Webhook Secret** (commence par `whsec_`)
   
   **Option A: Avec Stripe CLI (Recommandé pour le dev)**
   ```bash
   # Installer Stripe CLI
   # Windows: winget install stripe.stripe-cli
   # MacOS: brew install stripe/stripe-cli/stripe
   
   # Se connecter
   stripe login
   
   # Écouter les webhooks
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   
   # Le secret s'affiche dans le terminal (whsec_...)
   ```
   
   **Option B: Webhook manuel (Pour la production)**
   - Aller sur https://dashboard.stripe.com/test/webhooks
   - Créer un endpoint : `http://localhost:3000/api/stripe/webhook`
   - Sélectionner les événements : `checkout.session.completed`, `payment_intent.succeeded`, etc.
   - Copier le webhook secret

### 4. Configuration Auth0 (Optionnel pour l'instant)

Si vous voulez tester l'authentification :

1. Créer un compte sur https://auth0.com
2. Créer une application "Regular Web Application"
3. Dans les paramètres :
   - **Domain** → `AUTH0_ISSUER_BASE_URL`
   - **Client ID** → `AUTH0_CLIENT_ID`
   - **Client Secret** → `AUTH0_CLIENT_SECRET`
4. Configurer les URLs :
   - **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`

Voir `AUTH0_SETUP_INSTRUCTIONS.md` pour plus de détails.

### 5. Vérifier la Configuration

```bash
# Vérifier que les variables sont chargées
npm run dev

# Si tout fonctionne, vous verrez le serveur démarrer
```

## 🧪 Tester Stripe

1. Démarrer l'application :
```bash
npm run dev
```

2. Dans un autre terminal, écouter les webhooks :
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3. Aller sur http://localhost:3000/cart
4. Ajouter des produits
5. Cliquer sur "Payer avec Stripe"
6. Utiliser la carte de test :
   - Numéro: `4242 4242 4242 4242`
   - Date: N'importe quelle date future
   - CVC: N'importe quel 3 chiffres

## ⚠️ Sécurité

**NE JAMAIS COMMITER :**
- `.env.local`
- `.env.production`
- Les clés secrètes Stripe (`sk_test_...`, `sk_live_...`)
- Les secrets Auth0
- Les secrets JWT

**PEUT ÊTRE PUBLIC :**
- Clé publique Stripe (`pk_test_...`, `pk_live_...`)
- Domain Auth0
- Client ID Auth0

## 📚 Documentation Complète

- **Stripe** : Voir `STRIPE_SETUP_INSTRUCTIONS.md`
- **Auth0** : Voir `AUTH0_SETUP_INSTRUCTIONS.md`
- **Environnement** : Voir `env.example`

## 🆘 Problèmes Courants

### "Missing environment variable"
- Vérifier que `.env.local` existe
- Vérifier que toutes les variables sont définies
- Redémarrer le serveur après modification

### "Invalid API key"
- Vérifier que vous utilisez les clés de TEST (`sk_test_`, pas `sk_live_`)
- Vérifier qu'il n'y a pas d'espaces dans les clés

### "Webhook signature verification failed"
- Vérifier que `STRIPE_WEBHOOK_SECRET` correspond au secret du webhook
- Si vous utilisez Stripe CLI, copier le secret affiché au démarrage

## ✅ Checklist

- [ ] Fichier `.env.local` créé
- [ ] `DATABASE_URL` configuré
- [ ] `STRIPE_PUBLISHABLE_KEY` ajouté (✅ fourni)
- [ ] `STRIPE_SECRET_KEY` récupéré depuis Stripe Dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` généré avec Stripe CLI
- [ ] Secrets générés (AUTH0_SECRET, NEXTAUTH_SECRET, JWT_SECRET)
- [ ] Serveur démarre sans erreur
- [ ] Test de paiement réussi

## 🚀 Commandes Rapides

```bash
# Démarrer le serveur
npm run dev

# Écouter les webhooks Stripe
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Générer un secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Tester un paiement
stripe trigger checkout.session.completed

# Voir les logs Stripe
stripe logs tail
```

---

**Note:** Une fois configuré, le paiement Stripe fonctionnera immédiatement ! 🎉

