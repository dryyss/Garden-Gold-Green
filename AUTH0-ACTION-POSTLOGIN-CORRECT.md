# ✅ Code Auth0 PostLogin Action - Version Corrigée

## 🎯 Votre Code Actuel (avec corrections)

Voici votre code corrigé avec les améliorations :

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://gardengoldgreen.com';

  // 1. Ajouter les rôles au token (IMPORTANT - manquait dans votre code)
  if (event.authorization?.roles && event.authorization.roles.length > 0) {
    api.idToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
    api.accessToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
    return; // L'utilisateur a déjà des rôles
  }

  // 2. Si pas de rôles, assigner le rôle par défaut
  if (!event.authorization?.roles || event.authorization.roles.length === 0) {
    try {
      const ManagementClient = require('auth0').ManagementClient;
      
      const management = new ManagementClient({
        domain: event.secrets.domain,
        clientId: event.secrets.clientId,
        clientSecret: event.secrets.clientSecret,
        scope: 'read:roles update:users', // ⚠️ AJOUTÉ - manquait dans votre code
      });

      // ⚠️ CORRIGÉ - Votre syntaxe était presque bonne, mais voici la version correcte
      await management.users.assignRoles(
        { id: event.user.user_id },
        { roles: [event.secrets.defaultRoleID] }
      );

      console.log('✅ Rôle par défaut assigné à:', event.user.email);

      // ⚠️ AJOUTÉ - Il faut aussi ajouter le rôle au token !
      const roleName = event.secrets.defaultRoleName || 'customer';
      api.idToken.setCustomClaim(namespace + '/roles', [roleName]);
      api.accessToken.setCustomClaim(namespace + '/roles', [roleName]);

    } catch (error) {
      console.error('❌ Erreur:', error);
      
      // En cas d'erreur, assigner quand même "customer" au token
      api.idToken.setCustomClaim(namespace + '/roles', ['customer']);
      api.accessToken.setCustomClaim(namespace + '/roles', ['customer']);
    }
  }
};
```

## 📋 Action Complète avec Rôle par Défaut + Ajout au Token

Copiez ce code dans votre Action Auth0 PostLogin :

```javascript
/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://gardengoldgreen.com';

  // 1. Ajouter les rôles au token (si l'utilisateur en a déjà)
  if (event.authorization?.roles && event.authorization.roles.length > 0) {
    api.idToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
    api.accessToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
    return; // L'utilisateur a déjà des rôles, on s'arrête là
  }

  // 2. Si l'utilisateur n'a pas de rôles, assigner le rôle par défaut
  if (!event.authorization?.roles || event.authorization.roles.length === 0) {
    try {
      const ManagementClient = require('auth0').ManagementClient;
      
      const management = new ManagementClient({
        domain: event.secrets.domain,
        clientId: event.secrets.clientId,
        clientSecret: event.secrets.clientSecret,
        scope: 'read:roles update:users', // Ajouter le scope
      });

      const defaultRoleId = event.secrets.defaultRoleID;

      if (!defaultRoleId) {
        console.error('❌ defaultRoleID non configuré dans les secrets');
        // Assigner quand même "customer" au token pour éviter les erreurs
        api.idToken.setCustomClaim(namespace + '/roles', ['customer']);
        api.accessToken.setCustomClaim(namespace + '/roles', ['customer']);
        return;
      }

      // Assigner le rôle par défaut
      await management.users.assignRoles(
        { id: event.user.user_id },
        { roles: [defaultRoleId] }
      );

      console.log('✅ Rôle par défaut assigné à:', event.user.email);

      // Ajouter le rôle au token
      // Note: Il faut récupérer le nom du rôle ou utiliser le rôle par défaut
      const roleName = event.secrets.defaultRoleName || 'customer';
      api.idToken.setCustomClaim(namespace + '/roles', [roleName]);
      api.accessToken.setCustomClaim(namespace + '/roles', [roleName]);

    } catch (error) {
      console.error('❌ Erreur lors de l\'assignation du rôle:', error);
      
      // En cas d'erreur, assigner quand même "customer" au token
      api.idToken.setCustomClaim(namespace + '/roles', ['customer']);
      api.accessToken.setCustomClaim(namespace + '/roles', ['customer']);
    }
  }
};
```

---

## 🔧 Configuration des Secrets

Dans votre Action Auth0, allez dans l'onglet **Settings** > **Secrets** et ajoutez :

1. **`domain`** : `dev-1tkaqeynik4yy714.us.auth0.com` (votre domaine Auth0)
2. **`clientId`** : L'ID de votre application M2M (celle que vous venez de créer)
3. **`clientSecret`** : Le secret de votre application M2M
4. **`defaultRoleID`** : L'ID du rôle "customer" (commence par `rol_...`)
   - Pour le trouver : User Management > Roles > customer > copiez l'ID
5. **`defaultRoleName`** (optionnel) : `customer`

---

## 📝 Version Simplifiée (Sans ManagementClient)

Si `ManagementClient` ne fonctionne pas dans Auth0 Actions, utilisez cette version qui utilise l'API REST :

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://gardengoldgreen.com';

  // Si l'utilisateur a déjà des rôles, les ajouter au token
  if (event.authorization?.roles && event.authorization.roles.length > 0) {
    api.idToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
    api.accessToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
    return;
  }

  // Si pas de rôles, assigner "customer" par défaut au token
  // Note: Le rôle sera assigné dans Auth0 via l'API /api/auth/assign-default-role
  api.idToken.setCustomClaim(namespace + '/roles', ['customer']);
  api.accessToken.setCustomClaim(namespace + '/roles', ['customer']);
};
```

Cette version simplifiée :
- ✅ Ajoute toujours "customer" au token si l'utilisateur n'a pas de rôles
- ✅ L'assignation du rôle dans Auth0 se fera via votre API Next.js (`/api/auth/assign-default-role`)

---

## ✅ Recommandation

**Je recommande la version simplifiée** car :
- ✅ Plus fiable (pas de problème avec ManagementClient)
- ✅ Plus simple
- ✅ Fonctionne avec votre API existante
- ✅ Moins de configuration

---

## 🧪 Tester

1. Déployez l'action
2. Déconnectez-vous et reconnectez-vous
3. Ouvrez la console (F12)
4. Vérifiez les logs :
   ```
   🔍 Roles claim: ["customer"]
   🔍 Final role: customer
   ```

---

## 🔍 Dépannage

### Erreur : "ManagementClient is not defined"
→ Utilisez la version simplifiée

### Erreur : "assignRoles is not a function"
→ Utilisez la version simplifiée

### Les rôles n'apparaissent pas dans le token
→ Vérifiez que l'action est déployée et attachée au trigger post-login

