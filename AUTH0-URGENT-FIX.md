# 🔴 SOLUTION URGENTE - Erreur "The state parameter is invalid"

## Problème actuel

Auth0 redirige vers `/auth/callback` mais votre configuration attend `/api/auth/callback`.

## Solution immédiate (2 minutes)

### Dans Auth0 Dashboard

1. Allez dans **Applications** > Votre application
2. Dans **Allowed Callback URLs**, ajoutez **les deux URLs** :

```
https://gardengoldgreen.com/api/auth/callback,https://gardengoldgreen.com/auth/callback,http://localhost:3000/api/auth/callback
```

3. Cliquez sur **Save**

### Pourquoi les deux URLs ?

- `/api/auth/callback` = Route correcte avec `@auth0/nextjs-auth0` v4
- `/auth/callback` = URL actuellement utilisée (probablement configurée quelque part)

En ajoutant les deux, Auth0 acceptera les deux chemins et l'erreur disparaîtra.

## Solution définitive (après)

Une fois que ça fonctionne, vous pouvez :

1. **Ajouter `APP_BASE_URL` dans Clever Cloud** :
   ```
   APP_BASE_URL = https://gardengoldgreen.com
   ```

2. **Redéployer l'application**

3. **Vérifier que Auth0 utilise maintenant `/api/auth/callback`**

4. **Retirer `/auth/callback` de Auth0 Dashboard** et garder seulement `/api/auth/callback`

## Test

Après avoir ajouté les deux URLs dans Auth0 Dashboard :

1. Allez sur `https://gardengoldgreen.com`
2. Cliquez sur "Se connecter"
3. L'erreur devrait disparaître
4. Vous devriez être authentifié correctement

## Note

Si l'erreur persiste après avoir ajouté les deux URLs :
- Vérifiez qu'il n'y a pas d'espace en fin d'URL dans Auth0 Dashboard
- Vérifiez que vous avez bien cliqué sur "Save"
- Attendez quelques secondes pour que les changements prennent effet
- Testez en navigation privée pour éviter les problèmes de cache

