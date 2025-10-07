# 🌿 Garden Gold Green - E-commerce CBD Premium

Une plateforme e-commerce moderne et élégante spécialisée dans les produits CBD premium, construite avec Next.js 15, TypeScript et Tailwind CSS.

## ✨ Fonctionnalités

### 🛒 **E-commerce Complet**
- **Catalogue de produits** avec filtres avancés (catégorie, prix, concentration CBD)
- **Page de détail produit** avec galerie d'images et informations détaillées
- **Panier intelligent** avec gestion des quantités et recommandations
- **Système de commande** avec intégration Stripe
- **Gestion des commandes** et historique client

### 🎨 **Interface Utilisateur**
- **Design moderne** avec thème sombre et accents dorés/verts
- **Responsive design** optimisé pour tous les appareils
- **Animations fluides** et micro-interactions
- **Loading states** pour toutes les images
- **Breadcrumbs** pour une navigation intuitive

### 🔐 **Authentification & Sécurité**
- **Intégration Auth0** pour l'authentification
- **Connexions sociales** (Apple, Google, Facebook)
- **Gestion des sessions** sécurisée
- **Protection des routes** sensibles

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
- **Paiements** : Stripe
- **Authentification** : Auth0
- **Base de données** : Prisma (SQLite)
- **Icons** : FontAwesome
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
cp .env.example .env.local
```

4. **Configurer la base de données**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
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
│   │   ├── products/          # Pages produits
│   │   ├── cart/              # Page panier
│   │   ├── auth/              # Authentification
│   │   └── api/               # API Routes
│   ├── components/            # Composants React
│   │   ├── ui/               # Composants UI de base
│   │   ├── ProductCard.tsx   # Carte produit
│   │   ├── Breadcrumb.tsx    # Navigation breadcrumb
│   │   └── ImageWithLoading.tsx # Images avec loading
│   ├── contexts/             # Contextes React
│   │   ├── AuthContext.tsx   # Authentification
│   │   ├── CartContext.tsx   # Panier
│   │   └── NotificationContext.tsx # Notifications
│   ├── lib/                  # Utilitaires
│   │   ├── prisma.ts         # Client Prisma
│   │   └── utils.ts          # Fonctions utilitaires
│   └── data/                 # Données statiques
│       └── products.json     # Catalogue produits
├── prisma/                   # Schéma base de données
├── public/                   # Assets statiques
└── tailwind.config.js       # Configuration Tailwind
```

## 🎯 Fonctionnalités Détaillées

### 🛍️ **Catalogue Produits**
- **Filtres avancés** : Catégorie, prix, concentration CBD
- **Recherche intelligente** avec suggestions
- **Tri dynamique** (prix, popularité, nouveauté)
- **Pagination** optimisée
- **Vue grille/liste** avec toggle

### 🛒 **Panier & Commande**
- **Gestion des quantités** avec sélecteur intuitif
- **Calcul automatique** des totaux et taxes
- **Sauvegarde locale** des paniers
- **Recommandations** basées sur l'historique
- **Codes promo** et réductions

### 👤 **Compte Utilisateur**
- **Profil utilisateur** avec informations personnelles
- **Historique des commandes** détaillé
- **Favoris** et listes de souhaits
- **Adresses de livraison** multiples

### 🎨 **Design System**
- **Thème cohérent** avec couleurs de marque
- **Composants réutilisables** et modulaires
- **Animations** et transitions fluides
- **Accessibilité** respectée (WCAG)

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

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
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
npm run db:seed      # Peupler la base de données
```

## 🚀 Déploiement

### Vercel (Recommandé)

1. **Connecter le repository** à Vercel
2. **Configurer les variables d'environnement**
3. **Déployer automatiquement** à chaque push

### Autres plateformes

Le projet est compatible avec :
- **Netlify**
- **Railway**
- **Heroku**
- **AWS Amplify**

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

---

**Garden Gold Green** - *Experience Nature's Finest Elixir* 🌿✨