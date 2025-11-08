# 🔧 Dépannage : Rôle Non Assigné

## 🎯 Problème
L'utilisateur se connecte mais n'a toujours aucun rôle assigné.

---

## ✅ Checklist de Vérification

### 1. L'Action est-elle Déployée ?

**Vérifier** :
- **Actions** > **Library** > [Votre Action]
- Le statut doit être **"Deployed"** (pas "Draft")
- Si ce n'est pas déployé, cliquez sur **"Deploy"**

### 2. L'Action est-elle Attachée au Trigger ?

**Vérifier** :
- **Actions** > **Triggers** > **Login** > **post-login**
- Votre action **"Assign Default Role on Login"** doit être dans la liste
- Elle doit être **activée** (pas grisée)
- Si elle n'est pas là, cliquez sur **"+ Add"** et ajoutez-la

### 3. Les Secrets sont-ils Configurés ?

**Vérifier** :
- **Actions** > **Library** > [Votre Action] > **Secrets**
- Vous devez avoir :
  - ✅ `domain` : `dev-1tkaqeynik4yy714.us.auth0.com` (sans https://)
  - ✅ `clientId` : ID de votre application M2M
  - ✅ `clientSecret` : Secret de votre application M2M
  - ✅ `defaultRoleID` : ID du rôle (commence par `rol_`)

**⚠️ Important** : Le `defaultRoleID` doit être l'**ID** du rôle (ex: `rol_xxxxxxxxxxxxx`), pas le **nom** du rôle !

Pour trouver l'ID du rôle :
- **User Management** > **Roles**
- Cliquez sur le rôle (ex: "customer")
- L'ID est dans l'URL ou visible dans les détails du rôle

### 4. L'Application M2M Existe-t-elle ?

**Vérifier** :
- **Applications** > Cherchez une application de type **"Machine to Machine"**
- Nom : `Role Assigner` (ou similaire)
- Si elle n'existe pas, créez-la :
  1. **Applications** > **Create Application**
  2. Type : **Machine to Machine Applications**
  3. Nom : `Role Assigner`
  4. API : **Auth0 Management API**
  5. Permissions : `read:roles` + `update:users`

### 5. Les Permissions de l'Application M2M sont-elles Actives ?

**Vérifier** :
- **Applications** > [Votre Application M2M] > **APIs** > **Auth0 Management API**
- Les permissions doivent être **activées** (toggle ON) :
  - ✅ `read:roles`
  - ✅ `update:users`

### 6. Y a-t-il des Erreurs dans les Logs ?

**Vérifier** :
- **Actions** > **Logs**
- Cliquez sur la dernière connexion
- Regardez les logs pour voir les erreurs

**Erreurs courantes** :
- `❌ Erreur fetch pour obtenir le token` → Vérifiez les secrets `clientId` et `clientSecret`
- `❌ Erreur lors de l'assignation du rôle (status: 403)` → L'application M2M n'a pas la permission `update:users`
- `❌ Erreur lors de l'assignation du rôle (status: 404)` → Le `defaultRoleID` est incorrect
- `❌ Aucun token d'accès reçu` → Vérifiez les secrets `clientId` et `clientSecret`

---

## 🔍 Vérification Pas à Pas

### Étape 1 : Vérifier les Logs

1. **Actions** > **Logs**
2. Trouvez la dernière connexion de votre utilisateur
3. Cliquez dessus pour voir les détails

**Que chercher** :
- ✅ Si vous voyez `✅ Rôle par défaut assigné avec succès` → Ça fonctionne !
- ❌ Si vous voyez des erreurs → Notez le message d'erreur

### Étape 2 : Vérifier l'Ordre des Actions

1. **Actions** > **Triggers** > **Login** > **post-login**
2. L'ordre doit être :
   ```
   [Assign Default Role on Login]  ← 1er
   [Add Roles to Token]           ← 2ème
   ```

### Étape 3 : Tester avec un Nouvel Utilisateur

1. Créez un **nouvel utilisateur** dans Auth0
2. **Assurez-vous** qu'il n'a **aucun rôle**
3. **Connectez-vous** avec cet utilisateur
4. **Vérifiez** immédiatement dans Auth0 > Users > [Utilisateur] > Roles

---

## 🛠️ Solutions aux Problèmes Courants

### Problème : "Erreur fetch pour obtenir le token"

**Solution** :
1. Vérifiez que `clientId` et `clientSecret` sont corrects
2. Vérifiez que l'application M2M existe et est active
3. Vérifiez que l'application M2M est autorisée sur l'Auth0 Management API

### Problème : "Erreur lors de l'assignation du rôle (status: 403)"

**Solution** :
1. **Applications** > [Votre Application M2M] > **APIs** > **Auth0 Management API**
2. Activez la permission `update:users` (toggle ON)
3. Sauvegardez

### Problème : "Erreur lors de l'assignation du rôle (status: 404)"

**Solution** :
1. Vérifiez que le `defaultRoleID` est correct
2. Il doit commencer par `rol_`
3. Allez dans **User Management** > **Roles** > [Votre rôle] pour trouver l'ID exact

### Problème : L'Action ne s'Exécute Pas

**Solution** :
1. Vérifiez que l'action est **déployée** (pas en brouillon)
2. Vérifiez que l'action est **attachée** au trigger post-login
3. Vérifiez que l'action est **activée** dans le trigger

---

## 📋 Code de Test avec Plus de Logs

Si vous voulez plus d'informations, voici une version avec plus de logs :

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const currentRoles = event.authorization?.roles || [];
  
  console.log('🔍 DEBUG - Début de l\'action');
  console.log('🔍 DEBUG - User ID:', event.user.user_id);
  console.log('🔍 DEBUG - User Email:', event.user.email);
  console.log('🔍 DEBUG - Roles actuels:', currentRoles);
  console.log('🔍 DEBUG - Secrets disponibles:', Object.keys(event.secrets || {}));
  
  if (currentRoles.length === 0) {
    console.log('ℹ️ Utilisateur sans rôles détecté:', event.user.email);
    
    // Vérifier que les secrets sont présents
    if (!event.secrets.domain) {
      console.error('❌ Secret "domain" manquant !');
      return;
    }
    if (!event.secrets.clientId) {
      console.error('❌ Secret "clientId" manquant !');
      return;
    }
    if (!event.secrets.clientSecret) {
      console.error('❌ Secret "clientSecret" manquant !');
      return;
    }
    if (!event.secrets.defaultRoleID) {
      console.error('❌ Secret "defaultRoleID" manquant !');
      return;
    }
    
    console.log('✅ Tous les secrets sont présents');
    console.log('🔍 DEBUG - Domain:', event.secrets.domain);
    console.log('🔍 DEBUG - Default Role ID:', event.secrets.defaultRoleID);
    
    // ... reste du code ...
  }
};
```

---

## 🎯 Test Rapide Final

1. **Vérifiez les logs** : Actions > Logs > [Dernière connexion]
2. **Copiez le message d'erreur** exact que vous voyez
3. **Vérifiez** :
   - Action déployée ? ✅
   - Action attachée au trigger ? ✅
   - Secrets configurés ? ✅
   - Application M2M avec permissions ? ✅

 Partagez les logs que vous voyez et je vous aiderai à résoudre le problème spécifique !






