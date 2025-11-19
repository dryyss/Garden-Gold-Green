# Instructions pour pousser la correction

## Problème
Clever Cloud déploie toujours l'ancien commit `a9593d0` qui n'a pas la correction du bug `categoryTags`.

## Solution

Ouvre un terminal PowerShell dans le dossier `garden-gold-green` et exécute ces commandes **UNE PAR UNE** :

```powershell
# 1. Ajouter tous les fichiers modifiés
git add .

# 2. Créer un commit
git commit -m "Fix ProductQuiz categoryTags type error"

# 3. Pousser vers origin/main (ou la branche que Clever Cloud surveille)
git push origin main
```

**OU** si tu es sur une autre branche que `main`, vérifie d'abord avec :
```powershell
git branch
```

Puis pousse vers la bonne branche.

## Après le push

1. Va sur Clever Cloud
2. Vérifie que le déploiement a bien démarré (il devrait détecter le nouveau commit)
3. Les logs devraient afficher un **nouveau** `Deploying commit ID ...` (différent de `a9593d0`)
4. Le build devrait maintenant réussir car `ProductQuiz.tsx` contient les `categoryTags: []` manquants


