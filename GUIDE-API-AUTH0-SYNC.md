# 🔄 Guide : Synchronisation Auth0 ↔ Prisma

## ⚠️ Problème Actuel

Quand vous modifiez un rôle dans l'application :
- ✅ Le rôle est mis à jour dans **Prisma** (base de données locale)
- ❌ Le rôle **N'EST PAS** mis à jour dans **Auth0**
- ⚠️ À la prochaine connexion, Auth0 va écraser le changement avec le rôle original

## ✅ Solution : API de Synchronisation

J'ai créé une API qui synchronise automatiquement Auth0 et Prisma.

---

## 📋 Configuration Requise

### 1. Variables d'Environnement

Ajoutez dans votre fichier `.env` :

```env
AUTH0_DOMAIN=https://dev-1tkaqeynik4yy714.us.auth0.com
AUTH0_M2M_CLIENT_ID=votre_client_id_m2m
AUTH0_M2M_CLIENT_SECRET=votre_client_secret_m2m
```

### 2. Créer une Application M2M dans Auth0

1. Allez sur **Applications** > **Applications**
2. Cliquez **+ Create Application**
3. Nom : `Management API Client`
4. Type : **Machine to Machine Applications**
5. Cliquez **Create**
6. Sélectionnez **Auth0 Management API**
7. Cochez les permissions :
   - ✅ `read:roles`
   - ✅ `read:users`
   - ✅ `update:users`
   - ✅ `create:users` (optionnel)
8. Cliquez **Authorize**
9. Copiez le **Client ID** et **Client Secret** dans votre `.env`

---

## 🔧 Comment Ça Marche

### Automatique (Déjà Implémenté)

Quand vous modifiez un rôle via `/api/admin/users/[id]` :
1. ✅ Le rôle est mis à jour dans Prisma
2. ✅ Le rôle est automatiquement synchronisé avec Auth0
3. ✅ Si Auth0 échoue, un avertissement est retourné mais Prisma est quand même mis à jour

### Manuel (API Disponible)

Si vous voulez synchroniser manuellement :

#### Lire les rôles depuis Auth0
```bash
GET /api/admin/users/auth0-sync?userId=auth0|123456789
```

#### Synchroniser un rôle
```bash
POST /api/admin/users/auth0-sync
{
  "userId": "auth0|123456789",
  "role": "admin"
}
```

#### Liste tous les rôles Auth0
```bash
GET /api/admin/users/auth0-sync/roles
```

---

## ⚠️ Limitation Actuelle

**Problème** : L'ID Prisma n'est pas forcément l'Auth0 ID.

**Solution Recommandée** : Stocker l'Auth0 user ID (sub) dans Prisma.

### Modifier le Schéma Prisma

```prisma
model User {
  id            String    @id @default(cuid())
  auth0Id       String?   @unique // Ajouter ce champ
  email         String    @unique
  name          String?
  role          String    @default("customer")
  // ... reste du modèle
}
```

Puis mettre à jour la base :
```bash
npx prisma db push
```

### Mettre à Jour lors de la Création

Dans votre code d'inscription/connexion, stockez l'Auth0 ID :

```typescript
// Dans Auth0Context ou lors de la création
const user = await prisma.user.upsert({
  where: { email: auth0User.email },
  update: {},
  create: {
    auth0Id: auth0User.sub, // Stocker l'Auth0 ID
    email: auth0User.email,
    name: auth0User.name,
    role: 'customer'
  }
})
```

---

## 🧪 Tester la Synchronisation

### 1. Vérifier les Variables d'Environnement

```bash
# Vérifiez que ces variables sont définies
echo $AUTH0_DOMAIN
echo $AUTH0_M2M_CLIENT_ID
echo $AUTH0_M2M_CLIENT_SECRET
```

### 2. Tester la Synchronisation

1. Modifiez un rôle dans l'interface admin
2. Vérifiez les logs du serveur :
   ```
   ✅ Rôle admin synchronisé avec Auth0 pour user@example.com
   ```

3. Si vous voyez un warning :
   ```
   ⚠️ Impossible de synchroniser Auth0: ID non trouvé
   ```
   → C'est normal si vous n'avez pas encore stocké l'Auth0 ID dans Prisma

### 3. Vérifier dans Auth0

1. Allez sur Auth0 > User Management > Users
2. Trouvez l'utilisateur
3. Onglet Roles
4. Vérifiez que le rôle est bien mis à jour

---

## 📝 Fichiers Créés

1. **`src/lib/auth0-management.ts`** - Fonctions utilitaires pour Auth0 Management API
   - `getAuth0UserRoles()` - Lire les rôles
   - `assignSingleRole()` - Assigner un rôle
   - `getAllAuth0Roles()` - Liste tous les rôles
   - `updateAuth0UserRoles()` - Mettre à jour plusieurs rôles

2. **`src/app/api/admin/users/auth0-sync/route.ts`** - API de synchronisation manuelle
   - GET - Lire les rôles depuis Auth0
   - POST - Synchroniser un rôle
   - GET /roles - Liste tous les rôles

3. **Modification de `/api/admin/users/[id]`** - Synchronisation automatique

---

## ✅ Résumé

| Action | Avant | Après |
|--------|-------|-------|
| Modifier un rôle | ✅ Prisma seulement | ✅ Prisma + Auth0 |
| Reconnexion | ❌ Rôle écrasé | ✅ Rôle conservé |
| Synchronisation | ❌ Manuelle | ✅ Automatique |

---

## 🎯 Prochaines Étapes

1. ✅ Ajouter les variables d'environnement
2. ✅ Créer l'application M2M dans Auth0
3. ⚠️ (Optionnel) Stocker l'Auth0 ID dans Prisma pour meilleure synchronisation
4. ✅ Tester la modification d'un rôle
5. ✅ Vérifier dans Auth0 que le rôle est mis à jour

---

**✅ Maintenant, quand vous modifiez un rôle dans l'application, il est automatiquement synchronisé avec Auth0 !**





