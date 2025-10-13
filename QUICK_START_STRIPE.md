# 🚀 Démarrage Rapide - Stripe Checkout

## ✅ Ce qui a été fait

1. ✅ Installation de Stripe (`stripe` et `@stripe/stripe-js`)
2. ✅ Création de l'API route `/api/checkout` pour créer des sessions Stripe
3. ✅ Page de succès `/checkout/success` après paiement
4. ✅ Intégration du bouton "Payer avec Stripe" dans le panier
5. ✅ Support du paiement invité (pas besoin de compte)

## 🔑 Configuration Requise

**IMPORTANT** : Pour que le paiement fonctionne, vous devez configurer vos clés Stripe :

### 1. Créer le fichier `.env.local`

Créez un fichier `.env.local` à la racine du projet :

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Stripe (REMPLACEZ PAR VOS VRAIES CLÉS)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Obtenir vos clés Stripe

1. Allez sur [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Créez un compte gratuit (mode test)
3. Allez dans **Developers → API keys**
4. Copiez :
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### 3. Redémarrer le serveur

```bash
npm run dev
```

## 🧪 Tester le Paiement

1. **Ajouter un produit au panier**
   - Naviguez vers `/products`
   - Cliquez sur "Add to Cart"

2. **Ouvrir le panier**
   - Cliquez sur l'icône panier dans le header

3. **Cliquer sur "Payer avec Stripe"**
   - Vous serez redirigé vers le formulaire Stripe hébergé

4. **Utiliser une carte de test**
   - **Numéro** : `4242 4242 4242 4242`
   - **Date** : N'importe quelle date future (ex: 12/25)
   - **CVC** : N'importe quels 3 chiffres (ex: 123)
   - **Email** : Votre email de test

5. **Valider le paiement**
   - Vous serez redirigé vers `/checkout/success`
   - Le panier sera automatiquement vidé

## 🎯 Fonctionnalités

✅ **Paiement par carte bancaire** (Visa, Mastercard, etc.)
✅ **Paiement invité** (pas besoin de compte)
✅ **Formulaire hébergé par Stripe** (sécurisé, conforme PCI)
✅ **Collecte automatique de l'adresse de livraison**
✅ **Support multi-pays** (France, Belgique, Luxembourg, Suisse, etc.)
✅ **Collecte du numéro de téléphone**
✅ **Redirection automatique après succès/annulation**
✅ **Vidage automatique du panier après paiement**

## 📱 Flux Complet

```
1. Utilisateur clique "Payer avec Stripe"
   ↓
2. Appel API → POST /api/checkout
   ↓
3. Création session Stripe Checkout
   ↓
4. Redirection → Formulaire Stripe hébergé
   ↓
5. Utilisateur entre ses informations
   ↓
6. Paiement validé → Redirection /checkout/success
   ↓
7. Panier vidé automatiquement
```

## ⚠️ Important

- **Le webhook secret n'est pas obligatoire** pour le développement
- Les webhooks seront nécessaires en production pour gérer les paiements asynchrones
- En mode test, les paiements ne sont pas réels
- Voir `STRIPE_SETUP.md` pour plus de détails sur la configuration complète

## 🐛 Dépannage

**Erreur "No API key provided"** :
→ Vérifiez que `.env.local` contient bien `STRIPE_SECRET_KEY`

**Bouton ne fait rien** :
→ Vérifiez la console (F12) pour voir les erreurs
→ Vérifiez que le serveur est lancé (`npm run dev`)

**Page blanche après paiement** :
→ Vérifiez que la page `/checkout/success` existe
→ Regardez les logs du serveur

## 📚 Ressources

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Cartes de test Stripe](https://stripe.com/docs/testing)
- [Documentation Stripe Checkout](https://stripe.com/docs/payments/checkout)





