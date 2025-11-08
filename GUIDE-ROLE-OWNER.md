# 👑 Guide Complet : Gérer le Rôle Owner

## 📋 Étape 1 : Créer le Rôle "owner" dans Auth0

### 1.1 Accéder à Auth0
1. Allez sur **https://manage.auth0.com/**
2. Connectez-vous avec votre compte

### 1.2 Créer le Rôle
1. Dans le menu de gauche, cliquez sur **User Management** > **Roles**
2. Cliquez sur le bouton **+ Create Role** (en haut à droite)
3. Remplissez le formulaire :
   - **Name** : `owner`
   - **Description** : `Propriétaire - Accès complet à toutes les fonctionnalités, y compris la gestion des utilisateurs`
4. Cliquez sur **Create**

✅ **Vous devriez maintenant avoir 3 rôles** : `customer`, `admin`, et `owner`

---

## 📋 Étape 2 : Assigner le Rôle "owner" à un Utilisateur

### 2.1 Trouver l'Utilisateur
1. Dans Auth0, menu gauche > **User Management** > **Users**
2. Recherchez l'utilisateur à qui vous voulez donner le rôle owner
3. Cliquez sur l'utilisateur pour ouvrir son profil

### 2.2 Assigner le Rôle
1. Dans le profil utilisateur, cliquez sur l'onglet **Roles** (en haut)
2. Cliquez sur le bouton **Assign Roles** (ou **+ Assign Roles**)
3. Dans la liste des rôles disponibles, **cochez** `owner`
   - Vous pouvez aussi cocher `admin` et `customer` si nécessaire (mais `owner` suffit)
4. Cliquez sur **Assign**

✅ **L'utilisateur a maintenant le rôle owner**

---

## 📋 Étape 3 : Vérifier que l'Action Auth0 est Configurée

### 3.1 Vérifier l'Action "Add Roles to Token"
1. Menu gauche > **Actions** > **Triggers**
2. Cliquez sur **Login** puis **post-login**
3. Vérifiez que l'action **"Add Roles to Token"** est présente et déployée

### 3.2 Code de l'Action (si elle n'existe pas)
Si l'action n'existe pas, créez-la avec ce code :

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://gardengoldgreen.com';
  
  if (event.authorization) {
    api.idToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
    api.accessToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
  }
};
```

**IMPORTANT** : Cette action doit être **déployée** et **ajoutée au trigger post-login**

---

## 📋 Étape 4 : Se Reconnecter dans l'Application

### 4.1 Déconnexion
1. Dans l'application, **déconnectez-vous complètement**
2. Fermez le navigateur ou videz le cache (Ctrl+Shift+Delete)

### 4.2 Reconnexion
1. Reconnectez-vous avec l'utilisateur qui a le rôle owner
2. Ouvrez la console du navigateur (F12)
3. Cherchez les logs 🔍

### 4.3 Vérifier les Logs
Vous devriez voir dans la console :
```
🔍 Auth0 User: {...}
🔍 Roles claim: ["owner"]
🔍 Final role: owner
```

Si vous voyez `["owner", "admin"]` ou plusieurs rôles, c'est normal. Le système prendra le rôle le plus élevé (owner > admin > customer).

---

## 📋 Étape 5 : Accéder au Dashboard Admin

### 5.1 Vérifier le Lien Admin
1. Une fois connecté, vous devriez voir le lien **"Admin"** dans le menu utilisateur (icône profil en haut à droite)
2. Cliquez dessus pour accéder au dashboard

### 5.2 Vérifier l'Onglet Owner
1. Dans le dashboard admin (`/admin`), regardez les onglets en haut
2. Vous devriez voir un onglet **"Gestion Utilisateurs"** avec une icône 👑 (couronne)
3. Cet onglet est **visible uniquement pour les owners**

---

## 📋 Étape 6 : Utiliser l'Interface de Gestion Utilisateurs

### 6.1 Ouvrir l'Onglet
1. Cliquez sur l'onglet **"Gestion Utilisateurs"**
2. Vous verrez une boîte d'information expliquant vos permissions owner

### 6.2 Rechercher un Utilisateur
1. Dans le champ de recherche, tapez l'email ou le nom d'un utilisateur
2. Appuyez sur **Entrée**
3. La liste des utilisateurs correspondants s'affichera

### 6.3 Modifier un Rôle
1. Dans la liste des utilisateurs, trouvez celui que vous voulez modifier
2. Dans la colonne **"Actions"**, vous verrez un menu déroulant avec les rôles :
   - Customer
   - Admin
   - Owner
3. Sélectionnez le nouveau rôle
4. Une confirmation apparaîtra si la modification réussit

### 6.4 Exemples d'Actions

**Créer un Admin :**
- Recherchez un utilisateur avec le rôle "customer"
- Changez son rôle en "admin" dans le menu déroulant
- ✅ L'utilisateur devient admin immédiatement

**Créer un Owner :**
- Recherchez un utilisateur (customer ou admin)
- Changez son rôle en "owner"
- ✅ L'utilisateur devient owner (vous devez être owner pour faire ça)

**Rétrograder un Admin :**
- Recherchez un admin
- Changez son rôle en "customer"
- ⚠️ Attention : Vous ne pouvez pas supprimer le dernier admin s'il n'y a pas d'owner

---

## 📋 Étape 7 : Gérer les Rôles depuis l'Application (Sans Auth0)

### 7.1 Avantages
- Plus besoin d'aller dans Auth0 pour modifier les rôles
- Interface simple et intuitive
- Modifications instantanées
- Protection contre les erreurs (ne peut pas supprimer le dernier admin)

### 7.2 Limitations de Sécurité
- Seul un owner peut créer/modifier un owner
- Impossible de supprimer le dernier admin s'il n'y a pas d'owner
- Impossible de se rétrograder soi-même si on est le dernier owner

---

## 🔧 Dépannage

### Problème : Le rôle owner n'apparaît pas dans l'application

**Solutions :**
1. Vérifiez dans Auth0 que le rôle est bien assigné :
   - User Management > Users > [Votre utilisateur] > Roles
   - Le rôle "owner" doit être coché

2. Vérifiez que l'action "Add Roles to Token" est déployée :
   - Actions > Triggers > Login > post-login
   - L'action doit être présente et déployée (bouton vert)

3. Déconnectez-vous complètement et reconnectez-vous

4. Videz le cache du navigateur (Ctrl+Shift+Delete)

5. Vérifiez les logs dans la console (F12)

### Problème : L'onglet "Gestion Utilisateurs" n'apparaît pas

**Solutions :**
1. Vérifiez que vous êtes bien connecté avec un compte owner
2. Vérifiez les logs dans la console : `🔍 Final role: owner`
3. Rafraîchissez la page (F5)

### Problème : Impossible de modifier un rôle

**Solutions :**
1. Vérifiez que vous êtes bien owner (pas juste admin)
2. Vérifiez que vous n'essayez pas de supprimer le dernier admin
3. Vérifiez les messages d'erreur dans l'alerte

---

## 📝 Résumé des Actions

### Dans Auth0 :
1. ✅ Créer le rôle "owner"
2. ✅ Assigner le rôle à un utilisateur
3. ✅ Vérifier que l'action "Add Roles to Token" est active

### Dans l'Application :
1. ✅ Se reconnecter pour charger le nouveau rôle
2. ✅ Accéder au dashboard admin
3. ✅ Utiliser l'onglet "Gestion Utilisateurs" pour :
   - Créer des admins
   - Créer des owners
   - Modifier les rôles
   - Rétrograder des admins

---

## 🎯 Checklist Rapide

- [ ] Rôle "owner" créé dans Auth0
- [ ] Rôle assigné à un utilisateur
- [ ] Action "Add Roles to Token" déployée
- [ ] Déconnexion/Reconnexion effectuée
- [ ] Logs montrent "Final role: owner"
- [ ] Onglet "Gestion Utilisateurs" visible dans /admin
- [ ] Test de modification de rôle réussi

---

**✅ Une fois tout configuré, vous pouvez gérer tous les rôles directement depuis l'application sans retourner dans Auth0 !**






