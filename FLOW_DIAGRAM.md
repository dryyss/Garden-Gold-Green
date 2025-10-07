# Diagramme de Flux - Authentification et Shopping Express

## Flux d'Authentification

```
Utilisateur non connecté
        ↓
Clic sur icône utilisateur
        ↓
┌─────────────────────┐
│   AuthModal         │
│   - Connexion       │
│   - Inscription     │
│   - Achat Express   │
└─────────────────────┘
        ↓
   Choix utilisateur
        ↓
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Connexion     │    │   Inscription   │    │  Achat Express  │
│                 │    │                 │    │                 │
│ POST /api/auth/ │    │POST /api/auth/  │    │  ExpressCheckout│
│ login           │    │ register        │    │  Modal          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        ↓                       ↓                       ↓
   Token JWT               Token JWT              POST /api/orders/
        ↓                       ↓                 express
        ↓                       ↓                       ↓
   Connexion               Connexion              Commande créée
   réussie                 réussie                (sans compte)
        ↓                       ↓                       ↓
   Redirection            Redirection            Confirmation
   vers /account          vers /account          de commande
```

## Flux de Shopping Express

```
Utilisateur ajoute des produits au panier
        ↓
Clic sur "Achat Express" dans CartSidebar
        ↓
┌─────────────────────────────────┐
│      ExpressCheckout Modal      │
│                                 │
│  Étape 1: Informations Contact  │
│  - Email                        │
│  - Téléphone                    │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│  Étape 2: Adresse de Livraison  │
│  - Nom complet                  │
│  - Adresse                      │
│  - Ville, Code postal, Pays     │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│  Étape 3: Informations Paiement │
│  - Carte bancaire               │
│  - Date d'expiration            │
│  - CVV                          │
│  - Option sauvegarde            │
└─────────────────────────────────┘
        ↓
    Validation et soumission
        ↓
┌─────────────────────────────────┐
│     POST /api/orders/express    │
│                                 │
│  - Validation des données       │
│  - Création de la commande      │
│  - Génération ID de paiement    │
│  - Mise à jour statut "paid"    │
└─────────────────────────────────┘
        ↓
    Confirmation de commande
        ↓
    Vider le panier
        ↓
    Redirection vers confirmation
```

## États de l'Application

### Utilisateur Non Connecté
- Header affiche icône utilisateur simple
- CartSidebar propose "Achat Express" + "Se connecter"
- Accès limité aux fonctionnalités

### Utilisateur Connecté
- Header affiche nom + menu déroulant
- CartSidebar propose "Commander maintenant"
- Accès complet aux fonctionnalités
- Tableau de bord accessible via `/account`

## Gestion des Erreurs

```
Erreur de connexion/inscription
        ↓
Affichage message d'erreur dans AuthModal
        ↓
Utilisateur peut réessayer ou changer de mode

Erreur de commande express
        ↓
Log de l'erreur dans la console
        ↓
Message d'erreur à l'utilisateur (à implémenter)
```

## Sécurité

- **Validation côté client** : Champs requis, formats, longueurs
- **Validation côté serveur** : Vérification des données, authentification
- **Hachage des mots de passe** : bcryptjs avec salt
- **Tokens JWT** : Expiration 7 jours, vérification à chaque requête
- **Gestion des erreurs** : Messages génériques pour éviter l'exposition d'informations
