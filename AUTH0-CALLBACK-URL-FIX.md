# Solution : Erreur "Callback URL mismatch" - `/auth/callback` vs `/api/auth/callback`

## Problème

L'erreur montre que Auth0 essaie de rediriger vers :
```
https://gardengoldgreen.com/auth/callback
```

Mais dans Auth0 Dashboard, vous avez configuré :
```
https://gardengoldgreen.com/api/auth/callback
```

## Solution temporaire (rapide)

Ajoutez **les deux URLs** dans Auth0 Dashboard pour éviter l'erreur immédiatement :

**Allowed Callback URLs** :
```
https://gardengoldgreen.com/api/auth/callback,https://gardengoldgreen.com/auth/callback,http://localhost:3000/api/auth/callback
```

## Solution définitive

Le problème vient probablement de :
1. **`APP_BASE_URL` n'est pas défini** dans Clever Cloud
2. Auth0 construit l'URL de callback de manière incorrecte

### Étapes

1. **Ajoutez `APP_BASE_URL` dans Clever Cloud** :
   ```
   APP_BASE_URL = https://gardengoldgreen.com
   ```

2. **Vérifiez que toutes les variables sont correctes** :
   - `APP_BASE_URL` = `https://gardengoldgreen.com`
   - `AUTH0_BASE_URL` = `https://gardengoldgreen.com`
   - `NEXT_PUBLIC_APP_URL` = `https://gardengoldgreen.com`

3. **Redéployez l'application**

4. **Testez à nouveau** - Auth0 devrait maintenant utiliser `/api/auth/callback`

5. **Une fois que ça fonctionne**, vous pouvez retirer `/auth/callback` de Auth0 Dashboard et garder seulement `/api/auth/callback`

## Pourquoi `/auth/callback` apparaît ?

Avec `@auth0/nextjs-auth0` v4, la route par défaut est `/api/auth/[auth0]` qui gère automatiquement `/api/auth/callback`.

Si `/auth/callback` apparaît, c'est probablement parce que :
- `APP_BASE_URL` n'est pas défini, donc Auth0 ne peut pas construire correctement l'URL
- Une ancienne configuration ou cache utilise l'ancien chemin
- Un lien quelque part dans le code pointe vers `/auth/callback`

## Vérification

Pour vérifier quelle URL est utilisée, regardez les logs Clever Cloud lors de la connexion. Vous devriez voir dans les logs quelle URL de callback est construite.

## Note

La solution temporaire (ajouter les deux URLs) fonctionnera, mais la solution définitive est de s'assurer que `APP_BASE_URL` est correctement défini pour qu'Auth0 construise automatiquement la bonne URL.

