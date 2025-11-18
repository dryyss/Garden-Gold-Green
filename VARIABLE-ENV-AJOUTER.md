# 🔧 Variable d'environnement à ajouter dans Clever Cloud

## Problème

L'application envoie `/auth/callback` au lieu de `/api/auth/callback` malgré la route correcte dans `/api/auth/[auth0]`.

## Solution : Ajouter AUTH0_BASE_PATH

Dans Clever Cloud, ajoutez cette nouvelle variable d'environnement :

### Nom de la variable
```
AUTH0_BASE_PATH
```

### Valeur
```
/api/auth
```

## Comment ajouter dans Clever Cloud

1. Allez dans Clever Cloud > Votre application
2. **Variables d'environnement**
3. Cliquez sur **"Add a variable"**
4. Nom : `AUTH0_BASE_PATH`
5. Valeur : `/api/auth`
6. Sauvegardez
7. **Redéployez l'application**

## Alternative si AUTH0_BASE_PATH n'existe pas

Si `AUTH0_BASE_PATH` n'est pas reconnu par `@auth0/nextjs-auth0` v4, essayez :

### Option 1 : NEXT_PUBLIC_AUTH0_BASE_PATH
```
NEXT_PUBLIC_AUTH0_BASE_PATH=/api/auth
```

### Option 2 : Vérifier la documentation v4

Consultez la documentation officielle de `@auth0/nextjs-auth0` v4 pour voir comment configurer le basePath :
- https://auth0.com/docs/quickstart/webapp/nextjs

## Vérification

Après avoir ajouté la variable et redéployé :

1. Testez la connexion
2. Vérifiez les logs Auth0
3. Le `redirect_uri` devrait être `/api/auth/callback` ✅
4. Si c'est bon, supprimez `/auth/callback` de Auth0 Dashboard

## Note

Si aucune de ces variables ne fonctionne, le problème pourrait venir d'une version de `@auth0/nextjs-auth0` qui a un bug, ou d'une configuration manquante dans le code. Dans ce cas, il faudra peut-être mettre à jour la bibliothèque ou utiliser une autre approche.




