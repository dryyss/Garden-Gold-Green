# 🔐 Configuration "Allowed APPs / APIs" dans Auth0

## Section "Allowed APPs / APIs"

Cette section permet de spécifier quelles applications peuvent faire des requêtes de délégation vers cette API.

## ✅ Solution recommandée : Laisser vide

**Par défaut, toutes vos applications sont autorisées.**

Vous pouvez **laisser ce champ vide** si :
- Vous utilisez une application web standard (comme Garden Gold Green)
- Vous n'avez pas besoin de restrictions spécifiques
- Vous voulez que toutes vos applications Auth0 puissent accéder à cette API

## 🔒 Si vous voulez restreindre l'accès

Si vous voulez limiter l'accès à certaines applications seulement, ajoutez les **Client IDs** séparés par des virgules ou un par ligne :

### Pour votre application principale

```
Lt54JQ2uYcmyTU0oo7Tu5EVwJJIIBJX9
```

### Pour l'application Machine-to-Machine (M2M)

```
m9e0vooDs1pJ0pBuuANn9OgfgYY5eusQ
```

### Les deux ensemble

```
Lt54JQ2uYcmyTU0oo7Tu5EVwJJIIBJX9,m9e0vooDs1pJ0pBuuANn9OgfgYY5eusQ
```

ou un par ligne :

```
Lt54JQ2uYcmyTU0oo7Tu5EVwJJIIBJX9
m9e0vooDs1pJ0pBuuANn9OgfgYY5eusQ
```

## 📝 Note importante

Cette configuration est principalement utilisée pour :
- **APIs** qui acceptent des tokens de délégation
- **Applications** qui ont besoin de restrictions d'accès spécifiques

Pour une application web standard comme la vôtre, **laisser vide est la meilleure option**.

## ✅ Recommandation

**Laissez ce champ vide** pour l'instant. Vous pourrez toujours le modifier plus tard si nécessaire.

