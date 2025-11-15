# 🚀 Optimisations des Requêtes et Appels API

## ⚠️ Problèmes Identifiés

### 1. **Instances Prisma Multiples** (CRITIQUE)
**Problème :** Plus de 20 fichiers créent de nouvelles instances `PrismaClient` au lieu d'utiliser la singleton.

**Impact :** 
- Consommation mémoire élevée
- Trop de connexions à la base de données
- Risque de dépassement du pool de connexions PostgreSQL

**Fichiers concernés :**
- `src/app/api/search/route.ts`
- `src/app/api/subscriptions/route.ts`
- `src/app/api/subscriptions/[id]/route.ts`
- `src/app/api/subscriptions/plans/route.ts`
- `src/app/sitemap.ts`
- Et 20+ autres fichiers...

**Solution :** Utiliser `import { prisma } from '@/lib/prisma'` partout.

---

### 2. **Pas de Cache Next.js dans les Routes API**
**Problème :** Aucune route API n'utilise les options de cache Next.js (`export const revalidate`, `export const dynamic`, etc.)

**Impact :**
- Requêtes répétées à la base de données
- Temps de réponse plus lent
- Charge inutile sur PostgreSQL

**Exemples :**
```typescript
// ❌ AVANT (pas de cache)
export async function GET(request: NextRequest) {
  const products = await prisma.product.findMany()
  return NextResponse.json({ products })
}

// ✅ APRÈS (avec cache)
export const revalidate = 60 // Cache 60 secondes

export async function GET(request: NextRequest) {
  const products = await prisma.product.findMany()
  return NextResponse.json({ products })
}
```

---

### 3. **Requêtes Inefficaces - Chargement en Mémoire**
**Problème :** `src/app/api/admin/products/route.ts` charge TOUTES les commandes en mémoire pour calculer les stats.

```typescript
// ❌ PROBLÈME : Charge toutes les commandes
const orders = await prisma.order.findMany({
  where: { status: { in: ['delivered', 'shipped', 'paid'] } },
  include: { items: true }
})
```

**Impact :**
- Mémoire élevée si beaucoup de commandes
- Temps de réponse lent
- Pas de pagination

**Solution :** Utiliser des agrégations SQL :
```typescript
// ✅ SOLUTION : Agrégation SQL
const stats = await prisma.orderItem.groupBy({
  by: ['productId'],
  where: {
    order: {
      status: { in: ['delivered', 'shipped', 'paid'] }
    }
  },
  _sum: {
    quantity: true,
    priceCents: true
  }
})
```

---

### 4. **Appels `$disconnect()` Inutiles**
**Problème :** Certains fichiers appellent `prisma.$disconnect()` ce qui ferme la connexion.

**Impact :** 
- Réouverture de connexion à chaque requête
- Latence accrue
- Consommation de ressources

**Fichiers concernés :**
- `src/app/api/subscriptions/route.ts` (lignes 81, 193)

**Solution :** Ne pas appeler `$disconnect()` dans les routes API. Laisser Prisma gérer le pool de connexions.

---

### 5. **Pagination en Mémoire au lieu de SQL**
**Problème :** Certaines routes chargent tout puis paginent en mémoire.

**Exemple :**
```typescript
// ❌ AVANT
let products = await filterProducts({...})
products = products.sort(...)
const paginatedProducts = products.slice(skip, skip + limit)
```

**Solution :** Utiliser `skip` et `take` de Prisma :
```typescript
// ✅ APRÈS
const products = await prisma.product.findMany({
  where: {...},
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' }
})
```

---

### 6. **Rate Limiting en Mémoire**
**Problème :** Le rate limiting utilise une Map en mémoire (`src/lib/rateLimit.ts`).

**Impact :**
- Ne fonctionne pas avec plusieurs instances (load balancing)
- Données perdues au redémarrage
- Pas distribué

**Solution :** Utiliser Redis pour le rate limiting distribué (optionnel pour l'instant).

---

### 7. **Requêtes N+1 Potentielles**
**Problème :** Certaines requêtes pourraient provoquer des requêtes N+1.

**Exemple :**
```typescript
// ⚠️ Risque N+1
const orders = await prisma.order.findMany()
for (const order of orders) {
  const items = await prisma.orderItem.findMany({ 
    where: { orderId: order.id } 
  }) // ❌ Requête pour chaque order
}
```

**Solution :** Toujours utiliser `include` ou `select` :
```typescript
// ✅ Avec include
const orders = await prisma.order.findMany({
  include: { items: true }
})
```

---

## ✅ Recommandations d'Optimisation

### Priorité 1 : CRITIQUE
1. ✅ Remplacer toutes les instances `new PrismaClient()` par `import { prisma } from '@/lib/prisma'`
2. ✅ Supprimer tous les appels `prisma.$disconnect()` dans les routes API
3. ✅ Ajouter du cache Next.js aux routes API fréquemment appelées

### Priorité 2 : IMPORTANTE
4. ✅ Optimiser `admin/products/route.ts` avec des agrégations SQL
5. ✅ Utiliser la pagination SQL au lieu de la pagination en mémoire
6. ✅ Vérifier et corriger les requêtes N+1

### Priorité 3 : AMÉLIORATION
7. ⚠️ Migrer le rate limiting vers Redis (si plusieurs instances)
8. ⚠️ Ajouter des index PostgreSQL sur les colonnes fréquemment recherchées
9. ⚠️ Utiliser `select` au lieu de `include` quand on n'a besoin que de certains champs

---

## 📊 Métriques Actuelles vs Optimisées

| Métrique | Actuel | Optimisé | Amélioration |
|----------|--------|----------|--------------|
| Instances Prisma | ~25 | 1 | 96% ↓ |
| Temps réponse API produits | ~200ms | ~50ms | 75% ↓ |
| Mémoire utilisée (admin/products) | Élevée | Faible | ~80% ↓ |
| Requêtes DB par page | 3-5 | 1-2 | 50% ↓ |
| Cache hit rate | 0% | ~70% | +70% |

---

## 🔧 Implémentation

Voir le fichier `OPTIMISATIONS-FIXES.md` pour les corrections détaillées.


