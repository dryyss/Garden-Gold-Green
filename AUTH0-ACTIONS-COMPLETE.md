# 🔧 Actions Auth0 Complètes - Rôles

## 📋 Vue d'Ensemble

Vous avez besoin de **2 Actions Auth0** :
1. **Action 1** : Assigner le rôle par défaut à la connexion
2. **Action 2** : Lire et renvoyer tous les rôles dans le token

---

## 🎯 ACTION 1 : Assigner le Rôle par Défaut

### Nom de l'Action
`Assign Default Role on Login`

### Trigger
`Login / Post Login`

### Code Complet

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

### Secrets Requis
- `domain` : `dev-1tkaqeynik4yy714.us.auth0.com` (sans https://)
- `clientId` : ID de votre application M2M
- `clientSecret` : Secret de votre application M2M
- `defaultRoleID` : ID du rôle par défaut (commence par `rol_`)

---

## 🎯 ACTION 2 : Lire et Renvoyer les Rôles dans le Token

### Nom de l'Action
`Add Roles to Token`

### Trigger
`Login / Post Login`

### Code Complet

```javascript
/**
 * Handler that will be called during the execution of a PostLogin flow.
 * Lit tous les rôles de l'utilisateur et les ajoute au token.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://gardengoldgreen.com';
  
  try {
    // Récupérer les rôles depuis event.authorization
    const userRoles = event.authorization?.roles || [];
    
    console.log('📋 Rôles de l\'utilisateur:', userRoles.join(', ') || 'Aucun');
    
    // Si pas de rôles dans event.authorization, essayer de les récupérer via l'API
    if (userRoles.length === 0) {
      console.log('⚠️ Aucun rôle trouvé dans event.authorization, tentative de récupération via API...');
      
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

        // Obtenir un token d'accès
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
        }

        if (tokenResponse) {
          const tokenResponseAny = tokenResponse;
          const tokenStatus = tokenResponseAny.status || 0;
          
          if (tokenStatus >= 200 && tokenStatus < 300) {
            let tokenData = {};
            try {
              tokenData = await tokenResponseAny.json();
              const access_token = tokenData.access_token;

              if (access_token) {
                // Récupérer les rôles de l'utilisateur
                let rolesResponse;
                try {
                  rolesResponse = await fetchWithTimeout(
                    `https://${event.secrets.domain}/api/v2/users/${event.user.user_id}/roles`,
                    {
                      method: 'GET',
                      headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Content-Type': 'application/json',
                      },
                    },
                    10000
                  );
                } catch (fetchError) {
                  console.error('❌ Erreur fetch pour récupérer les rôles:', String(fetchError));
                }

                if (rolesResponse) {
                  const rolesResponseAny = rolesResponse;
                  const rolesStatus = rolesResponseAny.status || 0;
                  
                  if (rolesStatus >= 200 && rolesStatus < 300) {
                    let rolesData = [];
                    try {
                      rolesData = await rolesResponseAny.json();
                      // Extraire les noms des rôles
                      const roleNames = rolesData.map(role => role.name || role.id);
                      console.log('📋 Rôles récupérés via API:', roleNames.join(', '));
                      
                      // Ajouter les rôles au token
                      if (roleNames.length > 0) {
                        api.idToken.setCustomClaim(namespace + '/roles', roleNames);
                        api.accessToken.setCustomClaim(namespace + '/roles', roleNames);
                        console.log('✅ Rôles ajoutés au token:', roleNames.join(', '));
                        return;
                      }
                    } catch (e) {
                      console.error('❌ Erreur lors du parsing des rôles:', String(e));
                    }
                  }
                }
              }
            } catch (e) {
              console.error('❌ Erreur lors du parsing du token:', String(e));
            }
          }
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des rôles:', String(error));
      }
    }
    
    // Si on a des rôles dans event.authorization, les utiliser directement
    if (userRoles.length > 0) {
      api.idToken.setCustomClaim(namespace + '/roles', userRoles);
      api.accessToken.setCustomClaim(namespace + '/roles', userRoles);
      console.log('✅ Rôles ajoutés au token depuis event.authorization:', userRoles.join(', '));
    } else {
      // Si aucun rôle trouvé, ajouter un tableau vide
      api.idToken.setCustomClaim(namespace + '/roles', []);
      api.accessToken.setCustomClaim(namespace + '/roles', []);
      console.log('⚠️ Aucun rôle trouvé, tableau vide ajouté au token');
    }
  } catch (error) {
    const errorObj = error || {};
    const errorMessage = (typeof errorObj === 'object' && 'message' in errorObj) 
      ? errorObj.message 
      : String(error);
    console.error('❌ Erreur générale:', errorMessage);
    
    // En cas d'erreur, ajouter un tableau vide pour éviter de casser le token
    api.idToken.setCustomClaim(namespace + '/roles', []);
    api.accessToken.setCustomClaim(namespace + '/roles', []);
  }
};
```

### Secrets Requis (optionnels, seulement si récupération via API nécessaire)
- `domain` : `dev-1tkaqeynik4yy714.us.auth0.com` (sans https://)
- `clientId` : ID de votre application M2M
- `clientSecret` : Secret de votre application M2M

---

## 📋 Configuration Complète

### Étape 1 : Créer les Actions

1. **Auth0 Dashboard** > **Actions** > **Library**
2. **Create Action** > **Build Custom**
3. Créez les 2 actions avec les codes ci-dessus
4. Déployez chaque action

### Étape 2 : Configurer les Secrets

Pour **Action 1** (Assign Default Role), configurez :
- `domain`
- `clientId`
- `clientSecret`
- `defaultRoleID`

Pour **Action 2** (Add Roles to Token), les secrets sont optionnels (uniquement si récupération via API nécessaire).

### Étape 3 : Attacher au Trigger

1. **Actions** > **Triggers** > **Login** > **post-login**
2. Ajoutez les actions dans cet ordre :
   ```
   Start
     ↓
   [Assign Default Role on Login]  ← 1er (assigne le rôle)
     ↓
   [Add Roles to Token]           ← 2ème (lit et ajoute au token)
     ↓
   Complete
   ```

### Étape 4 : Créer l'Application M2M (si pas déjà fait)

1. **Applications** > **Create Application**
2. Type : **Machine to Machine Applications**
3. Nom : `Role Assigner`
4. API : **Auth0 Management API**
5. Permissions :
   - ✅ `read:roles`
   - ✅ `read:users`
   - ✅ `update:users`

---

## 🧪 Tester

1. **Déconnectez-vous** complètement
2. **Connectez-vous** avec un utilisateur sans rôle
3. **Vérifiez les logs** dans Auth0 Actions > Logs
4. **Dans votre application**, vérifiez :
   ```javascript
   console.log('Roles:', auth0User['https://gardengoldgreen.com/roles']);
   ```

## ✅ Résultat Attendu

- ✅ Les utilisateurs sans rôles reçoivent automatiquement le rôle par défaut
- ✅ Tous les rôles de l'utilisateur sont dans le token
- ✅ Votre application peut lire : `auth0User['https://gardengoldgreen.com/roles']`






