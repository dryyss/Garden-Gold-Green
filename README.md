# 🌿 Garden Gold Green - E-commerce CBD Premium

Une plateforme e-commerce moderne et élégante spécialisée dans les produits CBD premium, construite avec Next.js 15, TypeScript et Tailwind CSS.

## ✨ Fonctionnalités

### 🛒 **E-commerce Complet**
- **Catalogue de produits** avec filtres avancés (catégorie, prix, concentration CBD)
- **Page de détail produit** avec galerie d'images et informations détaillées
- **Panier intelligent** avec gestion des quantités et recommandations
- **Système de commande** avec intégration Stripe et PayPal
- **Gestion des commandes** et historique client
- **Système d'abonnements** pour les produits récurrents

### 🎨 **Interface Utilisateur**
- **Design moderne** avec thème sombre et accents dorés/verts
- **Responsive design** optimisé pour tous les appareils
- **Animations fluides** et micro-interactions
- **Loading states** pour toutes les images
- **Breadcrumbs** pour une navigation intuitive
- **Système de notifications** en temps réel

### 🔐 **Authentification & Sécurité**
- **Intégration Auth0** pour l'authentification
- **Connexions sociales** (Apple, Google, Facebook)
- **Gestion des sessions** sécurisée
- **Protection des routes** sensibles
- **Gestion des rôles** utilisateur (admin, client)

### 🌍 **Internationalisation**
- **Support multilingue** (Français, Anglais, Espagnol)
- **Système de traduction** dynamique
- **Localisation** des devises et formats

### 🚀 **Performance & SEO**
- **Optimisation Next.js** avec App Router
- **Images optimisées** avec lazy loading
- **SEO-friendly** avec métadonnées complètes
- **PWA ready** pour l'installation mobile

## 🛠️ Technologies

- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **State Management** : React Context API
- **Paiements** : Stripe + PayPal
- **Authentification** : Auth0
- **Base de données** : Prisma (PostgreSQL)
- **Icons** : FontAwesome + Lucide React
- **Déploiement** : Vercel

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation locale

1. **Cloner le repository**
```bash
git clone https://github.com/dryyss/Garden-Gold-Green.git
cd Garden-Gold-Green
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp env.example .env.local
```

4. **Configurer la base de données**
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
garden-gold-green/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── [locale]/          # Pages internationalisées
│   │   │   ├── products/      # Pages produits
│   │   │   ├── cart/          # Page panier
│   │   │   ├── checkout/      # Processus de commande
│   │   │   ├── orders/        # Gestion des commandes
│   │   │   ├── subscriptions/ # Gestion des abonnements
│   │   │   └── profile/       # Profil utilisateur
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentification
│   │   │   ├── stripe/        # Paiements Stripe
│   │   │   ├── paypal/        # Paiements PayPal
│   │   │   ├── orders/        # Gestion des commandes
│   │   │   └── subscriptions/ # Gestion des abonnements
│   │   └── globals.css        # Styles globaux
│   ├── components/            # Composants React
│   │   ├── ui/               # Composants UI de base
│   │   ├── ProductCard.tsx   # Carte produit
│   │   ├── Breadcrumb.tsx    # Navigation breadcrumb
│   │   ├── ImageWithLoading.tsx # Images avec loading
│   │   └── PaymentForm.tsx   # Formulaire de paiement
│   ├── contexts/             # Contextes React
│   │   ├── AuthContext.tsx   # Authentification
│   │   ├── CartContext.tsx   # Panier
│   │   ├── NotificationContext.tsx # Notifications
│   │   └── TranslationContext.tsx # Traductions
│   ├── hooks/                # Hooks personnalisés
│   │   ├── useAuthNotifications.ts
│   │   ├── useOrderNotifications.ts
│   │   └── useSubscriptions.ts
│   ├── lib/                  # Utilitaires
│   │   ├── prisma.ts         # Client Prisma
│   │   ├── stripe.ts         # Configuration Stripe
│   │   └── utils.ts          # Fonctions utilitaires
│   ├── locales/              # Fichiers de traduction
│   │   ├── fr.json           # Français
│   │   ├── en.json           # Anglais
│   │   └── es.json           # Espagnol
│   └── types/                # Types TypeScript
│       └── subscription.ts   # Types d'abonnement
├── prisma/                   # Schéma base de données
│   ├── schema.prisma         # Schéma Prisma
│   └── seed.ts              # Données de test
├── public/                   # Assets statiques
│   └── products/            # Images des produits
├── scripts/                  # Scripts utilitaires
└── tailwind.config.js       # Configuration Tailwind
```

## 🎯 Fonctionnalités Détaillées

### 🛍️ **Catalogue Produits**
- **Filtres avancés** : Catégorie, prix, concentration CBD
- **Recherche intelligente** avec suggestions
- **Tri dynamique** (prix, popularité, nouveauté)
- **Pagination** optimisée
- **Vue grille/liste** avec toggle
- **Images haute qualité** avec lazy loading

### 🛒 **Panier & Commande**
- **Gestion des quantités** avec sélecteur intuitif
- **Calcul automatique** des totaux et taxes
- **Sauvegarde locale** des paniers
- **Recommandations** basées sur l'historique
- **Codes promo** et réductions
- **Paiement sécurisé** Stripe et PayPal

### 👤 **Compte Utilisateur**
- **Profil utilisateur** avec informations personnelles
- **Historique des commandes** détaillé
- **Favoris** et listes de souhaits
- **Adresses de livraison** multiples
- **Gestion des abonnements**

### 📧 **Système de Notifications**
- **Notifications en temps réel** pour les commandes
- **Emails de confirmation** automatiques
- **Alertes de paiement** et livraison
- **Notifications d'abonnement**

### 🌍 **Internationalisation**
- **3 langues** supportées (FR, EN, ES)
- **Traduction dynamique** de l'interface
- **Localisation** des devises et dates
- **SEO multilingue**

## 🔧 Configuration

### Variables d'environnement

```env
# Base de données
DATABASE_URL="file:./dev.db"

# Auth0
AUTH0_SECRET="your-secret"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://your-domain.auth0.com"
AUTH0_CLIENT_ID="your-client-id"
AUTH0_CLIENT_SECRET="your-client-secret"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_MODE="sandbox"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# SendGrid (Emails)
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM_EMAIL="noreply@gardengoldgreen.com"
```

## 📦 Scripts Disponibles

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linting ESLint

# Base de données
npm run db:generate  # Générer le client Prisma
npm run db:push      # Pousser le schéma vers la DB
npm run db:migrate   # Migrations de base de données
npm run db:seed      # Peupler la base de données
npm run db:studio    # Interface Prisma Studio
```

## 🚀 Déploiement

Pour déployer votre application, consultez le **Guide de Déploiement Complet** : [DEPLOYMENT.md](./DEPLOYMENT.md)

### Plateformes supportées

- **IONOS** (Guide complet disponible)
- **Vercel**
- **Railway**
- **Heroku**
- **AWS Amplify**

## 📊 Fonctionnalités Avancées

### 💳 **Système de Paiement**
- **Stripe** pour les cartes bancaires
- **PayPal** pour les paiements alternatifs
- **Webhooks** pour la synchronisation
- **Gestion des remboursements**

### 🔄 **Système d'Abonnements**
- **Plans d'abonnement** flexibles
- **Gestion des récurrences** automatique
- **Pause/Reprise** d'abonnements
- **Historique des abonnements**

### 📈 **Analytics & Monitoring**
- **Suivi des commandes** en temps réel
- **Métriques de performance**
- **Logs d'erreurs** centralisés

## 🤝 Contribution

1. **Fork** le projet
2. **Créer une branche** feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** les changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir une Pull Request**

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développement** : [@dryyss](https://github.com/dryyss)
- **Design** : Garden Gold Green Team

## 📞 Support

Pour toute question ou support :
- **Email** : support@gardengoldgreen.com
- **Issues** : [GitHub Issues](https://github.com/dryyss/Garden-Gold-Green/issues)

## 🔄 Changelog

### Version 0.1.0
- ✅ E-commerce complet avec Stripe et PayPal
- ✅ Authentification Auth0
- ✅ Système d'abonnements
- ✅ Internationalisation (FR, EN, ES)
- ✅ Interface responsive et moderne
- ✅ Gestion des commandes et notifications
- ✅ Optimisations de performance

---

**Garden Gold Green** - *Experience Nature's Finest Elixir* 🌿✨