# Architecture Backend (Symfony + API Platform)

Ce document décrit les choix de conception actuellement appliqués dans `backend/`.

## 1) Objectif architectural

- Conserver une architecture MVC traditionnelle (Symfony).
- Utiliser API Platform pour exposer l'API REST.
- Adopter un "semi-DDD" pragmatique:
  - modèle métier riche dans les entités,
  - sans agrégats explicites,
  - sans Value Objects dédiés.

## 2) Stack et version

- Symfony 7.4
- API Platform 4.2.x (installé: `v4.2.15`)
- PHP >= 8.2
- Doctrine ORM avec mapping XML (`backend/config/doctrine/*.orm.xml`)
- Authentification JWT via `LexikJWTAuthenticationBundle`

## 3) Positionnement des couches

- `Entity` (`backend/src/Entity`):
  - contient les données + logique métier + invariants métier.
- `ApiResource` (`backend/src/ApiResource`):
  - définit le contrat API exposé (opérations, groups, format des champs).
  - sert de DTO d'entrée/sortie (séparé des entités Doctrine).
- `State Provider` (`backend/src/State/*Provider.php`):
  - lecture API (GET item / GET collection),
  - mapping Entity -> ApiResource.
- `State Processor` (`backend/src/State/*Processor.php`):
  - écriture API (POST/PATCH/DELETE),
  - orchestration, résolution des références (IDs),
  - appel des méthodes métier des entités,
  - persistance via repositories.
- `Repository` (`backend/src/Repository`):
  - accès aux données (Doctrine),
  - interface + implémentation.
- `Controller` (`backend/src/Controller/StatsController.php`):
  - endpoints spécifiques non CRUD (statistiques),
  - logique d'application orientée cas d'usage HTTP.

## 4) Choix majeur: modèle riche dans les entités

### 4.1 Kilasy

- Méthode métier dédiée: `appliquerConfiguration(...)`.
- Invariants validés dans l'entité:
  - nom obligatoire,
  - stratégie `nbrMambraUsed` autorisée,
  - `nbrMambra` non négatif,
  - si stratégie `custom`, `nbrMambra` requis.
- Constantes métier pour éviter les valeurs magiques:
  - `NBR_MAMBRA_USED_REGISTRE`
  - `NBR_MAMBRA_USED_CUSTOM`

### 4.2 Registre

- Méthode métier dédiée: `enregistrerDonnees(...)`.
- Invariants validés dans l'entité:
  - tous les compteurs >= 0,
  - `fanatitra >= 0`,
  - cohérence de présence/apprentissage par rapport à la classe et aux totaux.
- Normalisation de date centralisée dans l'entité pour compatibilité Doctrine (`date`).

### 4.3 Exception métier dédiée

- `App\Domain\Exception\DomainValidationException`:
  - utilisée pour exprimer les violations métier au niveau domaine.

## 5) Choix API Platform: Provider/Processor custom

Les providers/processors custom sont assumés pour ces raisons:

- Les ressources API sont des DTO séparés des entités Doctrine.
- Le contrat API expose des IDs plats (`kilasyId`, `kilasyLasitraId`) au lieu d'objets liés.
- Il faut mapper explicitement entre contrat API et modèle métier.
- Les processors convertissent les erreurs métier en réponses HTTP 422 (`UnprocessableEntityHttpException`).

Conséquence:

- meilleure maîtrise du contrat API et de la logique métier,
- au prix d'un mapping manuel supplémentaire.

## 6) Suppression du legacy DataPersister

Décision:

- Les anciennes classes `DataPersister` ont été supprimées.

Raison:

- Projet en API Platform 4: le mécanisme recommandé est `State Provider/Processor`.
- Les DataPersister n'étaient plus référencés et créaient de la confusion.

Résultat:

- un seul chemin de lecture/écriture API,
- architecture plus lisible.

## 7) Pourquoi pas d'agrégats / value objects

Décision explicite:

- ne pas introduire, pour l'instant, d'agrégats ni de Value Objects.

Raison:

- garder une complexité maîtrisée,
- conserver une approche proche MVC/Doctrine,
- monter progressivement le niveau DDD uniquement là où le gain est net.

Compromis:

- certaines règles restent portées par des primitives (int/string/float),
- vigilance nécessaire pour éviter la duplication de règles si le domaine grossit.

## 8) Conventions de maintenance

- Toute règle métier nouvelle doit, par défaut, entrer dans l'entité concernée.
- Les processors doivent rester des orchestrateurs (chargement, appel métier, persistance).
- Les providers doivent rester des adaptateurs de lecture (pas de logique métier lourde).
- Toute erreur métier côté API doit remonter en 422 avec message explicite.

## 9) Limites actuelles connues

- Tests unitaires d'entité : Ajoutés pour `Kilasy` et `Registre` (voir `backend/tests/Entity`).
- Certains endpoints de stats filtrent en mémoire (optimisation possible via requêtes dédiées).
- `save()` repository fait `flush()` immédiatement.

## 10) Direction future (si besoin)

- Extraire des services de domaine ciblés uniquement si une logique dépasse clairement l'entité.
- Introduire agrégats/VO seulement sur les zones où la complexité métier le justifie.
- Étendre les tests fonctionnels (API).

## 11) Sécurité et Authentification

L'accès à l'API est protégé par JWT (JSON Web Token) via `LexikJWTAuthenticationBundle`.

### 11.1 Flux d'authentification

Le système repose sur une authentification "Stateless" (sans session serveur).

1.  **Demande de Token (Login)** :
    - Le client (Frontend) envoie une requête `POST /api/login_check` avec `{ "username": "...", "password": "..." }`.
    - Le bundle vérifie les identifiants via le `UserProvider` (Entité `User`).
    - Si OK, le bundle génère un token JWT signé avec la clé privée du serveur (dans `config/jwt`).
    - Le serveur renvoie le token : `{ "token": "eyJ..." }`.

2.  **Utilisation du Token** :
    - Le client stocke ce token (ex: localStorage, cookie HttpOnly).
    - Pour chaque requête protégée (ex: `GET /api/sekoly-sabata/kilasys`), le client ajoute le header :
      `Authorization: Bearer <TOKEN>`

3.  **Vérification** :
    - Le Firewall Symfony intercepte la requête.
    - Il décode le token et vérifie sa signature avec la clé publique.
    - Si la signature est valide et le token non expiré, l'identité de l'utilisateur est restaurée pour cette requête.
    - Si invalide, une erreur `401 Unauthorized` est retournée.

### 11.2 Gestion des utilisateurs
- Entité `App\Entity\User` mappée via XML (`config/doctrine/User.orm.xml`).
- Commande CLI pour créer des utilisateurs : `php bin/console app:create-user <username> <password> <roles>`.
