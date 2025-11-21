# Configuration DATABASE_URL pour Clever Cloud

## Variable à ajouter

Dans Clever Cloud → Variables d'environnement, ajoutez :

### Nom
```
DATABASE_URL
```

### Valeur
```
postgresql://ukm8umajjf9ds2axjrte:bzxTtNiHfrjjTwFQfEUqgkm54oFMRC@bjnnq5gifvkvxogohnjm-postgresql.services.clever-cloud.com:50013/bjnnq5gifvkvxogohnjm?schema=public
```

## Détails de la connexion

- **Host**: `bjnnq5gifvkvxogohnjm-postgresql.services.clever-cloud.com`
- **Port**: `50013`
- **Database**: `bjnnq5gifvkvxogohnjm`
- **User**: `ukm8umajjf9ds2axjrte`
- **Password**: `bzxTtNiHfrjjTwFQfEUqgkm54oFMRC`
- **Version PostgreSQL**: `15`

## Note importante

Le paramètre `?schema=public` à la fin est **essentiel** pour que Prisma fonctionne correctement.

## Après ajout

1. Sauvegardez la variable
2. **Redéployez l'application** pour que la variable soit prise en compte
3. Vérifiez les logs pour confirmer la connexion à la base de données

## Alternative

Si vous préférez, le script `start-production.js` peut automatiquement convertir `POSTGRESQL_ADDON_URI` en `DATABASE_URL`, mais il est recommandé de définir `DATABASE_URL` directement pour plus de clarté.




