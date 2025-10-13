# Système d'Abonnements - Garden Gold Green

## 🎯 Vue d'ensemble

Le système d'abonnements permet aux clients de s'abonner à des produits CBD avec des livraisons automatiques et des remises exclusives. Il supporte trois types d'abonnements :

- **Hebdomadaire** : Livraison chaque semaine avec 5% de remise
- **Mensuel** : Livraison chaque mois avec 10% de remise  
- **Annuel** : Livraison mensuelle pendant un an avec 15% de remise

## 🏗️ Architecture

### Modèles de données

#### SubscriptionPlan
- Plans d'abonnement disponibles pour chaque produit
- Définit la fréquence, le prix et les remises
- Lié à un produit spécifique

#### Subscription
- Abonnements actifs des utilisateurs
- Suit le statut (actif, en pause, annulé)
- Gère les dates de facturation et de livraison

#### SubscriptionDelivery
- Livraisons programmées et effectuées
- Suivi des statuts de livraison
- Historique des commandes générées

### API Routes

#### `/api/subscriptions/plans`
- `GET ?productId=xxx` : Récupère les plans d'un produit
- `POST` : Crée un nouveau plan d'abonnement

#### `/api/subscriptions`
- `GET ?userId=xxx` : Récupère les abonnements d'un utilisateur
- `POST` : Crée un nouvel abonnement

#### `/api/subscriptions/[id]`
- `GET` : Récupère un abonnement spécifique
- `PATCH` : Met à jour un abonnement
- `DELETE` : Annule un abonnement

## 🚀 Installation et Configuration

### 1. Configuration initiale

```bash
# Exécuter le script de configuration complet
node scripts/setup-subscriptions.js setup
```

Ce script :
- Génère le client Prisma
- Applique les migrations de base de données
- Crée les plans d'abonnement par défaut
- Vérifie la configuration

### 2. Vérification

```bash
# Tester le système
node scripts/setup-subscriptions.js test

# Créer un exemple d'abonnement
node scripts/setup-subscriptions.js example
```

### 3. Gestion des plans

```bash
# Lister tous les plans
node scripts/create-subscription-plans.js list

# Supprimer tous les plans
node scripts/create-subscription-plans.js reset

# Recréer tous les plans
node scripts/create-subscription-plans.js create
```

## 🎨 Interface Utilisateur

### Pages principales

#### `/subscriptions`
- Gestion des abonnements de l'utilisateur
- Actions : pause, annulation, reprise, modification de quantité
- Historique des livraisons

#### `/products/[slug]`
- Onglet "Abonnements" sur les pages produits
- Sélection des plans d'abonnement
- Modal de création d'abonnement

### Composants

#### SubscriptionPlans
- Affichage des plans disponibles
- Comparaison des prix et remises
- Sélection de plan

#### SubscriptionManager
- Gestion des abonnements existants
- Actions utilisateur
- Historique des livraisons

#### CreateSubscriptionModal
- Formulaire de création d'abonnement
- Gestion de l'adresse de livraison
- Validation des données

## 🔧 Utilisation

### Hook useSubscriptions

```typescript
const {
  plans,
  loadingPlans,
  fetchPlans,
  subscriptions,
  loadingSubscriptions,
  fetchSubscriptions,
  createSubscription,
  pauseSubscription,
  cancelSubscription,
  resumeSubscription,
  updateSubscriptionQuantity
} = useSubscriptions();
```

### Création d'un abonnement

```typescript
const handleCreateSubscription = async (data) => {
  try {
    await createSubscription({
      userId: user.sub,
      planId: selectedPlan.id,
      quantity: 1,
      shippingAddress: {
        firstName: 'Jean',
        lastName: 'Dupont',
        address1: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      }
    });
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### Gestion des abonnements

```typescript
// Mettre en pause
await pauseSubscription(subscriptionId);

// Annuler
await cancelSubscription(subscriptionId);

// Reprendre
await resumeSubscription(subscriptionId);

// Modifier la quantité
await updateSubscriptionQuantity(subscriptionId, 2);
```

## 💳 Intégration Stripe (À venir)

Le système est préparé pour l'intégration Stripe :

### Configuration requise

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Webhooks Stripe

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### Paiements récurrents

- Création automatique des abonnements Stripe
- Gestion des échecs de paiement
- Mise à jour des prix et quantités

## 📊 Statistiques et Analytics

### Métriques disponibles

- Nombre d'abonnements actifs
- Revenus récurrents mensuels
- Taux de rétention
- Plans les plus populaires
- Taux d'annulation (churn rate)

### Dashboard Admin (À venir)

- Vue d'ensemble des abonnements
- Gestion des plans
- Statistiques de performance
- Gestion des livraisons

## 🔄 Workflow des livraisons

### 1. Programmation automatique
- Les livraisons sont créées automatiquement
- Basées sur l'intervalle de l'abonnement
- Gestion des jours fériés et weekends

### 2. Génération des commandes
- Création automatique des commandes
- Intégration avec le système existant
- Gestion du stock

### 3. Suivi et notifications
- Mise à jour des statuts
- Notifications par email
- Numéros de suivi

## 🛡️ Sécurité et Validation

### Validation des données
- Vérification des adresses
- Validation des quantités
- Contrôle des permissions utilisateur

### Sécurité
- Authentification requise
- Validation côté serveur
- Protection CSRF
- Sanitisation des entrées

## 🧪 Tests

### Tests unitaires
```bash
npm test -- --testPathPattern=subscription
```

### Tests d'intégration
```bash
npm run test:integration
```

### Tests end-to-end
```bash
npm run test:e2e
```

## 📝 Maintenance

### Tâches régulières

#### Nettoyage des données
- Suppression des abonnements expirés
- Archivage des livraisons anciennes
- Optimisation de la base de données

#### Monitoring
- Surveillance des échecs de paiement
- Alertes sur les problèmes de livraison
- Métriques de performance

### Sauvegarde
- Sauvegarde quotidienne de la base de données
- Backup des configurations Stripe
- Versioning des plans d'abonnement

## 🚨 Dépannage

### Problèmes courants

#### Plans non affichés
1. Vérifier que les produits ont des plans actifs
2. Contrôler les permissions utilisateur
3. Vérifier les logs API

#### Erreurs de création d'abonnement
1. Vérifier l'authentification utilisateur
2. Contrôler la validité de l'adresse
3. Vérifier les limites de stock

#### Problèmes de livraison
1. Vérifier les dates programmées
2. Contrôler le statut des commandes
3. Vérifier l'intégration avec le système de livraison

### Logs et debugging

```bash
# Logs de l'application
tail -f logs/app.log

# Logs de la base de données
npx prisma studio

# Logs Stripe (si configuré)
stripe logs tail
```

## 📞 Support

Pour toute question ou problème :

1. Consulter cette documentation
2. Vérifier les logs d'erreur
3. Tester avec les scripts fournis
4. Contacter l'équipe de développement

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Auteur** : Équipe Garden Gold Green
