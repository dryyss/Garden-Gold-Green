# Configuration des Méthodes de Paiement

Ce guide explique comment configurer les différentes méthodes de paiement disponibles dans l'application Garden Gold Green.

## 🚀 Méthodes de Paiement Disponibles

- **Carte bancaire** (Stripe) - Visa, Mastercard, American Express
- **PayPal** - Paiement sécurisé PayPal
- **Apple Pay** - Paiement rapide sur appareils Apple
- **Google Pay** - Paiement en un clic sur Android

## ⚙️ Configuration

### 1. Variables d'Environnement

Ajoutez ces variables à votre fichier `.env.local` :

```env
# Stripe (déjà configuré)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal (nouveau)
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"

# Configuration de l'application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 2. Configuration Stripe

Stripe est déjà configuré pour supporter :
- Cartes bancaires classiques
- Apple Pay (automatiquement activé si disponible)
- Google Pay (automatiquement activé si disponible)

**Note :** Apple Pay et Google Pay ne s'affichent que sur les appareils compatibles.

### 3. Configuration PayPal

#### Créer un compte PayPal Developer

1. Allez sur [PayPal Developer](https://developer.paypal.com/)
2. Connectez-vous avec votre compte PayPal
3. Créez une nouvelle application
4. Choisissez "Sandbox" pour les tests ou "Live" pour la production

#### Obtenir les clés API

1. Dans votre application PayPal, allez dans l'onglet "API Credentials"
2. Copiez le **Client ID** et le **Client Secret**
3. Ajoutez-les à votre fichier `.env.local`

#### Configuration des URLs de retour

Dans votre application PayPal, configurez :
- **Return URL** : `http://localhost:3000/checkout/success`
- **Cancel URL** : `http://localhost:3000/cart`

## 🔧 Utilisation

### Dans le Panier

Le composant `PaymentMethodSelector` s'affiche automatiquement dans :
- Le sidebar du panier (quand on est sur la page panier)
- La page panier principale
- Les pages de checkout

### Sélection de la Méthode

L'utilisateur peut choisir sa méthode de paiement préférée :
1. Carte bancaire (Stripe)
2. PayPal
3. Apple Pay (si disponible)
4. Google Pay (si disponible)

### Processus de Paiement

1. **Stripe** : Redirige vers Stripe Checkout
2. **PayPal** : Redirige vers PayPal pour l'approbation
3. **Apple Pay/Google Pay** : Utilise Stripe avec les méthodes natives

## 🧪 Tests

### Mode Sandbox

Pour tester les paiements :

1. **Stripe** : Utilisez les cartes de test Stripe
2. **PayPal** : Utilisez les comptes sandbox PayPal
3. **Apple Pay** : Testez sur un appareil iOS avec Apple Pay configuré
4. **Google Pay** : Testez sur un appareil Android avec Google Pay configuré

### Cartes de Test Stripe

```
Visa : 4242 4242 4242 4242
Mastercard : 5555 5555 5555 4444
American Express : 3782 822463 10005
```

### Comptes PayPal Sandbox

Créez des comptes de test dans votre dashboard PayPal Developer.

## 🔒 Sécurité

- Tous les paiements sont chiffrés avec SSL
- Les données sensibles ne sont jamais stockées localement
- Stripe et PayPal gèrent la conformité PCI DSS
- Les webhooks vérifient l'authenticité des paiements

## 🐛 Dépannage

### Problèmes Courants

1. **PayPal ne s'affiche pas** : Vérifiez les clés API PayPal
2. **Apple Pay/Google Pay ne s'affichent pas** : Normal sur desktop, testez sur mobile
3. **Erreur de redirection** : Vérifiez les URLs dans la configuration PayPal

### Logs de Débogage

Les logs détaillés sont disponibles dans la console du navigateur et les logs serveur.

## 📱 Responsive Design

Le composant s'adapte automatiquement :
- **Desktop** : Affichage en grille
- **Mobile** : Affichage en colonne unique
- **Tablet** : Adaptation des boutons

## 🎨 Personnalisation

### Styles

Les styles peuvent être modifiés dans `PaymentMethodSelector.tsx` :
- Couleurs des boutons
- Icônes des méthodes
- Animations et transitions

### Méthodes Personnalisées

Pour ajouter une nouvelle méthode de paiement :
1. Ajoutez-la au tableau `paymentMethods`
2. Implémentez la fonction de gestion
3. Créez l'API correspondante

## 📞 Support

Pour toute question :
1. Consultez les logs de la console
2. Vérifiez la configuration des variables d'environnement
3. Testez avec les comptes sandbox
4. Contactez l'équipe de développement

---

**Développé avec ❤️ pour Garden Gold Green**
