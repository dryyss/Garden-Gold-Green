# Configuration Auth0 Dashboard - Guide Rapide

## Problèmes courants et solutions

### ❌ Erreur : "Payload validation error: 'Object didn't pass validation for format callback-url'"

**Cause** : Virgule en fin de liste ou URL mal formatée

**Solution** : 
1. Supprimez la virgule à la fin de la liste
2. Vérifiez que toutes les URLs sont valides
3. Ne laissez pas d'entrées vides

## Configuration correcte

### Allowed Callback URLs

```
https://gardengoldgreen.com/api/auth/callback,http://localhost:3000/api/auth/callback
```

**Points importants** :
- ✅ Utilisez `/api/auth/callback` (pas `/auth/callback`)
- ✅ Pas de virgule à la fin
- ✅ Pas d'espaces après les virgules (optionnel mais recommandé)

### Allowed Logout URLs

```
https://gardengoldgreen.com,http://localhost:3000,https://app-ae805b7f-84c1-4812-ad56-d4a60f2360cc.cleverapps.io
```

**Points importants** :
- ✅ Pas de virgule à la fin
- ✅ Pas de duplication (évitez `www.gardengoldgreen.com` ET `gardengoldgreen.com` si c'est le même site)

### Allowed Web Origins

```
https://gardengoldgreen.com,http://localhost:3000,https://app-ae805b7f-84c1-4812-ad56-d4a60f2360cc.cleverapps.io
```

**Points importants** :
- ✅ Pas de virgule à la fin
- ✅ Pas de duplication

### Application Login URI (optionnel)

```
https://gardengoldgreen.com/login
```

## Checklist de vérification

Avant de cliquer sur "Save", vérifiez :

- [ ] Aucune virgule à la fin des listes
- [ ] Le chemin de callback est `/api/auth/callback` (pas `/auth/callback`)
- [ ] Toutes les URLs commencent par `http://` ou `https://`
- [ ] Aucune URL dupliquée
- [ ] Aucune entrée vide dans les listes
- [ ] Les URLs de production utilisent `https://`
- [ ] Les URLs de développement utilisent `http://localhost:3000`

## Après la sauvegarde

1. Redéployez votre application sur Clever Cloud
2. Testez la connexion sur `https://gardengoldgreen.com`
3. Vérifiez que vous êtes bien redirigé vers `/api/auth/callback` après l'authentification

## Dépannage

Si l'erreur persiste après correction :

1. **Videz complètement le champ** et réécrivez les URLs
2. **Vérifiez les espaces** : supprimez tous les espaces autour des virgules
3. **Testez avec une seule URL** d'abord, puis ajoutez les autres
4. **Vérifiez le format** : chaque URL doit être complète avec `http://` ou `https://`

