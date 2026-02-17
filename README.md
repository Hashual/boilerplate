# R6.05-project — API REST Films

API REST développée avec **Hapi.js** permettant la gestion d'utilisateurs, de films et de favoris. Le projet intègre une authentification JWT, un système de notifications par mail (Nodemailer) et un message broker (RabbitMQ) pour l'export CSV.

---

## Prérequis

- **Node.js** (v14+)
- **npm**
- **Docker** (pour MySQL et RabbitMQ)

---

## Installation

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd R6.05-project

# Installer les dépendances
npm install
```

---

## Variables d'environnement

Créer un fichier `server/.env` à partir du modèle dans le 'server/.env.example' :

| Variable | Description | Valeur par défaut |
|---|---|---|
| `PORT` | Port d'écoute du serveur HTTP | `3000` |
| `DB_HOST` | Hôte de la base de données MySQL | `0.0.0.0` |
| `DB_USER` | Utilisateur MySQL | `root` |
| `DB_PASSWORD` | Mot de passe MySQL | — |
| `DB_DATABASE` | Nom de la base de données | — |
| `DB_PORT` | Port exposé par le conteneur MySQL | `3307` |
| `MAIL_HOST` | Serveur SMTP | `smtp.ethereal.email` |
| `MAIL_PORT` | Port SMTP | `587` |
| `MAIL_USER` | Identifiant SMTP | — |
| `MAIL_PASSWORD` | Mot de passe SMTP | — |
| `MAIL_FROM` | Adresse expéditeur des mails | `noreply@iut-project.com` |
| `AMQP_URL` | URL de connexion RabbitMQ | `amqp://localhost` |

Pour les tests en local, créer un compte sur [Ethereal Email](https://ethereal.email/) afin de visualiser les mails envoyés.
Penser à changer les variables d'environnement correspondantes.

---

## Lancement avec Docker

Utilisation de docker-compose.yml

Créer un fichier `.env` à partir du `.env.example` correspondant **à la racine du projet** (à côté du `docker-compose.yml`)

Puis lancer les conteneurs :

```bash
docker compose up -d
```

## Démarrage du serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`.

La documentation Swagger est disponible sur :
```
http://localhost:3000/documentation
```

---

## Migrations

Les migrations sont exécutées **automatiquement au démarrage** du serveur (sauf en production).

## Authentification

L'API utilise **JWT** (JSON Web Token) via `@hapi/jwt`.

1. **Créer un compte** : `POST /user`
2. **Se connecter** : `POST /user/login` : retourne un token JWT
3. **Utiliser le token** : ajouter le header `Authorization: Bearer <token>` à chaque requête authentifiée

Le token contient les informations de l'utilisateur et ses **scopes** (`user` ou `admin`) qui déterminent les autorisations d'accès aux endpoints.

| Scope | Droits |
|---|---|
| `user` | Consulter les utilisateurs, gérer ses favoris |
| `admin` | Tous les droits `user` + créer/modifier/supprimer des films et utilisateurs, exporter le CSV |

---

## Endpoints de l'API

### Utilisateurs

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/user` | X | Créer un utilisateur |
| `POST` | `/user/login` | X | Connexion (retourne un JWT) |
| `GET` | `/users` | `user` `admin` | Lister tous les utilisateurs |
| `PATCH` | `/user/{id}` | `admin` | Modifier un utilisateur |
| `DELETE` | `/user/{id}` | `admin` | Supprimer un utilisateur |

### Films

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/film` | `admin` | Créer un film |
| `GET` | `/films` | X | Lister tous les films |
| `PATCH` | `/film/{id}` | `admin` | Modifier un film |
| `DELETE` | `/film/{id}` | `admin` | Supprimer un film |

### Favoris

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/film/{id}/favorites` | `user` `admin` | Ajouter un film aux favoris |
| `DELETE` | `/film/{id}/favorites` | `user` `admin` | Retirer un film des favoris |

### Export CSV (Message Broker)

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/films/csv-export` | `admin` | Demander un export CSV de tous les films |