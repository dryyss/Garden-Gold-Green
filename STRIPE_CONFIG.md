# 🔑 Configuration Stripe - Clés Fournies

## ✅ Vos Clés Stripe (Mode Test)

```env
# Clé Publique (peut être publique)
STRIPE_PUBLISHABLE_KEY="pk_test_51SFEUKQfe0IoO1BoeOfpKCEKF4DSXMkY6ycMuvMevZF7LUuMmtvrYR5cgArHR4XEZupAtmsTlaG4WkpT8mJjyEb900cBvetumJ"

# Clé Secrète (PRIVÉE - ne jamais partager)
STRIPE_SECRET_KEY="sk_test_51SFEUKQfe0IoO1BoPjHEg64dWlYFFBve4E4ulGVEuUF4crQK1H3zP98ugE7T73jFJ9FjkvyxP8imiORzNFtfsrK200Ijz2Ns7F"
```

## 🚀 Configuration Rapide

### 1. Créer `.env.local`

Créez le fichier `.env.local` à la racine avec :

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Stripe - VOS CLÉS (déjà fournies)
STRIPE_PUBLISHABLE_KEY="pk_test_51SFEUKQfe0IoO1BoeOfpKCEKF4DSXMkY6ycMuvMevZF7LUuMmtvrYR5cgArHR4XEZupAtmsTlaG4WkpT8mJjyEb900cBvetumJ"
STRIPE_SECRET_KEY="sk_test_51SFEUKQfe0IoO1BoPjHEg64dWlYFFBve4E4ulGVEuUF4crQK1H3zP98ugE7T73jFJ9FjkvyxP8imiORzNFtfsrK200Ijz2Ns7F"
STRIPE_WEBHOOK_SECRET="whsec_temporaire"

# Auth0 (optionnel pour l'instant)
AUTH0_SECRET="un-secret-temporaire-pour-tests-123456"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://dev-temp.auth0.com"
AUTH0_CLIENT_ID="temp"
AUTH0_CLIENT_SECRET="temp"

NODE_ENV="development"
```

### 2. Installer Stripe CLI (pour webhook)

```bash
# Windows
winget install stripe.stripe-cli

# MacOS
brew install stripe/stripe-cli/stripe

# Linux
curl -s https://packages.stripe.com/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
```

### 3. Configurer le Webhook

```bash
# Se connecter à Stripe
stripe login

# Écouter les webhooks (laissez tourner dans un terminal séparé)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Copier le webhook secret** qui s'affiche (commence par `whsec_`) et le mettre dans `.env.local`

### 4. Démarrer l'Application

```bash
# Terminal 1 : Application
npm run dev

# Terminal 2 : Webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 🧪 Tester un Paiement

1. Aller sur http://localhost:3000
2. Ajouter des produits au panier
3. Cliquer sur "Payer avec Stripe"
4. Utiliser une carte de test :
   - **Numéro** : `4242 4242 4242 4242`
   - **Date** : N'importe quelle date future (ex: 12/34)
   - **CVC** : N'importe quel 3 chiffres (ex: 123)
   - **Code postal** : N'importe quel code

## 📊 Vérifier les Paiements

Aller sur votre [Dashboard Stripe](https://dashboard.stripe.com/test/payments)

## 🎯 Différences avec l'Exemple Fourni

### Exemple Stripe Basique
```javascript
// server.js - Exemple simple
app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price: '{{PRICE_ID}}',  // Prix fixe
      quantity: 1
    }],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });
  res.redirect(303, session.url);
});
```

### Notre Implémentation (Plus Avancée)
```typescript
// src/app/api/stripe/create-checkout-session/route.ts
export async function POST(request: NextRequest) {
  const { items } = await request.json()
  
  // Création dynamique des line items depuis le panier
  const lineItems = items.map((item: any) => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: `${process.env.AUTH0_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.AUTH0_BASE_URL}/checkout/cancel`,
    // + Métadonnées, adresse, téléphone, codes promo, etc.
  })
  
  return NextResponse.json({ url: session.url })
}
```

### Avantages de Notre Version
✅ **Panier dynamique** - N'importe quel produit
✅ **Quantités variables** - Géré automatiquement
✅ **Prix dynamiques** - Calculés en temps réel
✅ **Métadonnées** - Sauvegarde userId, email, items
✅ **Webhook** - Création automatique commande en BDD
✅ **Adresse collectée** - Livraison automatique
✅ **Codes promo** - Support natif Stripe
✅ **Pages succès/échec** - Belles pages Next.js

## 📁 Structure de Notre Intégration

```
src/
├── app/
│   ├── api/
│   │   └── stripe/
│   │       ├── create-checkout-session/
│   │       │   └── route.ts           # Création session Stripe
│   │       └── webhook/
│   │           └── route.ts           # Réception événements
│   ├── checkout/
│   │   ├── success/
│   │   │   └── page.tsx              # ✅ success.html équivalent
│   │   └── cancel/
│   │       └── page.tsx              # ❌ cancel.html équivalent
│   └── cart/
│       └── page.tsx                  # 🛒 checkout.html équivalent
└── components/
    └── StripeCheckoutButton.tsx      # Bouton "Payer avec Stripe"
```

## 🔗 URLs Importantes

### Application
- **Panier** : http://localhost:3000/cart
- **Succès** : http://localhost:3000/checkout/success
- **Annulation** : http://localhost:3000/checkout/cancel

### Stripe Dashboard
- **Paiements Test** : https://dashboard.stripe.com/test/payments
- **Webhooks** : https://dashboard.stripe.com/test/webhooks
- **API Keys** : https://dashboard.stripe.com/test/apikeys

## ✅ Checklist

- [x] Clés Stripe récupérées
- [ ] Fichier `.env.local` créé
- [ ] Stripe CLI installé
- [ ] Webhook écouté avec CLI
- [ ] `STRIPE_WEBHOOK_SECRET` mis à jour
- [ ] Application démarrée
- [ ] Test de paiement effectué
- [ ] Webhook reçu et commande créée

## 🎉 C'est Prêt !

Une fois `.env.local` créé avec vos clés, votre intégration Stripe est **100% fonctionnelle** !

Pas besoin de `server.js` Express, tout est géré par Next.js API Routes.

