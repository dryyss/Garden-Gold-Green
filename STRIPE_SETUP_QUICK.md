# Configuration Stripe Rapide

## 🚨 Problème identifié
Les clés Stripe ne sont pas configurées dans `.env.local`, ce qui empêche la création de sessions Stripe.

## 🔧 Solution rapide

### 1. Obtenir les clés Stripe

1. Allez sur [Stripe Dashboard](https://dashboard.stripe.com/)
2. Connectez-vous ou créez un compte
3. Allez dans "Developers" > "API keys"
4. Copiez :
   - **Publishable key** (commence par `pk_test_`)
   - **Secret key** (commence par `sk_test_`)

### 2. Configurer les clés

Modifiez le fichier `.env.local` :

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY="pk_test_votre_cle_publique_ici"
STRIPE_SECRET_KEY="sk_test_votre_cle_secrete_ici"
STRIPE_WEBHOOK_SECRET="whsec_votre_webhook_secret_ici"
```

### 3. Redémarrer le serveur

```bash
npm run dev
```

## 🧪 Test rapide

Une fois configuré, testez :
1. Allez sur `http://localhost:3000`
2. Ajoutez des produits au panier
3. Sélectionnez "Carte bancaire" (Stripe)
4. Le paiement Stripe devrait fonctionner

## 📝 Note

- Utilisez les clés **TEST** pour le développement
- Les clés **LIVE** sont pour la production
- Le webhook secret est optionnel pour les tests de base
