# Système d'Authentification et Shopping Express

## Fonctionnalités Implémentées

### 1. Système d'Authentification
- **Contexte d'authentification** (`AuthContext.tsx`) : Gestion globale de l'état de connexion
- **Connexion/Inscription** : Modales interactives avec validation
- **Gestion des tokens JWT** : Authentification sécurisée
- **Persistance de session** : Connexion automatique au rechargement

### 2. Shopping Express
- **Achat sans compte** : Processus de commande simplifié en 3 étapes
- **Collecte d'informations** : Contact, livraison et paiement
- **Option de sauvegarde** : Possibilité de créer un compte après achat
- **Interface intuitive** : Design cohérent avec le reste de l'application

### 3. Tableau de Bord Utilisateur
- **Page de compte** (`/account`) : Interface utilisateur personnalisée
- **Menu de navigation** : Accès rapide aux fonctionnalités
- **Gestion du profil** : Informations personnelles et paramètres

## Structure des Fichiers

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexte d'authentification
├── components/
│   ├── AuthModal.tsx            # Modales de connexion/inscription
│   └── ExpressCheckout.tsx      # Composant d'achat express
├── app/
│   ├── api/auth/
│   │   ├── login/route.ts       # API de connexion
│   │   ├── register/route.ts    # API d'inscription
│   │   └── me/route.ts          # API de vérification de token
│   ├── api/orders/
│   │   └── express/route.ts     # API de commande express
│   └── account/
│       └── page.tsx             # Page de compte utilisateur
```

## Configuration Requise

### Variables d'Environnement
```env
# JWT Secret pour l'authentification
JWT_SECRET="your-jwt-secret-here"

# Base de données (déjà configurée)
DATABASE_URL="file:./dev.db"
```

### Dépendances Ajoutées
- `jsonwebtoken` : Gestion des tokens JWT
- `@types/jsonwebtoken` : Types TypeScript pour JWT
- `bcryptjs` : Hachage des mots de passe (déjà présent)

## Utilisation

### 1. Connexion/Inscription
- Cliquer sur l'icône utilisateur dans le header
- Choisir entre "Se connecter" ou "S'inscrire"
- Remplir le formulaire avec validation en temps réel

### 2. Shopping Express
- Ajouter des produits au panier
- Cliquer sur "Achat Express" dans le panier
- Suivre les 3 étapes : Contact → Livraison → Paiement
- Option de sauvegarde des informations pour les prochaines commandes

### 3. Tableau de Bord
- Accéder via `/account` ou le menu utilisateur
- Gérer les informations personnelles
- Consulter l'historique des commandes
- Accéder aux paramètres

## Sécurité

- **Mots de passe hachés** avec bcryptjs
- **Tokens JWT** avec expiration (7 jours)
- **Validation côté serveur** pour toutes les entrées
- **Gestion d'erreurs** appropriée
- **Séparation des données** sensibles

## Prochaines Étapes

1. **Intégration Stripe** : Paiements sécurisés
2. **Webhooks** : Mise à jour automatique des statuts de commande
3. **Email de confirmation** : Notifications par email
4. **Gestion des adresses** : Sauvegarde des adresses de livraison
5. **Historique des commandes** : Page dédiée avec détails
6. **Favoris** : Système de produits préférés
7. **Notifications** : Système de notifications en temps réel

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Vérification de token

### Commandes
- `POST /api/orders/express` - Création de commande express

## Base de Données

Le schéma Prisma a été étendu pour supporter :
- **Utilisateurs** avec authentification
- **Commandes** avec informations de livraison
- **Articles de commande** liés aux produits
- **Adresses de livraison** en JSON