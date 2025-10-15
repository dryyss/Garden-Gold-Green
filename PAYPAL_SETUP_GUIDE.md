# Guide de Configuration PayPal

## 🚀 Configuration PayPal pour Garden Gold Green

### 1. Créer un Compte PayPal Developer

1. Allez sur [PayPal Developer](https://developer.paypal.com/)
2. Connectez-vous avec votre compte PayPal (ou créez-en un)
3. Cliquez sur "Create App" ou "Créer une application"

### 2. Configurer l'Application

1. **Nom de l'application** : `Garden Gold Green`
2. **Environnement** : 
   - **Sandbox** (pour les tests)
   - **Live** (pour la production)
3. **Fonctionnalités** : Cochez "Accept payments"

### 3. Obtenir les Clés API

1. Une fois l'application créée, allez dans l'onglet "API Credentials"
2. Copiez :
   - **Client ID** (clé publique)
   - **Client Secret** (clé secrète)

### 4. Configurer les Variables d'Environnement

Ajoutez ces variables à votre fichier `.env.local` :

```env
# PayPal Configuration
PAYPAL_CLIENT_ID="votre-client-id-ici"
PAYPAL_CLIENT_SECRET="votre-client-secret-ici"

# URLs de l'application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 5. URLs de Retour (Optionnel)

Dans votre application PayPal, configurez :
- **Return URL** : `http://localhost:3000/checkout/success`
- **Cancel URL** : `http://localhost:3000/cart`

### 6. Test de l'Intégration

Une fois configuré, testez avec :

```bash
node test-paypal.js
```

## 🧪 Comptes de Test PayPal

### Sandbox (Développement)

PayPal fournit des comptes de test automatiquement :
- **Compte vendeur** : Votre compte de test
- **Comptes acheteurs** : Créés automatiquement

### Comptes de Test Créés

1. Allez dans "Sandbox" > "Accounts"
2. Vous verrez des comptes de test prêts à utiliser
3. Utilisez ces comptes pour tester les paiements

## 🔧 Dépannage

### Erreurs Courantes

1. **"Configuration PayPal manquante"**
   - Vérifiez que les variables d'environnement sont définies
   - Redémarrez le serveur après modification du .env.local

2. **"Invalid client credentials"**
   - Vérifiez que les clés sont correctes
   - Assurez-vous d'utiliser les bonnes clés (sandbox vs live)

3. **"Order not found"**
   - Vérifiez que l'orderId est correct
   - L'ordre doit être dans l'état "APPROVED"

### Logs de Débogage

Les logs détaillés sont disponibles dans :
- Console du navigateur (côté client)
- Logs du serveur (côté API)

## 📱 Fonctionnalités PayPal

### Méthodes de Paiement Supportées

- **PayPal** : Comptes PayPal
- **Cartes bancaires** : Via PayPal (sans compte PayPal)
- **PayPal Credit** : Financement PayPal

### Avantages

- **Sécurité** : PayPal gère la sécurité des paiements
- **Conversion** : Beaucoup d'utilisateurs préfèrent PayPal
- **International** : Support mondial
- **Mobile** : Optimisé pour mobile

## 🚀 Mise en Production

### Checklist Production

1. ✅ Créer une application "Live" sur PayPal Developer
2. ✅ Obtenir les clés de production
3. ✅ Mettre à jour les variables d'environnement
4. ✅ Configurer les URLs de production
5. ✅ Tester avec de vrais paiements (petits montants)

### Variables de Production

```env
NODE_ENV=production
PAYPAL_CLIENT_ID="votre-client-id-production"
PAYPAL_CLIENT_SECRET="votre-client-secret-production"
NEXT_PUBLIC_APP_URL="https://gardengoldgreen.com"
NEXT_PUBLIC_BASE_URL="https://gardengoldgreen.com"
```

## 📞 Support

- **Documentation PayPal** : [developer.paypal.com](https://developer.paypal.com/)
- **Support PayPal** : Via le dashboard développeur
- **Communauté** : Stack Overflow avec tag "paypal"

---

**Configuration PayPal terminée ! Votre site peut maintenant accepter les paiements PayPal.**
