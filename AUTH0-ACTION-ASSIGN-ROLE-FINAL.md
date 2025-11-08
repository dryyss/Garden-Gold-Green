# 🔧 Action Auth0 : Assigner le Rôle par Défaut - VERSION FONCTIONNELLE

## ✅ Code Fonctionnel pour Auth0 Actions

Le `ManagementClient` ne fonctionne pas dans Auth0 Actions. Utilisez ce code avec l'API REST :

```javascript
/**
 * Handler that will be called during the execution of a PostLogin flow.
 * Assigne automatiquement un rôle par défaut si l'utilisateur n'en a pas.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Vérifier si l'utilisateur a déjà des rôles
  const currentRoles = event.authorization?.roles || [];
  
  if (currentRoles.length === 0) {
    console.log('ℹ️ Utilisateur sans rôles détecté:', event.user.email);
    
    try {
      // Fonction helper pour fetch avec timeout
      const fetchWithTimeout = async (url, options, timeout = 10000) => {
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

      // Étape 1 : Obtenir un token d'accès pour l'API Management
      console.log('📡 Obtention du token Management API...');
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
          10000
        );
      } catch (fetchError) {
        console.error('❌ Erreur fetch pour obtenir le token:', String(fetchError));
        return;
      }

      // Vérifier le statut de la réponse
      const tokenResponseAny = tokenResponse;
      const tokenStatus = tokenResponseAny.status || 0;
      
      if (tokenStatus < 200 || tokenStatus >= 300) {
        let errorText = '';
        try {
          errorText = await tokenResponseAny.text();
        } catch (e) {
          errorText = 'Erreur inconnue';
        }
        console.error('❌ Erreur lors de l\'obtention du token (status:', tokenStatus, '):', errorText);
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
        console.error('❌ Aucun token d\'accès reçu dans la réponse');
        return;
      }

      // Étape 2 : Assigner le rôle à l'utilisateur
      console.log('📝 Assignation du rôle par défaut...');
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
          10000
        );
      } catch (fetchError) {
        console.error('❌ Erreur fetch pour assigner le rôle:', String(fetchError));
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
          errorText = 'Erreur inconnue';
        }
        console.error('❌ Erreur lors de l\'assignation du rôle (status:', assignStatus, '):', errorText);
        return;
      }

      console.log('✅ Rôle par défaut assigné avec succès à:', event.user.email);
    } catch (error) {
      const errorObj = error || {};
      const errorMessage = (typeof errorObj === 'object' && 'message' in errorObj) 
        ? errorObj.message 
        : String(error);
      console.error('❌ Erreur générale:', errorMessage);
    }
  } else {
    console.log('ℹ️ Utilisateur a déjà des rôles:', currentRoles.join(', '));
  }
};
```

## 🔑 Secrets Requis

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

## ⚠️ Important

- **Ne pas utiliser `ManagementClient`** dans Auth0 Actions, ça ne fonctionne pas
- **Utiliser l'API REST directement** avec `fetch`
- **Toujours utiliser `AbortController`** pour les timeouts (requis par Auth0)

## 🧪 Test

1. Créez un utilisateur sans rôle
2. Connectez-vous avec cet utilisateur
3. Vérifiez les logs dans Auth0 Actions > Logs
4. Vous devriez voir : `✅ Rôle par défaut assigné avec succès à: [email]`






