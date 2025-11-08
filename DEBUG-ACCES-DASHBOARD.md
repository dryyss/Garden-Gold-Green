# 🔍 Debug : Accès au Dashboard Admin

## 🎯 Problème
L'utilisateur a les rôles "Admin" et "Owner" dans Auth0 mais n'a pas accès au dashboard.

## ✅ Checklist de Diagnostic

### 1. Vérifier les Logs dans la Console du Navigateur

Ouvrez la console (F12) et regardez les logs :

```
🔍 Auth0 User: {...}
🔍 Roles claim: [...]
🔍 All claims: [...]
🔍 Roles array: [...]
🔍 Roles length: ...
🔍 Roles types: [...]
🔍 isOwnerUser: true/false
🔍 isAdminUser: true/false
🔍 Final role: ...
```

**Questions à vérifier** :
- ✅ `Roles claim` contient-il `["Admin", "Owner"]` ou `["admin", "owner"]` ?
- ✅ `isOwnerUser` est-il `true` ?
- ✅ `isAdminUser` est-il `true` ?
- ✅ `Final role` est-il `"owner"` ou `"admin"` ?

### 2. Vérifier l'Action Auth0 "Add Roles to Token"

**CRITIQUE** : Les rôles doivent être dans le token pour être accessibles dans l'application.

1. **Auth0 Dashboard** > **Actions** > **Triggers** > **Login** > **post-login**
2. Vérifiez qu'il y a une action **"Add Roles to Token"**
3. Si elle n'existe pas, créez-la avec ce code :

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://gardengoldgreen.com';
  
  if (event.authorization && event.authorization.roles) {
    api.idToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
    api.accessToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
    console.log('✅ Rôles ajoutés au token:', event.authorization.roles);
  } else {
    // Si pas de rôles dans event.authorization, ajouter un tableau vide
    api.idToken.setCustomClaim(namespace + '/roles', []);
    api.accessToken.setCustomClaim(namespace + '/roles', []);
    console.log('⚠️ Aucun rôle trouvé, tableau vide ajouté');
  }
};
```

4. **IMPORTANT** : Cette action doit être **DÉPLOYÉE** et **ATTACHÉE** au trigger post-login

### 3. Vérifier l'Ordre des Actions

Dans **Actions** > **Triggers** > **Login** > **post-login**, l'ordre doit être :

```
Start
  ↓
[Add Default User Role]  ← 1er (si assignation automatique)
  ↓
[Add Roles to Token]     ← 2ème (AJOUTER LES RÔLES AU TOKEN)
  ↓
Complete
```

### 4. Se Déconnecter et Reconnecter

**IMPORTANT** : Après avoir configuré l'action "Add Roles to Token" :

1. **Déconnectez-vous complètement** du site
2. **Fermez le navigateur** (ou videz le cache : Ctrl+Shift+Delete)
3. **Reconnectez-vous** avec votre utilisateur
4. **Ouvrez la console** (F12) et vérifiez les logs

### 5. Vérifier dans Auth0

1. **User Management** > **Users** > [Votre utilisateur]
2. Onglet **Roles**
3. Vérifiez que les rôles **"Admin"** et **"Owner"** sont bien assignés

## 🔧 Solutions Possibles

### Solution 1 : Action "Add Roles to Token" Manquante

Si l'action n'existe pas ou n'est pas attachée, créez-la (voir ci-dessus).

### Solution 2 : Token Non Rafraîchi

Déconnectez-vous complètement et reconnectez-vous pour obtenir un nouveau token avec les rôles.

### Solution 3 : Rôles Non Capitalisés Correctement

Le code détecte les rôles en minuscules (`owner`, `admin`), mais Auth0 peut renvoyer `Owner`, `Admin`. 

**Solution** : Le code utilise déjà `.toLowerCase()`, donc ça devrait fonctionner. Mais vérifiez les logs pour voir ce qui est reçu.

### Solution 4 : Namespace Incorrect

Vérifiez que le namespace dans l'action "Add Roles to Token" est bien :
```javascript
const namespace = 'https://gardengoldgreen.com';
```

Et que dans le code, on lit :
```javascript
auth0User['https://gardengoldgreen.com/roles']
```

## 🧪 Test Rapide

1. Ouvrez la console du navigateur (F12)
2. Connectez-vous avec votre utilisateur
3. Regardez les logs `🔍`
4. Dites-moi ce que vous voyez pour :
   - `Roles claim:`
   - `isOwnerUser:`
   - `isAdminUser:`
   - `Final role:`

## 📋 Résumé

Le problème est probablement que :
- ❌ L'action "Add Roles to Token" n'est pas configurée
- ❌ Le token n'a pas été rafraîchi après l'assignation des rôles
- ❌ Les rôles ne sont pas dans le bon format

 Partagez les logs de la console et je vous aiderai à résoudre le problème ! 🚀






