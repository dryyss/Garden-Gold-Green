# ⚠️ PROBLÈMES DE SÉCURITÉ ET SYNCHRONISATION - Fichiers JSON

## 🚨 PROBLÈMES CRITIQUES IDENTIFIÉS

### 1. **SÉCURITÉ - Données sensibles dans le code source**

Les fichiers `orders.json`, `users.json` et `products.json` contiennent des données sensibles :

- ❌ **orders.json** : 
  - Emails clients
  - Adresses de livraison
  - Numéros de téléphone
  - Informations de paiement (Stripe session IDs)
  - Données personnelles (RGPD)

- ❌ **users.json** :
  - Emails utilisateurs
  - IDs Stripe clients
  - Informations personnelles

- ⚠️ **products.json** :
  - Moins critique mais contient des données métier

**RISQUE** : Ces fichiers sont dans le dépôt Git et peuvent être exposés publiquement.

### 2. **SYNCHRONISATION - Double système de stockage**

Votre projet utilise **DEUX systèmes en parallèle** :

1. **Fichiers JSON** (`orders-store.ts`, `users-store.ts`, `products-store.ts`)
2. **Prisma/PostgreSQL** (routes `/api/orders/express`, routes admin, etc.)

**PROBLÈMES** :
- ❌ Les données sont **dupliquées** et peuvent se **désynchroniser**
- ❌ Une commande peut être dans Prisma mais pas dans `orders.json` (ou vice versa)
- ❌ Les statistiques peuvent être **incorrectes**
- ❌ Risque de **perte de données**

### 3. **PRODUCTION - Fichiers ne persistent pas**

En production (IONOS, Vercel, etc.) :

- ❌ Les fichiers JSON sont **écrasés à chaque déploiement**
- ❌ Les données sont **perdues** entre les redéploiements
- ❌ Chaque instance du serveur a son **propre fichier** (pas de partage)
- ❌ Les mises à jour ne se **synchronisent pas** entre instances

### 4. **CONCURRENCE - Race conditions**

- ❌ Plusieurs requêtes simultanées peuvent **écraser** les données
- ❌ Risque de **perte de commandes** si deux commandes sont créées en même temps
- ❌ Pas de **verrouillage** des fichiers

### 5. **PERFORMANCE**

- ❌ Lecture/écriture de fichiers entiers à chaque opération
- ❌ Pas d'indexation
- ❌ Pas de requêtes optimisées
- ❌ Lent avec beaucoup de données

## ✅ SOLUTION RECOMMANDÉE

### Migrer vers Prisma/PostgreSQL uniquement

**AVANTAGES** :
- ✅ **Sécurité** : Données dans une base de données sécurisée
- ✅ **Persistance** : Données conservées entre déploiements
- ✅ **Synchronisation** : Une seule source de vérité
- ✅ **Performance** : Indexation, requêtes optimisées
- ✅ **Concurrence** : Gestion automatique par la base de données
- ✅ **Scalabilité** : Supporte plusieurs instances

### Plan de migration

1. **Étape 1** : Vérifier que Prisma est bien configuré
   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **Étape 2** : Migrer les données existantes
   - Créer un script pour importer `orders.json` dans Prisma
   - Créer un script pour importer `products.json` dans Prisma
   - Créer un script pour importer `users.json` dans Prisma

3. **Étape 3** : Modifier les routes API
   - Remplacer `orders-store.ts` par des appels Prisma
   - Remplacer `products-store.ts` par des appels Prisma
   - Remplacer `users-store.ts` par des appels Prisma

4. **Étape 4** : Supprimer les fichiers JSON
   - Ajouter `*.json` dans `.gitignore` (sauf `package.json`, etc.)
   - Supprimer les fichiers de données JSON
   - Supprimer les imports de fichiers JSON

## 🔒 ACTIONS IMMÉDIATES (URGENT)

### 1. Ajouter les fichiers JSON au .gitignore

```gitignore
# Données sensibles - NE PAS COMMITER
src/data/orders.json
src/data/users.json
src/data/products.json
```

### 2. Ne pas commiter les données sensibles

Si les fichiers sont déjà dans Git :
```bash
# Retirer du suivi Git (mais garder localement)
git rm --cached src/data/orders.json
git rm --cached src/data/users.json
git rm --cached src/data/products.json

# Ajouter au .gitignore
echo "src/data/orders.json" >> .gitignore
echo "src/data/users.json" >> .gitignore
echo "src/data/products.json" >> .gitignore

git commit -m "Sécurité: Retirer les fichiers de données sensibles du dépôt"
```

### 3. Utiliser uniquement Prisma en production

Pour le déploiement, **assurez-vous** que :
- ✅ `DATABASE_URL` est configuré avec une base PostgreSQL
- ✅ Les routes utilisent Prisma, pas les fichiers JSON
- ✅ Les fichiers JSON ne sont utilisés que pour le développement local

## 📊 ÉTAT ACTUEL DU CODE

### Routes utilisant les fichiers JSON :
- `/api/orders` (GET, POST) → `orders-store.ts`
- `/api/orders/track` → `orders-store.ts`
- Pages produits → `products-store.ts`

### Routes utilisant Prisma :
- `/api/orders/express` → Prisma
- `/api/admin/*` → Prisma
- `/api/auth/*` → Prisma
- `/api/products/[productId]/comments` → Prisma

## ⚠️ RISQUE EN PRODUCTION

**Si vous déployez maintenant avec les fichiers JSON** :

1. ❌ Les commandes seront **perdues** à chaque redéploiement
2. ❌ Les données utilisateurs seront **perdues**
3. ❌ Les mises à jour de stock ne seront **pas synchronisées**
4. ❌ Risque de **violation RGPD** (données personnelles exposées)

## 🎯 RECOMMANDATION FINALE

**NE PAS DÉPLOYER** tant que la migration vers Prisma n'est pas complète.

**PRIORITÉ** : Migrer toutes les routes vers Prisma avant le déploiement en production.

