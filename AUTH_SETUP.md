# Configuration de l'Authentification

## ✅ Système créé

### Composants
- `LoginForm.tsx` - Formulaire de connexion
- `RegisterForm.tsx` - Formulaire d'inscription  
- `AuthModal.tsx` - Modal d'authentification
- `AuthContext.tsx` - Contexte global mis à jour

### API Routes
- `/api/auth/login` - Connexion
- `/api/auth/register` - Inscription
- `/api/auth/me` - Vérification du token

### Base de données
- Modèle `User` mis à jour dans Prisma
- Relations avec commentaires et retours

## 🔧 Configuration requise

### 1. Variables d'environnement

Ajoutez dans votre `.env.local` :

```bash
# JWT Secret (IMPORTANT: changez en production)
JWT_SECRET="votre-secret-jwt-super-securise-ici"

# Base de données
DATABASE_URL="file:./dev.db"
```

### 2. Migration de la base

```bash
npx prisma generate
npx prisma db push
```

### 3. Dépendances installées

- `bcryptjs` - Hashage des mots de passe
- `jsonwebtoken` - Tokens JWT

## 🎯 Fonctionnalités

### Connexion/Inscription
- ✅ Formulaires avec validation
- ✅ Hashage sécurisé des mots de passe
- ✅ Tokens JWT avec expiration (7 jours)
- ✅ Gestion des erreurs

### Interface
- ✅ Modal d'authentification dans le Header
- ✅ Boutons connexion/inscription
- ✅ Menu utilisateur avec déconnexion
- ✅ Design cohérent avec le thème

### Sécurité
- ✅ Mots de passe hachés avec bcrypt
- ✅ Tokens JWT sécurisés
- ✅ Validation côté serveur
- ✅ Gestion des erreurs

## 🚀 Utilisation

1. **Connexion** : Cliquez sur "Connexion" dans le Header
2. **Inscription** : Cliquez sur "Inscription" dans le Header
3. **Déconnexion** : Menu utilisateur → "Se déconnecter"

## 🔐 Sécurité

- **JWT_SECRET** : Changez la valeur par défaut !
- **Mots de passe** : Minimum 6 caractères
- **Validation** : Côté client et serveur
- **Tokens** : Expiration après 7 jours

## 📝 Notes

- Les utilisateurs créés ont le rôle `customer` par défaut
- Les tokens sont stockés dans `localStorage`
- Le contexte Auth est disponible dans toute l'app
- Compatible avec le système de commentaires et retours

C'est prêt ! 🎉
