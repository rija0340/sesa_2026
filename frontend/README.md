# SESA Frontend

Application React pour la gestion du Sekoly Sabata (école du sabbat).

## Stack technique

- **React 19** — Bibliothèque UI
- **Vite** — Bundler / dev server
- **Mantine v7** — Composants UI
- **Docker** — Environnement de développement

## Structure du projet

```
src/
├── api/              Appels HTTP vers le backend
├── components/       Composants réutilisables
├── hooks/            Custom hooks React
├── layouts/          Layouts (navbar, sidebar, footer)
├── pages/            Pages de l'application
├── theme/            Configuration du thème Mantine
├── App.jsx           Composant racine
└── main.jsx          Point d'entrée
```

## Pourquoi cette structure ?

### Principe : simplicité et cohérence avec le backend

Le backend Symfony est organisé en couches claires (`Entity`, `Repository`, `Controller`, `ApiResource`). Le frontend reprend la même logique, adaptée à React :

| Backend (Symfony)           | Frontend (React)     | Rôle                              |
|-----------------------------|----------------------|-----------------------------------|
| `Repository/`               | `api/`               | Accès aux données                 |
| `Controller/`               | `pages/`             | Logique par page / vue            |
| `Entity/`                   | (pas nécessaire)     | Les données restent en JSON       |
| `ApiResource/`              | `api/`               | Définition des endpoints          |
| —                           | `components/`        | Composants UI réutilisables       |
| —                           | `hooks/`             | Logique React réutilisable        |
| —                           | `layouts/`           | Structure des pages               |
| —                           | `theme/`             | Apparence globale Mantine         |

### Pourquoi pas de dossier `services/`, `utils/`, `store/` ?

On garde la structure **minimale**. Ces dossiers pourront être ajoutés au besoin si le projet grandit. Pas de sur-ingénierie.

### Convention de nommage

- **Composants** (`.jsx`) : `PascalCase` → `KilasyForm.jsx`
- **Hooks** : préfixe `use` → `useKilasy.js`
- **API / utilitaires** : `camelCase` → `kilasy.js`

## Démarrage

```bash
# depuis la racine du projet
docker compose up -d frontend
```

Le dev server est accessible sur `http://localhost:5173`.

## Dossier `api/`

Le client HTTP (`client.js`) centralise la configuration (URL de base, headers JSON-LD pour API Platform). Les fichiers `kilasy.js` et `registre.js` exportent des fonctions CRUD prêtes à l'emploi :

```jsx
import { getKilasys } from "./api/kilasy";
import { getStatsKilasy } from "./api/registre";

// Récupérer toutes les classes
const kilasys = await getKilasys();

// Récupérer les stats d'une classe
const stats = await getStatsKilasy(1);
```
