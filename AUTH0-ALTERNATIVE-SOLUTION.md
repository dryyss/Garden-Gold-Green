# 🔧 Solution Alternative : Assigner le Rôle via Votre API

## 🎯 Problème
`fetch` ne fonctionne pas dans Auth0 Actions (même en production).

## ✅ Solution : Utiliser Votre API Next.js

Au lieu d'utiliser `fetch` dans Auth0, on va :
1. Créer une API route dans Next.js qui assigne le rôle
2. Appeler cette API depuis Auth0 (ou assigner le rôle côté serveur)

---

## 📋 Option 1 : Assigner le Rôle Côté Serveur (RECOMMANDÉ)

### Créer une API Route dans Next.js

Créez `src/app/api/auth/assign-default-role/route.ts` :

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ManagementClient } from 'auth0';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Initialiser le Management Client
    const management = new ManagementClient({
      domain: process.env.AUTH0_DOMAIN?.replace('https://', '') || '',
      clientId: process.env.AUTH0_M2M_CLIENT_ID || '',
      clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET || '',
      scope: 'read:roles update:users',
    });

    // Récupérer les rôles actuels de l'utilisateur
    const userRoles = await management.users.getRoles({ id: userId });
    
    // Si l'utilisateur a déjà des rôles, ne rien faire
    if (userRoles.length > 0) {
      return NextResponse.json({
        message: 'User already has roles',
        roles: userRoles.map(r => r.name),
      });
    }

    // Assigner le rôle par défaut
    const defaultRoleId = process.env.AUTH0_DEFAULT_ROLE_ID;
    if (!defaultRoleId) {
      return NextResponse.json(
        { error: 'Default role ID not configured' },
        { status: 500 }
      );
    }

    await management.users.assignRoles(
      { id: userId },
      { roles: [defaultRoleId] }
    );

    return NextResponse.json({
      message: 'Default role assigned successfully',
      roleId: defaultRoleId,
    });
  } catch (error: any) {
    console.error('Error assigning default role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to assign role' },
      { status: 500 }
    );
  }
}
```

### Ajouter les Variables d'Environnement

Dans votre `.env.local` :

```env
AUTH0_M2M_CLIENT_ID=votre_client_id_m2m
AUTH0_M2M_CLIENT_SECRET=votre_client_secret_m2m
AUTH0_DEFAULT_ROLE_ID=rol_xxxxxxxxxxxxx
```

### Appeler l'API après la Connexion

Dans votre code qui gère la connexion (par exemple dans `Auth0Context.tsx` ou après `useUser()`) :

```typescript
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';

export function YourComponent() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (user && !isLoading) {
      // Vérifier si l'utilisateur a des rôles
      const roles = user['https://gardengoldgreen.com/roles'] as string[] || [];
      
      if (roles.length === 0) {
        // Assigner le rôle par défaut
        fetch('/api/auth/assign-default-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.sub, // user.sub est l'ID Auth0
          }),
        })
          .then(res => res.json())
          .then(data => {
            console.log('✅ Rôle assigné:', data);
            // Recharger la page pour obtenir le nouveau token avec les rôles
            window.location.reload();
          })
          .catch(error => {
            console.error('❌ Erreur:', error);
          });
      }
    }
  }, [user, isLoading]);

  return null; // ou votre composant
}
```

---

## 📋 Option 2 : Action Auth0 Simplifiée (Sans Fetch)

Si vous voulez quand même utiliser une Action Auth0, mais sans fetch, on peut simplement vérifier et laisser l'assignation se faire côté serveur :

### Action Auth0 Simplifiée

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const currentRoles = event.authorization?.roles || [];
  
  if (currentRoles.length === 0) {
    console.log('ℹ️ Utilisateur sans rôles détecté:', event.user.email);
    console.log('ℹ️ Le rôle sera assigné côté serveur lors de la prochaine requête');
    
    // Ajouter un flag dans user_metadata pour indiquer qu'il faut assigner le rôle
    // (optionnel, seulement si vous voulez tracker)
  }
};
```

Puis utilisez l'Option 1 pour assigner le rôle côté serveur.

---

## 🎯 Option 3 : Assigner le Rôle lors de l'Inscription

Si vous assignez le rôle lors de l'inscription (première connexion), vous pouvez créer une Action "Post User Registration" :

### Action : Post User Registration

```javascript
exports.onExecutePostUserRegistration = async (event, api) => {
  const { ManagementClient } = require('auth0');
  
  const management = new ManagementClient({
    domain: event.secrets.domain,
    clientId: event.secrets.clientId,
    clientSecret: event.secrets.clientSecret,
    scope: 'update:users',
  });

  try {
    await management.users.assignRoles(
      { id: event.user.user_id },
      { roles: [event.secrets.defaultRoleID] }
    );
    console.log('✅ Rôle par défaut assigné à:', event.user.email);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
};
```

**Note** : Cette action fonctionne seulement à l'inscription, pas à chaque connexion.

---

## ✅ Recommandation

**Je recommande l'Option 1** car :
- ✅ Fonctionne à chaque connexion
- ✅ Pas de problème avec fetch dans Auth0
- ✅ Plus de contrôle
- ✅ Plus facile à déboguer

---

## 🔧 Installation de l'Option 1

1. **Installer le SDK Auth0** (si pas déjà fait) :
```bash
npm install auth0
```

2. **Créer l'API route** : `src/app/api/auth/assign-default-role/route.ts`

3. **Ajouter les variables d'environnement** dans `.env.local`

4. **Appeler l'API** après la connexion (dans votre contexte Auth0)

5. **Tester** : Connectez-vous avec un utilisateur sans rôle

---

## 🧪 Test

1. Créez un utilisateur sans rôle
2. Connectez-vous avec cet utilisateur
3. Vérifiez dans la console du navigateur : vous devriez voir `✅ Rôle assigné`
4. La page se recharge automatiquement
5. Vérifiez dans Auth0 : User Management > Users > [Utilisateur] > Roles → Le rôle doit être présent

---

## 📝 Variables d'Environnement Nécessaires

```env
AUTH0_DOMAIN=https://dev-1tkaqeynik4yy714.us.auth0.com
AUTH0_M2M_CLIENT_ID=votre_client_id_m2m
AUTH0_M2M_CLIENT_SECRET=votre_client_secret_m2m
AUTH0_DEFAULT_ROLE_ID=rol_xxxxxxxxxxxxx
```

---

Cette solution évite complètement le problème de `fetch` dans Auth0 Actions ! 🚀






