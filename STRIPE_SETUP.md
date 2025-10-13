# Configuration Stripe pour Garden Gold Green

## 🔐 Obtenir vos clés Stripe

1. **Créer un compte Stripe** (si vous n'en avez pas déjà un)
   - Allez sur [https://stripe.com](https://stripe.com)
   - Créez un compte gratuit

2. **Obtenir vos clés API**
   - Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com)
   - Cliquez sur **Developers** dans le menu de gauche
   - Cliquez sur **API keys**
   - Vous verrez deux clés :
     - **Publishable key** (commence par `pk_test_...`)
     - **Secret key** (commence par `sk_test_...`, cliquez sur "Reveal test key")

3. **Créer le fichier `.env.local`**
   ```bash
   # Copiez le fichier d'exemple
   cp .env.example .env.local
   ```

4. **Ajouter vos clés dans `.env.local`**
   ```env
   # Database
   DATABASE_URL="file:./prisma/dev.db"

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_PUBLIQUE
   STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE
   STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET

   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## 🔔 Configurer les Webhooks (Optionnel pour le développement)

1. **Installer Stripe CLI**
   - Téléchargez depuis [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

2. **Se connecter**
   ```bash
   stripe login
   ```

3. **Écouter les webhooks localement**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copier le webhook secret**
   - Le CLI affichera un webhook secret (commence par `whsec_...`)
   - Ajoutez-le dans votre `.env.local` comme `STRIPE_WEBHOOK_SECRET`

## 🧪 Tester les paiements

Utilisez ces cartes de test Stripe :

| Type | Numéro de carte | CVC | Date d'expiration |
|------|----------------|-----|-------------------|
| ✅ Succès | 4242 4242 4242 4242 | N'importe quel 3 chiffres | N'importe quelle date future |
| ❌ Échec | 4000 0000 0000 0002 | N'importe quel 3 chiffres | N'importe quelle date future |
| 🔐 3D Secure | 4000 0025 0000 3155 | N'importe quel 3 chiffres | N'importe quelle date future |

## 📱 Flux de paiement

1. L'utilisateur ajoute des produits au panier
2. Clique sur "Achat Express" ou "Commander maintenant"
3. Une session Stripe Checkout est créée via `/api/checkout`
4. L'utilisateur est redirigé vers le formulaire de paiement hébergé par Stripe
5. Après paiement réussi → redirection vers `/checkout/success`
6. Après annulation → redirection vers `/cart`

## 🚀 Passer en production

1. **Obtenir les clés de production**
   - Dans le Dashboard Stripe, désactivez le "Mode test"
   - Récupérez vos clés de production (`pk_live_...` et `sk_live_...`)

2. **Mettre à jour les variables d'environnement de production**
   - Sur Vercel/votre plateforme de déploiement
   - Ajoutez les clés de production

3. **Configurer les webhooks en production**
   - Dans Dashboard Stripe → Developers → Webhooks
   - Ajoutez un endpoint : `https://votre-domaine.com/api/webhooks/stripe`
   - Sélectionnez les événements : `checkout.session.completed`, `payment_intent.succeeded`
   - Copiez le webhook secret et ajoutez-le aux variables d'environnement

## 📚 Ressources

- [Documentation Stripe](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)





