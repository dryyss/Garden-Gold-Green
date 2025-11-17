# 🔧 Solution : Problèmes Auth0 et Base de Données

## Problèmes identifiés

1. ❌ **Authentification Auth0 ne fonctionne pas**
2. ❌ **Produits non récupérés (base de données vide)**

---

## 🔐 Solution 1 : Corriger Auth0

### Étape 1 : Vérifier les variables d'environnement dans Clever Cloud

Assurez-vous que ces variables sont définies :

```
APP_BASE_URL=https://gardengoldgreen.com
AUTH0_BASE_URL=https://gardengoldgreen.com
NEXT_PUBLIC_APP_URL=https://gardengoldgreen.com
AUTH0_CLIENT_ID=votre_client_id
AUTH0_CLIENT_SECRET=votre_client_secret
AUTH0_SECRET=votre_secret
AUTH0_ISSUER_BASE_URL=https://dev-1tkaqeynik4yy714.us.auth0.com
```

### Étape 2 : Configurer Auth0 Dashboard

1. Allez sur https://manage.auth0.com/
2. **Applications** > "Garden Gold Green"
3. **Settings** > Scroll jusqu'à "Application URIs"

#### Allowed Callback URLs
```
https://gardengoldgreen.com/api/auth/callback,http://localhost:3000/api/auth/callback
```

#### Allowed Logout URLs
```
https://gardengoldgreen.com,http://localhost:3000
```

#### Allowed Web Origins
```
https://gardengoldgreen.com,http://localhost:3000
```

4. **SAVE CHANGES**

### Étape 3 : Vérifier la route Auth0

La route doit être : `/api/auth/[auth0]` (pas `/auth/callback`)

Vérifiez que le fichier existe : `src/app/api/auth/[auth0]/route.ts`

---

## 🗄️ Solution 2 : Corriger la Base de Données

### Étape 1 : Vérifier la connexion à la base de données

Dans Clever Cloud, vérifiez que `DATABASE_URL` ou `POSTGRESQL_ADDON_URI` est définie.

### Étape 2 : Exécuter les migrations Prisma

**Option A : Via Clever Cloud (recommandé)**

Les migrations sont automatiquement exécutées lors du déploiement via `scripts/start-production.js`.

**Option B : Manuellement (si nécessaire)**

Si les migrations ne s'exécutent pas automatiquement :

1. Connectez-vous à votre instance Clever Cloud via SSH
2. Exécutez :
```bash
cd /home/bas/app_ae805b7f-84c1-4812-ad56-d4a60f2360cc
npx prisma migrate deploy
```

### Étape 3 : Vérifier l'état de la base de données

**En local** (pour tester) :

```bash
# Installer tsx si nécessaire
npm install -g tsx

# Exécuter le script de diagnostic
npx tsx scripts/check-database.ts
```

Ce script va :
- ✅ Vérifier la connexion
- 📊 Afficher le nombre de produits, catégories, utilisateurs
- 📦 Afficher un aperçu des produits
- ⚙️ Vérifier la configuration

### Étape 4 : Créer des produits (si la DB est vide)

**Option A : Via l'interface admin**

1. Connectez-vous en tant qu'admin
2. Allez sur `/admin`
3. Créez des produits manuellement

**Option B : Via script de migration**

Si vous avez des données dans `src/data/products.json` :

```bash
npx tsx scripts/migrate-products-to-prisma.ts
```

**Option C : Créer des produits de test**

Créez un script `scripts/create-test-products.ts` :

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestProducts() {
  // Créer une catégorie
  const category = await prisma.category.upsert({
    where: { slug: 'huiles-cbd' },
    update: {},
    create: {
      name: 'Huiles CBD',
      slug: 'huiles-cbd',
    },
  })

  // Créer un produit
  const product = await prisma.product.create({
    data: {
      title: 'Huile CBD 10% Premium',
      slug: 'huile-cbd-10-premium',
      description: 'Huile CBD de qualité supérieure à 10% de concentration',
      priceCents: 4999, // 49.99€
      currency: 'EUR',
      cbdPercent: 10,
      stock: 100,
      images: JSON.stringify(['/logo.png']),
      published: true,
      categories: {
        connect: { id: category.id },
      },
    },
  })

  console.log('✅ Produit créé:', product.title)
}

createTestProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

---

## 🔍 Diagnostic

### Vérifier les logs Clever Cloud

1. Allez dans Clever Cloud > Votre app > **Logs**
2. Cherchez les erreurs :
   - `❌ Erreur lors de la récupération des produits`
   - `The table 'public.Product' does not exist`
   - `Callback URL mismatch`

### Tester l'API des produits

```bash
# Tester depuis votre machine
curl https://gardengoldgreen.com/api/products/all
```

Vous devriez recevoir :
```json
{
  "success": true,
  "products": [...]
}
```

Si vous recevez `{"products": []}`, la base de données est vide.

### Tester Auth0

1. Allez sur `https://gardengoldgreen.com`
2. Cliquez sur "Se connecter"
3. Vous devriez être redirigé vers Auth0
4. Après connexion, vous devriez être redirigé vers `/api/auth/callback` SANS erreur

---

## 📋 Checklist de résolution

### Auth0
- [ ] Variables d'environnement configurées dans Clever Cloud
- [ ] URLs de callback configurées dans Auth0 Dashboard (`/api/auth/callback`)
- [ ] Route `/api/auth/[auth0]/route.ts` existe
- [ ] Test de connexion réussi

### Base de Données
- [ ] `DATABASE_URL` ou `POSTGRESQL_ADDON_URI` configurée dans Clever Cloud
- [ ] Migrations Prisma exécutées (`npx prisma migrate deploy`)
- [ ] Tables créées (Product, Category, User, etc.)
- [ ] Produits créés dans la base de données
- [ ] API `/api/products/all` retourne des produits

---

## 🆘 Si le problème persiste

1. **Vérifiez les logs Clever Cloud** pour les erreurs exactes
2. **Exécutez le script de diagnostic** : `npx tsx scripts/check-database.ts`
3. **Vérifiez que les migrations ont été exécutées** :
   ```bash
   npx prisma migrate status
   ```
4. **Vérifiez la connexion à la base de données** :
   ```bash
   npx prisma db pull
   ```

---

## 📞 Support

Si vous avez besoin d'aide supplémentaire, partagez :
1. Les logs Clever Cloud (dernières 50 lignes)
2. Le résultat de `npx tsx scripts/check-database.ts`
3. Le résultat de `curl https://gardengoldgreen.com/api/products/all`

