# 📧 Configuration Auth0 pour l'envoi d'emails de vérification

## Problème
Les emails de vérification Auth0 ne sont pas reçus par les utilisateurs.

## Solution : Configurer un fournisseur d'email dans Auth0

Auth0 nécessite un fournisseur d'email configuré pour envoyer des emails de vérification. Par défaut, Auth0 utilise un service limité qui peut ne pas fonctionner correctement.

### Étapes de configuration

#### Option 1 : Utiliser SendGrid (Recommandé - déjà configuré pour les autres emails)

1. **Dans le Dashboard Auth0** :
   - Allez dans **Settings** > **Emails**
   - Cliquez sur **Email Provider**
   - Sélectionnez **SendGrid**

2. **Configuration SendGrid** :
   - **API Key** : Utilisez votre clé API SendGrid (déjà dans `SENDGRID_API_KEY`)
   - **From Email** : `contact@gardengoldgreen.com` (ou votre email vérifié)
   - **From Name** : `Garden Gold Green`

3. **Tester la configuration** :
   - Cliquez sur **Test** pour envoyer un email de test
   - Vérifiez votre boîte de réception

#### Option 2 : Utiliser Mailgun

1. **Dans le Dashboard Auth0** :
   - Allez dans **Settings** > **Emails**
   - Sélectionnez **Mailgun**

2. **Configuration** :
   - Entrez votre **API Key** Mailgun
   - Entrez votre **Domain** Mailgun
   - Configurez l'email expéditeur

#### Option 3 : Utiliser AWS SES

1. **Dans le Dashboard Auth0** :
   - Allez dans **Settings** > **Emails**
   - Sélectionnez **Amazon SES**

2. **Configuration** :
   - Entrez vos **AWS Access Key ID** et **Secret Access Key**
   - Sélectionnez votre **Region**

### Vérification de la configuration

1. **Vérifier que le service est actif** :
   - Dans Auth0 Dashboard > **Settings** > **Emails**
   - Le statut doit être **Active** ✅

2. **Tester l'envoi d'email** :
   - Utilisez le bouton **Test** dans Auth0
   - Ou testez depuis l'application en cliquant sur "Renvoyer l'email"

### Configuration des templates d'email (Optionnel)

1. **Personnaliser le template de vérification** :
   - Allez dans **Branding** > **Email Templates**
   - Sélectionnez **Verification Email**
   - Personnalisez le contenu si nécessaire

2. **Variables disponibles** :
   - `{{link}}` - Lien de vérification
   - `{{email}}` - Email de l'utilisateur
   - `{{name}}` - Nom de l'utilisateur

### Vérification des permissions de l'application M2M

Assurez-vous que votre application Machine-to-Machine (M2M) a les permissions nécessaires :

1. **Dans Auth0 Dashboard** :
   - Allez dans **Applications** > **Applications**
   - Sélectionnez votre application M2M
   - Allez dans l'onglet **APIs** ou **Machine to Machine Applications**
   - Vérifiez que l'API **Auth0 Management API** est autorisée
   - Vérifiez les scopes :
     - ✅ `read:users`
     - ✅ `update:users`
     - ✅ `create:users`
     - ✅ `delete:users`

### Dépannage

#### L'email n'est toujours pas reçu

1. **Vérifier les logs Auth0** :
   - Allez dans **Monitoring** > **Logs**
   - Filtrez par type : **Email Sent** ou **Email Failed**
   - Vérifiez les erreurs

2. **Vérifier les spams** :
   - Vérifiez le dossier spam/courrier indésirable
   - Ajoutez l'expéditeur à vos contacts

3. **Vérifier la configuration SendGrid** :
   - Vérifiez que votre domaine est vérifié dans SendGrid
   - Vérifiez que l'API Key est valide
   - Vérifiez les limites d'envoi

4. **Tester avec l'API directement** :
   ```bash
   curl -X POST "https://YOUR_DOMAIN/api/v2/users/USER_ID/send-verification-email" \
     -H "Authorization: Bearer YOUR_MANAGEMENT_TOKEN" \
     -H "Content-Type: application/json"
   ```

### Code corrigé

Le code a été mis à jour pour utiliser le bon endpoint Auth0 :
- ✅ Endpoint corrigé : `/api/v2/users/{id}/send-verification-email`
- ✅ Meilleure gestion des erreurs
- ✅ Messages d'erreur plus clairs

### Variables d'environnement nécessaires

Assurez-vous que ces variables sont configurées dans Clever Cloud :

```env
AUTH0_DOMAIN=dev-1tkaqeynik4yy714.us.auth0.com
AUTH0_M2M_CLIENT_ID=votre_client_id
AUTH0_M2M_CLIENT_SECRET=votre_client_secret
AUTH0_M2M_AUDIENCE=https://dev-1tkaqeynik4yy714.us.auth0.com/api/v2/
```

### Prochaines étapes

1. ✅ Configurer un fournisseur d'email dans Auth0 Dashboard
2. ✅ Tester l'envoi depuis Auth0 Dashboard
3. ✅ Tester depuis l'application
4. ✅ Vérifier les logs en cas d'erreur


