# ✅ Configuration Auth0 - Final et Simple

## 🎯 Ce Qu'on Fait

**Objectif** : Tous les utilisateurs ont au minimum le rôle "user", et certains ont "admin"

**Comment ça marche** :
1. Nouvel utilisateur → Action assigne "user"
2. Utilisateur existant sans "user" → Action assigne "user"
3. Utilisateur avec "admin" → Garde "admin" + "user"

---

## 📋 Les 2 Actions Auth0 à Créer

### Action 1 : Assigner le Rôle "user" par Défaut

**Actions** > **Library** > **Create Action**

- Nom : `Add Default User Role`
- Trigger : `Login / Post Login`

**Code** :
```javascript
exports.onExecutePostLogin = async (event, api) => {
  const { ManagementClient } = require('auth0');

  const management = new ManagementClient({
    domain: event.secrets.domain,
    clientId: event.secrets.clientId,
    clientSecret: event.secrets.clientSecret,
    scope: 'read:roles update:users',
  });

  const currentRoles = event.authorization?.roles || [];
  const hasUserRole = currentRoles.includes('user');

  if (!hasUserRole) {
    try {
      await management.assignRolestoUser(
        { id: event.user.user_id },
        { roles: [event.secrets.defaultRoleID] }
      );
      console.log('✅ User role assigned');
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }
};
```

**Secrets** :
- `domain` : `dev-1tkaqeynik4yy714.us.auth0.com`
- `clientId` : ID de votre app M2M
- `clientSecret` : Secret de votre app M2M
- `defaultRoleID` : ID du rôle "user" (commence par `rol_`)

**Deploy**

---

### Action 2 : Ajouter les Rôles au Token

**Actions** > **Library** > **Create Action**

- Nom : `Add Roles to Token`
- Trigger : `Login / Post Login`

**Code** :
```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://gardengoldgreen.com';
  
  if (event.authorization) {
    api.idToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
    api.accessToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
  }
};
```

**Deploy**

---

### Attacher au Trigger

**Actions** > **Triggers** > **Login** > **post-login**

**Ordre** :
```
Start
  ↓
[Add Default User Role]  ← 1er
  ↓
[Add Roles to Token]     ← 2ème
  ↓
Complete
```

---

## 🔑 Créer l'Application M2M

**Applications** > **Create Application**

- Type : **Machine to Machine Applications**
- Nom : `Role Assigner`
- API : **Auth0 Management API**
- Permissions : `read:roles` + `update:users`

**Copiez** le `Client ID` et `Client Secret` → Utilisez-les dans les secrets de l'Action 1

---

## 🎯 Résultat

**Dans votre application** :
- Tous les utilisateurs ont le rôle "user"
- Les admins ont "admin" + "user"
- Le token contient les rôles
- Votre code lit : `auth0User['https://gardengoldgreen.com/roles']`

**C'est tout !** ✅







