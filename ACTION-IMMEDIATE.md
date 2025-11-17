# 🚀 Action Immédiate - Résoudre Auth0 et Base de Données

## ✅ Variables d'environnement vérifiées

Toutes vos variables sont correctement configurées dans Clever Cloud :
- ✅ Auth0 configuré
- ✅ PostgreSQL configuré avec `POSTGRESQL_ADDON_URI`

---

## 🔧 Étape 1 : Vérifier les migrations Prisma

Les migrations doivent s'exécuter automatiquement lors du déploiement. Vérifiez dans les logs Clever Cloud si vous voyez :

```
✅ Migrations Prisma appliquées avec succès
```

ou

```
✅ Schéma Prisma synchronisé avec succès
```

**Si vous voyez une erreur** comme :
```
The table `public.Product` does not exist
```

**Solution** : Les migrations n'ont pas été exécutées. Vous devez les exécuter manuellement.

---

## 🗄️ Étape 2 : Exécuter les migrations (si nécessaire)

### Option A : Via Clever Cloud Console

1. Allez dans Clever Cloud > Votre app > **Console**
2. Exécutez :
```bash
cd /home/bas/app_ae805b7f-84c1-4812-ad56-d4a60f2360cc
npx prisma db push --accept-data-loss
```

### Option B : Redéployer l'application

Le script `scripts/start-production.js` devrait automatiquement exécuter `prisma db push` si aucune migration n'existe.

**Redéployez** l'application dans Clever Cloud pour déclencher l'exécution automatique.

---

## 📦 Étape 3 : Créer des produits de test

Une fois les tables créées, créez des produits :

### Via Clever Cloud Console

1. Allez dans Clever Cloud > Votre app > **Console**
2. Exécutez :
```bash
cd /home/bas/app_ae805b7f-84c1-4812-ad56-d4a60f2360cc
npx tsx scripts/create-test-products.ts
```

Cela va créer :
- 3 catégories (Huiles CBD, Fleurs CBD, Cosmétiques CBD)
- 5 produits de test

### Via l'interface admin (alternative)

1. Connectez-vous en tant qu'admin
2. Allez sur `/admin`
3. Créez des produits manuellement

---

## 🔐 Étape 4 : Vérifier Auth0 Dashboard

**IMPORTANT** : Même si les variables sont correctes, vous devez vérifier Auth0 Dashboard :

1. Allez sur https://manage.auth0.com/
2. **Applications** > "Garden Gold Green"
3. **Settings** > Scroll jusqu'à "Application URIs"

### Allowed Callback URLs
```
https://gardengoldgreen.com/api/auth/callback,http://localhost:3000/api/auth/callback
```

⚠️ **Vérifiez qu'il n'y a PAS** :
- `/auth/callback` (sans `/api`)
- Virgule à la fin
- Espaces après les virgules

### Allowed Logout URLs
```
https://gardengoldgreen.com,http://localhost:3000
```

### Allowed Web Origins
```
https://gardengoldgreen.com,http://localhost:3000
```

4. **SAVE CHANGES**

---

## ✅ Étape 5 : Vérifier que tout fonctionne

### Test 1 : Vérifier les produits

Ouvrez dans votre navigateur :
```
https://gardengoldgreen.com/api/products/all
```

Vous devriez voir :
```json
{
  "success": true,
  "products": [...]
}
```

Si vous voyez `{"products": []}`, la base de données est vide → Exécutez `create-test-products.ts`

### Test 2 : Vérifier Auth0

1. Allez sur `https://gardengoldgreen.com`
2. Cliquez sur "Se connecter"
3. Vous devriez être redirigé vers Auth0
4. Après connexion, vous devriez être redirigé vers `/api/auth/callback` **SANS erreur**

Si vous voyez "Callback URL mismatch" → Vérifiez Auth0 Dashboard (Étape 4)

---

## 🔍 Diagnostic avancé

### Vérifier l'état de la base de données

Dans Clever Cloud Console :
```bash
cd /home/bas/app_ae805b7f-84c1-4812-ad56-d4a60f2360cc
npx tsx scripts/check-database.ts
```

Ce script va afficher :
- ✅ Connexion à la base de données
- 📊 Nombre de produits, catégories, utilisateurs
- 📦 Aperçu des produits

### Vérifier les logs Clever Cloud

Allez dans Clever Cloud > Votre app > **Logs** et cherchez :
- ❌ Erreurs Prisma
- ❌ Erreurs Auth0
- ✅ Messages de succès

---

## 📋 Checklist rapide

- [ ] Variables d'environnement configurées dans Clever Cloud ✅ (déjà fait)
- [ ] Migrations Prisma exécutées (vérifier les logs)
- [ ] Tables créées dans la base de données
- [ ] Produits créés (via script ou interface admin)
- [ ] Auth0 Dashboard configuré avec `/api/auth/callback`
- [ ] Test de connexion Auth0 réussi
- [ ] Test de récupération des produits réussi

---

## 🆘 Si ça ne fonctionne toujours pas

Partagez :
1. Les **dernières 50 lignes** des logs Clever Cloud
2. Le résultat de `npx tsx scripts/check-database.ts`
3. Le résultat de `curl https://gardengoldgreen.com/api/products/all`
4. Une capture d'écran de l'erreur Auth0 (si applicable)

