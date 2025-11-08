# 🔧 Code Auth0 PostLogin Action - VERSION CORRIGÉE

## ❌ Problème
L'erreur `management.users.assignRoles is not a function` survient car l'API ManagementClient dans les Actions Auth0 peut avoir des limitations.

## ✅ Solution : Utiliser l'API REST Directement

**Code à copier dans Auth0 Actions** :

```javascript
/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Check if user has no roles
  if (!event.authorization?.roles || event.authorization.roles.length === 0) {
    try {
      // Fonction helper pour fetch avec timeout
      const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          return response;
        } catch (err) {
          clearTimeout(timeoutId);
          const errorObj = err || {};
          if (errorObj.name === 'AbortError') {
            throw new Error('Request timeout');
          }
          throw err;
        }
      };

      // Obtenir un token d'accès pour l'API Management
      let tokenResponse;
      try {
        tokenResponse = await fetchWithTimeout(
          `https://${event.secrets.domain}/oauth/token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              client_id: event.secrets.clientId,
              client_secret: event.secrets.clientSecret,
              audience: `https://${event.secrets.domain}/api/v2/`,
              grant_type: 'client_credentials',
            }),
          },
          10000 // 10 secondes timeout
        );
      } catch (fetchError) {
        console.error('❌ Erreur lors de la requête fetch pour le token:', String(fetchError));
        return;
      }

      // Vérifier le statut de la réponse (utiliser any pour éviter les erreurs TypeScript)
      const tokenResponseAny = tokenResponse;
      const tokenStatus = tokenResponseAny.status || 0;
      if (tokenStatus < 200 || tokenStatus >= 300) {
        let errorText = '';
        try {
          errorText = await tokenResponseAny.text();
        } catch (e) {
          errorText = 'Erreur inconnue lors de la lecture de la réponse';
        }
        console.error('❌ Erreur lors de l\'obtention du token:', errorText);
        return;
      }

      // Parser la réponse JSON
      let tokenData = {};
      try {
        tokenData = await tokenResponseAny.json();
      } catch (e) {
        console.error('❌ Erreur lors du parsing du token:', String(e));
        return;
      }

      const access_token = tokenData.access_token;

      if (!access_token) {
        console.error('❌ Aucun token d\'accès reçu');
        return;
      }

      // Assigner le rôle à l'utilisateur via l'API REST
      let assignResponse;
      try {
        assignResponse = await fetchWithTimeout(
          `https://${event.secrets.domain}/api/v2/users/${event.user.user_id}/roles`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              roles: [event.secrets.defaultRoleID],
            }),
          },
          10000 // 10 secondes timeout
        );
      } catch (fetchError) {
        console.error('❌ Erreur lors de la requête fetch pour assigner le rôle:', String(fetchError));
        return;
      }

      // Vérifier le statut de la réponse
      const assignResponseAny = assignResponse;
      const assignStatus = assignResponseAny.status || 0;
      if (assignStatus < 200 || assignStatus >= 300) {
        let errorText = '';
        try {
          errorText = await assignResponseAny.text();
        } catch (e) {
          errorText = 'Erreur inconnue lors de la lecture de la réponse';
        }
        console.error('❌ Erreur lors de l\'assignation du rôle:', errorText);
        return;
      }

      console.log('✅ Rôle par défaut assigné à:', event.user.email);
    } catch (error) {
      const errorObj = error || {};
      const errorMessage = (typeof errorObj === 'object' && 'message' in errorObj) 
        ? errorObj.message 
        : String(error);
      console.error('❌ Erreur:', errorMessage);
    }
  } else {
    console.log('ℹ️ L\'utilisateur a déjà des rôles:', event.authorization.roles);
  }
};
```

## 🔑 Secrets à Configurer

Dans Auth0 Actions > Secrets, configurez :

- `domain` : `dev-1tkaqeynik4yy714.us.auth0.com` (sans https://)
- `clientId` : ID de votre application M2M
- `clientSecret` : Secret de votre application M2M
- `defaultRoleID` : ID du rôle par défaut (commence par `rol_`)

## 📋 Configuration de l'Application M2M

1. **Auth0 Dashboard** > **Applications** > **Create Application**
2. Type : **Machine to Machine Applications**
3. Nom : `Role Assigner`
4. API : **Auth0 Management API**
5. Permissions :
   - ✅ `read:roles`
   - ✅ `update:users`

## 🎯 Résultat

- ✅ Les utilisateurs sans rôles reçoivent automatiquement le rôle par défaut
- ✅ Pas d'erreur `assignRoles is not a function`
- ✅ Utilise l'API REST directement (plus fiable)

