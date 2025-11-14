/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://gardengoldgreen.com';

  // 1. Si l'utilisateur a déjà des rôles, les ajouter au token
  if (event.authorization && event.authorization.roles && event.authorization.roles.length > 0) {
    api.idToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
    api.accessToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
    return;
  }

  // 2. Si pas de rôles, assigner le rôle par défaut
  if (!event.authorization || !event.authorization.roles || event.authorization.roles.length === 0) {
    try {
      const ManagementClient = require('auth0').ManagementClient;
      
      const management = new ManagementClient({
        domain: event.secrets.domain,
        clientId: event.secrets.clientId,
        clientSecret: event.secrets.clientSecret,
        scope: 'read:roles update:users'
      });

      // Assigner le rôle par défaut
      await management.users.assignRoles(
        { id: event.user.user_id },
        { roles: [event.secrets.defaultRoleID] }
      );

      console.log('✅ Rôle assigné à:', event.user.email);

      // Ajouter le rôle au token
      api.idToken.setCustomClaim(namespace + '/roles', ['customer']);
      api.accessToken.setCustomClaim(namespace + '/roles', ['customer']);

    } catch (error) {
      console.error('❌ Erreur:', error);
      
      // En cas d'erreur, assigner quand même "customer" au token
      api.idToken.setCustomClaim(namespace + '/roles', ['customer']);
      api.accessToken.setCustomClaim(namespace + '/roles', ['customer']);
    }
  }
};





