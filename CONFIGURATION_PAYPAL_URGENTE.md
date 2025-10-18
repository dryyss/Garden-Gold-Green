# 🚨 Configuration PayPal URGENTE

## Problème identifié
PayPal ne fonctionne pas car les clés API ne sont pas configurées dans le fichier `.env.local`.

## Solution rapide

### 1. Créer le fichier .env.local
Créez un fichier `.env.local` à la racine du projet avec ce contenu :

```env
# Database
DATABASE_URL="file:./dev.db"

# Auth0 Configuration
AUTH0_SECRET="use-openssl-rand-hex-32-to-generate-this"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://dev-1tkaqeynik4yy714.us.auth0.com"
AUTH0_CLIENT_ID="Lt54JQ2uYcmyTU0oo7Tu5EVwJJIIBJX9"
AUTH0_CLIENT_SECRET="cWYxj8kUnzDCkSWvEPiHSnsHkVgxAn-ZeZJHcT7V3_3CjOrVUa4drp_g3bMeSGIg"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_51Q..."
STRIPE_SECRET_KEY="sk_test_51Q..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal - À CONFIGURER
PAYPAL_CLIENT_ID="votre-client-id-paypal"
PAYPAL_CLIENT_SECRET="votre-client-secret-paypal"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 2. Obtenir les clés PayPal

#### Option A : Mode Sandbox (Recommandé pour les tests)
1. Allez sur [PayPal Developer](https://developer.paypal.com/)
2. Connectez-vous avec votre compte PayPal
3. Cliquez sur "Create App"
4. Choisissez "Default Application"
5. Sélectionnez "Sandbox" pour l'environnement
6. Copiez le **Client ID** et le **Client Secret**

#### Option B : Mode Live (Production)
1. Même processus mais sélectionnez "Live" au lieu de "Sandbox"
2. ⚠️ **ATTENTION** : Ne testez jamais avec de vrais paiements en développement

### 3. Mettre à jour .env.local
Remplacez dans votre fichier `.env.local` :
```env
PAYPAL_CLIENT_ID="votre-vrai-client-id-ici"
PAYPAL_CLIENT_SECRET="votre-vrai-client-secret-ici"
```

### 4. Redémarrer le serveur
```bash
npm run dev
```

## Test rapide

1. Ajoutez un produit au panier
2. Allez sur la page panier
3. Sélectionnez "PayPal" comme méthode de paiement
4. Cliquez sur "Payer maintenant"
5. Vous devriez être redirigé vers PayPal

## Erreurs courantes

### "Configuration PayPal manquante"
- Vérifiez que le fichier `.env.local` existe
- Vérifiez que les variables `PAYPAL_CLIENT_ID` et `PAYPAL_CLIENT_SECRET` sont définies
- Redémarrez le serveur après modification

### "Invalid client credentials"
- Vérifiez que les clés sont correctes
- Assurez-vous d'utiliser les bonnes clés (sandbox vs live)

### "Order not found"
- Normal en mode sandbox, c'est juste un test

## URLs de retour PayPal

Dans votre application PayPal Developer, configurez :
- **Return URL** : `http://localhost:3000/checkout/success`
- **Cancel URL** : `http://localhost:3000/cart`

## Comptes de test PayPal

En mode sandbox, vous pouvez utiliser :
- **Email** : `sb-buyer@personal.example.com`
- **Mot de passe** : `password123`

## Support

Si vous avez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez les logs du serveur dans le terminal
3. Vérifiez que les URLs de retour sont correctes dans PayPal Developer

---

**Une fois configuré, PayPal fonctionnera parfaitement ! 🎉**

