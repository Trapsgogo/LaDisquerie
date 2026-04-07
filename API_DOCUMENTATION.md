# 📡 Documentation des Endpoints API

## Configuration de Base

**Base URL:** `http://localhost:5000/api`

**Headers Requis (sauf pour auth):**
```
Authorization: Bearer <votre_token_jwt>
Content-Type: application/json
```

---

## 🔐 Authentification

### POST `/auth/register`

**Description:** Créer un nouveau compte utilisateur

**Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "passwordConfirm": "SecurePassword123!"
}
```

**Succès (201):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Erreurs:**
- 400: Email déjà enregistré
- 400: Mots de passe ne correspondent pas
- 400: Champs manquants

---

### POST `/auth/login`

**Description:** Se connecter à un compte existant

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Succès (200):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Erreurs:**
- 401: Email ou mot de passe incorrect
- 400: Email et mot de passe requis

---

## 📀 Gestion des CDs

### POST `/cds/add`

**Description:** Ajouter un CD à sa collection

**Headers:** Authentification requise

**Body:**
```json
{
  "title": "The Dark Side of the Moon",
  "artist": "Pink Floyd",
  "releaseYear": 1973,
  "imdbId": "tt0123456",
  "condition": "Très bon",
  "notes": "Édition réédition, très bon état"
}
```

**Succès (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "title": "The Dark Side of the Moon",
  "artist": "Pink Floyd",
  "releaseYear": 1973,
  "imdbId": "tt0123456",
  "condition": "Très bon",
  "notes": "Édition réédition, très bon état",
  "addedAt": "2024-01-15T10:30:00Z"
}
```

---

### GET `/cds/my-cds`

**Description:** Récupérer tous les CDs de l'utilisateur

**Headers:** Authentification requise

**Succès (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "The Dark Side of the Moon",
    "artist": "Pink Floyd",
    "releaseYear": 1973,
    "condition": "Très bon",
    "addedAt": "2024-01-15T10:30:00Z"
  },
  ...
]
```

---

### DELETE `/cds/:cdId`

**Description:** Supprimer un CD de sa collection

**Headers:** Authentification requise

**Paramètres:**
- `cdId` (string): ID du CD à supprimer

**Succès (200):**
```json
{
  "message": "CD supprimé avec succès"
}
```

**Erreurs:**
- 404: CD non trouvé

---

### GET `/cds/search`

**Description:** Rechercher des disques via OMDB

**Headers:** Authentification requise

**Query Parameters:**
- `q` (string, required): Terme de recherche

**Exemple:** `GET /cds/search?q=The Wall`

**Succès (200):**
```json
[
  {
    "Title": "The Wall",
    "Year": "1979",
    "imdbID": "tt0080688",
    "Type": "movie"
  },
  ...
]
```

**Erreurs:**
- 400: Paramètre de recherche requis

---

## 🔄 Gestion des Emprunts

### POST `/borrows/borrow`

**Description:** Enregistrer un emprunt

**Headers:** Authentification requise

**Body:**
```json
{
  "cdId": "507f1f77bcf86cd799439012",
  "borrowerName": "Alice Martin",
  "expectedReturnDate": "2024-02-15"
}
```

**Succès (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "cdId": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "borrowerName": "Alice Martin",
  "borrowDate": "2024-01-20T14:20:00Z",
  "expectedReturnDate": "2024-02-15T00:00:00Z",
  "status": "Emprunté",
  "reminderSent": false
}
```

---

### GET `/borrows/my-borrows`

**Description:** Récupérer tous les emprunts de l'utilisateur

**Headers:** Authentification requise

**Succès (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "cdId": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "The Dark Side of the Moon"
    },
    "borrowerName": "Alice Martin",
    "borrowDate": "2024-01-20T14:20:00Z",
    "expectedReturnDate": "2024-02-15T00:00:00Z",
    "status": "Emprunté"
  },
  ...
]
```

---

### PUT `/borrows/return/:borrowId`

**Description:** Marquer un CD comme retourné

**Headers:** Authentification requise

**Paramètres:**
- `borrowId` (string): ID de l'emprunt

**Succès (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "status": "Retourné",
  "returnDate": "2024-02-10T15:45:00Z"
}
```

---

## ⭐ Gestion des Favoris

### POST `/favorites/add`

**Description:** Ajouter un disque aux favoris

**Headers:** Authentification requise

**Body:**
```json
{
  "imdbId": "tt0080688",
  "title": "The Wall",
  "artist": "Pink Floyd",
  "imdbData": {},
  "favoriteType": "Favoris"
}
```

**Types disponibles:** "Favoris", "Achat futur", "Écouté"

**Succès (201):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "userId": "507f1f77bcf86cd799439011",
  "imdbId": "tt0080688",
  "title": "The Wall",
  "artist": "Pink Floyd",
  "favoriteType": "Favoris",
  "addedAt": "2024-01-20T16:00:00Z"
}
```

---

### GET `/favorites/my-favorites`

**Description:** Récupérer tous les favoris

**Headers:** Authentification requise

**Succès (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "title": "The Wall",
    "artist": "Pink Floyd",
    "favoriteType": "Favoris",
    "addedAt": "2024-01-20T16:00:00Z"
  },
  ...
]
```

---

### DELETE `/favorites/:favoriteId`

**Description:** Supprimer un favori

**Headers:** Authentification requise

**Paramètres:**
- `favoriteId` (string): ID du favori

**Succès (200):**
```json
{
  "message": "Favori supprimé avec succès"
}
```

---

## 📝 Gestion des Prompts

### POST `/prompts/add`

**Description:** Enregistrer un prompt

**Body:**
```json
{
  "content": "Créer une page de gestion des emprunts"
}
```

**Succès (201):**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "content": "Créer une page de gestion des emprunts",
  "timestamp": "2024-01-20T16:30:00Z"
}
```

---

### GET `/prompts/all`

**Description:** Récupérer tous les prompts

**Succès (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "content": "Créer une page de gestion des emprunts",
    "timestamp": "2024-01-20T16:30:00Z"
  },
  ...
]
```

---

## 🔧 Health Check

### GET `/health`

**Description:** Vérifier que le serveur est actif

**Succès (200):**
```json
{
  "message": "Serveur en ligne"
}
```

---

## Codes d'Erreur

| Code | Signification |
|------|---------------|
| 200 | OK - Requête réussie |
| 201 | Created - Ressource créée |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Token manquant ou invalide |
| 404 | Not Found - Ressource non trouvée |
| 500 | Server Error - Erreur serveur |

---

**Version API:** 1.0  
**Dernière mise à jour:** 2024-01-20
