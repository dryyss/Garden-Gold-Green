# 👑 Rôles : Owner vs Admin

## 📋 Différences entre Owner et Admin

### 🔐 Rôle ADMIN (Administrateur)

**Ce que l'Admin peut faire :**
- ✅ Accéder au dashboard admin
- ✅ Voir toutes les commandes
- ✅ Gérer les produits (créer, modifier, supprimer)
- ✅ Gérer le stock
- ✅ Voir les statistiques
- ✅ Gérer les retours
- ✅ Gérer les catégories
- ✅ Voir la liste des clients
- ✅ Modifier les informations des clients

**Ce que l'Admin NE PEUT PAS faire :**
- ❌ Modifier le rôle d'un autre admin (sauf rétrograder en customer)
- ❌ Supprimer le dernier admin
- ❌ Créer un nouveau admin
- ❌ Créer ou modifier un owner
- ❌ Modifier son propre rôle
- ❌ Accéder aux paramètres système avancés

---

### 👑 Rôle OWNER (Propriétaire)

**Ce que l'Owner peut faire (TOUT ce que l'admin peut faire, PLUS) :**
- ✅ Tout ce que l'admin peut faire
- ✅ **Créer de nouveaux admins** (promouvoir des utilisateurs)
- ✅ **Modifier les rôles de n'importe quel utilisateur** (admin, owner, customer)
- ✅ **Supprimer des admins** (même le dernier, s'il y a au moins un owner)
- ✅ **Créer d'autres owners** (promouvoir des admins ou utilisateurs)
- ✅ **Rétrograder des admins en customer**
- ✅ **Modifier son propre rôle** (si au moins un autre owner existe)
- ✅ Gestion complète des permissions utilisateurs

**Règles de sécurité pour Owner :**
- ⚠️ Un owner ne peut pas supprimer le dernier admin s'il n'y a pas d'owner
- ⚠️ Un owner ne peut pas se rétrograder lui-même s'il est le dernier owner
- ⚠️ Il doit toujours y avoir au moins un owner OU un admin dans le système

---

## 🎯 Cas d'usage

### Scénario 1 : Créer un nouveau Admin
- **Admin** : ❌ Impossible
- **Owner** : ✅ Peut promouvoir un customer en admin via l'interface de gestion utilisateurs

### Scénario 2 : Supprimer un Admin
- **Admin** : ❌ Impossible (surtout si c'est le dernier)
- **Owner** : ✅ Peut rétrograder un admin en customer (sauf si c'est le dernier et qu'il n'y a pas d'owner)

### Scénario 3 : Modifier le rôle d'un autre Admin
- **Admin** : ❌ Impossible (protection contre la suppression du dernier admin)
- **Owner** : ✅ Peut modifier le rôle de n'importe quel admin

### Scénario 4 : Créer un Owner
- **Admin** : ❌ Impossible
- **Owner** : ✅ Peut promouvoir un admin ou customer en owner

---

## 🔧 Interface de l'Application

### Section Admin (visible pour Admin et Owner)
- Dashboard avec statistiques
- Gestion des commandes
- Gestion des produits
- Liste des clients (lecture seule pour admin)

### Section Owner (visible UNIQUEMENT pour Owner)
- **Gestion des Utilisateurs** : 
  - Liste complète des utilisateurs avec leurs rôles
  - Modifier les rôles (customer → admin → owner)
  - Créer des admins
  - Rétrograder des admins
  - Voir les statistiques par utilisateur

---

## 📝 Configuration Auth0

Pour attribuer le rôle "owner" :
1. Allez sur https://manage.auth0.com/
2. **User Management** > **Users** > Sélectionnez l'utilisateur
3. **Roles** > **Assign Roles**
4. Cochez le rôle `owner`
5. L'utilisateur doit se déconnecter et se reconnecter

---

## 🛡️ Sécurité

- Les vérifications de rôles sont effectuées côté serveur (API)
- Le frontend cache uniquement l'affichage, pas la sécurité
- Toutes les actions sensibles nécessitent une authentification serveur
- Les permissions sont vérifiées à chaque requête API






