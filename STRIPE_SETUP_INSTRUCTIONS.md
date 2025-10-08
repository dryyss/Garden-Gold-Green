# 💳 Configuration Stripe - Garden Gold Green

## 📋 Étapes de Configuration

### 1. **Créer un Compte Stripe**
1. Aller sur [stripe.com](https://stripe.com)
2. Créer un compte
3. Compléter les informations de votre entreprise

### 2. **Récupérer les Clés API**

#### Mode Test (Développement)
1. Se connecter au [Dashboard Stripe](https://dashboard.stripe.com)
2. Aller dans **Developers > API keys**
3. Copier :
   - **Publishable key** (commence par `pk_test_`)
   - **Secret key** (commence par `sk_test_`)

#### Mode Production
1. Activer votre compte Stripe (vérification d'identité)
2. Basculer en mode "Live" (haut à droite)
3. Copier :
   - **Publishable key** (commence par `pk_live_`)
   - **Secret key** (commence par `sk_live_`)

### 3. **Configurer les Variables d'Environnement**

Ajouter dans `.env.local` :

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. **Configurer le Webhook**

#### En Local (avec Stripe CLI)

1. **Installer Stripe CLI:**
```bash
# Windows (avec winget)
winget install stripe.stripe-cli

# MacOS (avec Homebrew)
brew install stripe/stripe-cli/stripe

# Linux
https://docs.stripe.com/stripe-cli
```

2. **Se connecter:**
```bash
stripe login
```

3. **Écouter les webhooks:**
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. **Copier le webhook secret** affiché (commence par `whsec_`)

#### En Production

1. Aller dans **Developers > Webhooks**
2. Cliquer sur "Add endpoint"
3. **URL du endpoint:**
```
https://gardengoldgreen.com/api/stripe/webhook
```

4. **Événements à écouter:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

5. **Copier le webhook secret**

### 5. **Configuration des Produits**

#### Méthode automatique (recommandée)
Les produits sont créés automatiquement via l'API lors du checkout.

#### Méthode manuelle
1. Aller dans **Products**
2. Créer chaque produit manuellement
3. Configurer les prix en EUR

### 6. **Paramètres de Paiement**

#### Moyens de Paiement
Dans **Settings > Payment methods**, activer :
- ✅ Cartes bancaires (Visa, Mastercard, Amex)
- ✅ Apple Pay
- ✅ Google Pay
- ✅ SEPA (pour l'Europe)
- ✅ iDEAL (Pays-Bas)
- ✅ Bancontact (Belgique)

#### Devises
- Configurer EUR comme devise principale
- Activer les conversions automatiques si nécessaire

#### Codes Promo
Dans **Products > Coupons**, créer des codes :
- Réduction en % ou montant fixe
- Date d'expiration
- Limites d'utilisation

### 7. **Tester les Paiements**

#### Cartes de Test

**Succès:**
```
Numéro: 4242 4242 4242 4242
Date: N'importe quelle date future
CVC: N'importe quel 3 chiffres
```

**Décliné:**
```
Numéro: 4000 0000 0000 0002
```

**3D Secure requis:**
```
Numéro: 4000 0027 6000 3184
```

[Liste complète des cartes de test](https://docs.stripe.com/testing)

### 8. **Workflow Complet**

1. **Utilisateur ajoute des produits** → Panier
2. **Clique sur "Payer avec Stripe"**
3. **Création session Stripe** → `/api/stripe/create-checkout-session`
4. **Redirection vers Stripe Checkout**
5. **Utilisateur paie**
6. **Stripe envoie webhook** → `/api/stripe/webhook`
7. **Création commande** en BDD
8. **Envoi email confirmation** (à implémenter)
9. **Redirection** → `/checkout/success`

### 9. **Schéma Prisma**

Le schéma est déjà configuré pour Stripe :

```prisma
model Order {
  id                    String      @id @default(uuid())
  userId                String?
  stripeSessionId       String?     @unique
  stripePaymentIntentId String?
  status                String      // paid, refunded, canceled
  total                 Float
  customerEmail         String
  customerName          String
  customerPhone         String?
  shippingAddress       String      // JSON
  items                 OrderItem[]
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  name      String
  quantity  Int
  price     Float
}
```

### 10. **URLs Importantes**

#### API Routes
- `POST /api/stripe/create-checkout-session` - Créer une session
- `POST /api/stripe/webhook` - Recevoir les événements
- `GET /api/orders/session/[sessionId]` - Récupérer une commande

#### Pages
- `/cart` - Panier avec bouton Stripe
- `/checkout/success` - Page de confirmation
- `/checkout/cancel` - Page d'annulation

### 11. **Sécurité**

#### Variables Sensibles
⚠️ **NE JAMAIS** exposer :
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

✅ **Peut être public** :
- `STRIPE_PUBLISHABLE_KEY` (front-end)

#### Vérification Webhook
```typescript
// Toujours vérifier la signature
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  webhookSecret
)
```

#### Montants
- Toujours calculer les montants côté serveur
- Ne jamais faire confiance aux montants du client

### 12. **Gestion des Erreurs**

#### Codes d'Erreur Courants
- `card_declined` - Carte refusée
- `insufficient_funds` - Fonds insuffisants
- `expired_card` - Carte expirée
- `incorrect_cvc` - CVC incorrect
- `processing_error` - Erreur de traitement

#### Logs
Stripe fournit des logs détaillés dans :
**Developers > Logs** et **Developers > Events**

### 13. **Production Checklist**

- [ ] Compte Stripe activé et vérifié
- [ ] Basculer en mode Live
- [ ] Mettre à jour les clés API en production
- [ ] Configurer le webhook en production
- [ ] Tester un paiement réel (petit montant)
- [ ] Configurer les emails de notification
- [ ] Activer 3D Secure (SCA)
- [ ] Configurer les remboursements
- [ ] Activer Stripe Radar (anti-fraude)
- [ ] Configurer les factures automatiques

### 14. **Stripe Dashboard**

#### Consulter
- **Payments** - Liste des paiements
- **Customers** - Base de clients
- **Subscriptions** - Abonnements (si applicable)
- **Invoices** - Factures
- **Disputes** - Litiges

#### Remboursements
1. Aller dans **Payments**
2. Sélectionner un paiement
3. Cliquer sur **Refund**
4. Le webhook `charge.refunded` sera envoyé

### 15. **Support**

- [Documentation Stripe](https://docs.stripe.com)
- [API Reference](https://docs.stripe.com/api)
- [Stripe Support](https://support.stripe.com)
- [Status Stripe](https://status.stripe.com)

## 🧪 Tester

```bash
# 1. Démarrer l'application
npm run dev

# 2. Dans un autre terminal, écouter les webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook

# 3. Effectuer un paiement test
# Aller sur http://localhost:3000/cart
# Ajouter des produits
# Cliquer sur "Payer avec Stripe"
# Utiliser la carte 4242 4242 4242 4242

# 4. Vérifier les logs du webhook
# Le webhook devrait afficher la création de commande
```

## 📊 Métriques

Stripe fournit des statistiques détaillées :
- Volume de transactions
- Taux de succès/échec
- Montant moyen par transaction
- Revenus par période
- Taux de fraude

## 🚀 Déploiement

### Vercel
Les variables d'environnement sont automatiquement chargées.

### Autres Plateformes
Configurer les variables :
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### DNS et HTTPS
⚠️ **Stripe nécessite HTTPS en production**

## ✅ Checklist Complète

- [ ] Compte Stripe créé
- [ ] Clés API récupérées
- [ ] Variables d'environnement configurées
- [ ] Webhook configuré (local + production)
- [ ] Moyens de paiement activés
- [ ] Tests effectués avec cartes de test
- [ ] Webhook testé et fonctionnel
- [ ] Commandes créées en BDD
- [ ] Pages succès/échec opérationnelles
- [ ] Gestion d'erreurs implémentée
- [ ] Logs vérifiés
- [ ] Prêt pour la production

