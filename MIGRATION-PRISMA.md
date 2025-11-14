# 🚀 Guide de Migration vers Prisma PostgreSQL

Ce guide vous explique comment migrer toutes les données des fichiers JSON vers PostgreSQL via Prisma.

## 📋 Prérequis

1. **Base de données PostgreSQL configurée**
   - Avoir une base PostgreSQL accessible (locale ou distante)
   - Avoir la variable `DATABASE_URL` configurée dans `.env`

2. **Prisma configuré**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## 🔄 Étapes de Migration

### Étape 1 : Préparer la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer le schéma à la base de données
npx prisma db push
```

### Étape 2 : Exécuter les migrations

**Option A : Migration complète (recommandé)**
```bash
tsx scripts/migrate-all-to-prisma.ts
```

**Option B : Migrations individuelles**
```bash
# 1. Migrer les produits et catégories
tsx scripts/migrate-products-to-prisma.ts

# 2. Migrer les utilisateurs
tsx scripts/migrate-users-to-prisma.ts

# 3. Migrer les commandes
tsx scripts/migrate-orders-to-prisma.ts
```

### Étape 3 : Vérifier les données

```bash
# Ouvrir Prisma Studio pour visualiser les données
npx prisma studio
```

### Étape 4 : Modifier le code pour utiliser Prisma

1. **Remplacer `orders-store.ts`**
   ```typescript
   // Avant
   import { upsertOrder } from '@/lib/orders-store'
   
   // Après
   import { upsertOrder } from '@/lib/orders-store-prisma'
   ```

2. **Mettre à jour les imports dans les routes API**
   - `src/app/api/orders/route.ts`
   - `src/app/api/orders/track/route.ts`
   - Tous les autres fichiers utilisant `orders-store`

3. **Renommer le fichier**
   ```bash
   # Sauvegarder l'ancien
   mv src/lib/orders-store.ts src/lib/orders-store.json.backup
   
   # Utiliser la version Prisma
   mv src/lib/orders-store-prisma.ts src/lib/orders-store.ts
   ```

### Étape 5 : Tester

1. **Tester les routes API**
   ```bash
   npm run dev
   ```

2. **Vérifier que les commandes fonctionnent**
   - Créer une commande de test
   - Vérifier qu'elle est sauvegardée dans Prisma
   - Vérifier qu'elle est récupérée correctement

### Étape 6 : Nettoyer (optionnel)

Une fois que tout fonctionne :

1. **Retirer les fichiers JSON du dépôt Git**
   ```bash
   git rm --cached src/data/orders.json
   git rm --cached src/data/users.json
   git rm --cached src/data/products.json
   git commit -m "Migration Prisma: Retirer les fichiers JSON du dépôt"
   ```

2. **Supprimer les anciens fichiers de code (après vérification)**
   ```bash
   # Garder une sauvegarde d'abord
   rm src/lib/orders-store.json.backup
   ```

## ⚠️ Notes importantes

### Gestion des utilisateurs

- Les utilisateurs avec `auth0Id` seront liés automatiquement
- Les utilisateurs existants par email seront mis à jour avec leur `auth0Id`
- Les nouveaux utilisateurs seront créés avec le rôle `customer`

### Gestion des commandes

- Les commandes avec `userId` (auth0Id) seront liées à l'utilisateur Prisma correspondant
- Les commandes sans `userId` mais avec `customerEmail` seront conservées
- Les `OrderItem` seront créés automatiquement

### Gestion des produits

- Les catégories seront créées automatiquement
- Les variantes de produits seront créées
- Les images seront stockées en JSON string dans Prisma

## 🔍 Vérification

Après la migration, vérifiez :

1. **Nombre de produits**
   ```sql
   SELECT COUNT(*) FROM "Product";
   ```

2. **Nombre de commandes**
   ```sql
   SELECT COUNT(*) FROM "Order";
   ```

3. **Nombre d'utilisateurs**
   ```sql
   SELECT COUNT(*) FROM "User";
   ```

## 🐛 Résolution de problèmes

### Erreur de connexion à la base de données

Vérifiez que `DATABASE_URL` est correctement configuré :
```bash
echo $DATABASE_URL
```

### Erreur "Table does not exist"

Exécutez les migrations Prisma :
```bash
npx prisma db push
```

### Données dupliquées

Les scripts vérifient automatiquement les doublons et les ignorent. Si vous voulez forcer la migration :

1. Supprimez les données existantes dans Prisma Studio
2. Ré-exécutez les scripts de migration

## 📊 Statistiques après migration

Après la migration, vous devriez avoir :

- ✅ Tous les produits dans `Product`
- ✅ Toutes les catégories dans `Category`
- ✅ Tous les utilisateurs dans `User`
- ✅ Toutes les commandes dans `Order`
- ✅ Tous les items de commande dans `OrderItem`

## 🎯 Prochaines étapes

1. ✅ Migration des données terminée
2. ⏳ Modifier le code pour utiliser Prisma
3. ⏳ Tester toutes les fonctionnalités
4. ⏳ Déployer en production avec PostgreSQL

