# Authentification JWT avec Symfony & LexikJWTAuthenticationBundle

Ce document détaille le fonctionnement, le flux et les composants clés de l'authentification JWT (JSON Web Token) mise en place dans ce projet.

## 1. Concept Général : Stateless (Sans État)

Contrairement à une authentification classique par session (où le serveur stocke l'état de connexion en mémoire/fichier et donne un cookie `PHPSESSID`), l'approche JWT est **Stateless**.

- Le serveur ne garde **aucune trace** des utilisateurs connectés.
- C'est le **Client** (Frontend) qui stocke sa "preuve d'identité" (le Token).
- À chaque requête, le Token est renvoyé et **vérifié cryptographiquement**.

---

## 2. Le Flux d'Authentification (Workflow)

Il y a deux phases distinctes : l'obtention du token (Login) et son utilisation (Authentification).

### Phase A : Le Login (Obtention du Token)

**Objectif** : Échanger des identifiants (secrets) contre un jeton (public mais signé).

1.  **Requête Client** : sends `POST /api/login_check` avec `{ "username": "admin", "password": "password" }`.
2.  **Symfony (Security)** :
    - Le `UserProvider` cherche l'utilisateur en BDD via son `username`.
    - Le `PasswordHasher` vérifie si le mot de passe correspond au hash stocké.
3.  **LexikJWT (Succès)** :
    - Si les credentials sont valides, le bundle génère un **Payload** (données du token) contenant l'identifiant utilisateur (`username`) et ses rôles.
    - Il **signe** ce payload avec la **Clé Privée** du serveur (`config/jwt/private.pem`).
4.  **Réponse** : Le serveur renvoie `{ "token": "eyJhbGcV..." }`.

### Phase B : L'Utilisation (Requêtes API)

**Objectif** : Accéder à une ressource protégée.

1.  **Requête Client** : envoie `GET /api/kilasys` avec le Header `Authorization: Bearer <TOKEN>`.
2.  **LexikJWT (Firewall)** :
    - Intercepte la requête avant le contrôleur.
    - Extrait le token du Header.
    - Vérifie la **Signature** avec la **Clé Publique** (`config/jwt/public.pem`).
    - Vérifie la date d'expiration (`exp`).
3.  **Symfony (User Provider)** :
    - Si le token est valide, il lit le `username` dans le payload.
    - Il recharge l'objet `User` complet depuis la Base de Données (pour avoir les droits à jour).
    - Il place cet utilisateur dans le contexte de sécurité (`$this->getUser()`).
4.  **Contrôleur/API Platform** :
    - Le code métier s'exécute en sachant "Qui est là".

---

## 3. Configuration Technique

### 3.1 Clés Cryptographiques
Le cœur de la sécurité repose sur une paire de clés RSA générée par OpenSSL :
- **Private Key** (`config/jwt/private.pem`) : Sert à **SIGNER** les tokens. (Ne doit JAMAIS sortir du serveur).
- **Public Key** (`config/jwt/public.pem`) : Sert à **VÉRIFIER** les signatures.

### 3.2 Le Firewall (`config/packages/security.yaml`)
C'est le douanier qui décide qui passe et comment.

```yaml
firewalls:
    login:
        pattern: ^/api/login          # Route spécifique du login
        stateless: true
        json_login:                   # Authentification par JSON (Creds)
            check_path: /api/login_check
            success_handler: lexik_jwt_authentication.handler.authentication_success
            failure_handler: lexik_jwt_authentication.handler.authentication_failure

    api:
        pattern: ^/api                # Toutes les autres routes API
        stateless: true
        jwt: true                     # Authentification par JWT (Token)
```

### 3.3 L'Entité User (`src/Entity/User.php`)
C'est le pont entre le Token et la Base de Données.
- Elle implémente `UserInterface` & `PasswordAuthenticatedUserInterface`.
- Elle porte l'identifiant unique (`username`) qui sera stocké dans le token.
- Elle porte le mot de passe haché (`password`).

---

## 4. commandes Utiles

- **Générer les clés JWT** (si perdues) :
  ```bash
  php bin/console lexik:jwt:generate-keypair
  ```

- **Créer un utilisateur** (commande custom) :
  ```bash
  php bin/console app:create-user <username> <password> <roles>
  # Ex: php bin/console app:create-user admin password ROLE_ADMIN
  ```

---

## 5. Bonnes Pratiques

1.  **Stockage Côté Front** :
    - Idéalement pas dans `localStorage` (vulnérable XSS).
    - Préférer un cookie `httpOnly` `Secure` si possible (nécessite config serveur cookie-based que Lexik supporte aussi).
2.  **Expiration** :
    - Les tokens ont une durée de vie courte (ex: 1h par défaut).
    - Pour prolonger la session sans redemander le mot de passe, on utilise souvent un `Refresh Token` (bundle supplémentaire : `GesdinetJWTRefreshTokenBundle`).
3.  **HTTPS** :
    - Indispensable en production. Le token circule à chaque requête, s'il est intercepté (Man-in-the-Middle), le compte est compromis.
