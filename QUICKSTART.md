# 🚀 Guide de Démarrage Rapide - LaDisquerie

## Installation Locale

### Étape 1: Cloner et naviguer au dossier

```bash
cd /workspaces/LaDisquerie
```

### Étape 2: Configuration Backend

```bash
cd backend
npm install
cp .env.example .env
```

**Éditer le fichier `.env`:**
```
MONGODB_URI=mongodb://localhost:27017/ladisquerie
JWT_SECRET=dev_secret_key_12345
PORT=5000
OMDB_API_KEY=votre_clé_ici
NODE_ENV=development
```

**Démarrer le backend:**
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### Étape 3: Configuration Frontend

Dans un nouveau terminal:

```bash
cd frontend
npm install
npm run dev
```

L'application démarre sur `http://localhost:3000`

## 🐳 Avec Docker & Docker Compose

Pour une installation complète avec MongoDB:

```bash
docker-compose up
```

Cela démarre:
- MongoDB sur le port 27017
- Backend sur le port 5000
- Frontend sur le port 3000

## 📝 Premiers Pas dans l'Application

1. **Créer un compte:**
   - Allez sur `/register`
   - Remplissez le formulaire d'inscription
   - Validez votre compte

2. **Se connecter:**
   - Allez sur `/login`
   - Entrez vos identifiants

3. **Ajouter un CD à votre collection:**
   - Onglet "Ma Collection"
   - Cliquez sur "➕ Ajouter un CD"
   - Remplissez les informations

4. **Découvrir de nouveaux disques:**
   - Onglet "Découvrir"
   - Recherchez par titre ou artiste
   - Ajoutez aux favoris ou à votre liste d'achat

5. **Gérer les emprunts:**
   - Onglet "Emprunts"
   - Enregistrez les emprunts de vos disques
   - Suivez les dates de retour

6. **Voir l'historique:**
   - Page "Prompts" pour l'historique
   - Page "Crédits" pour les créateurs

## 📚 API Documentation

### Base URL
`http://localhost:5000/api`

### Authentification

**POST** `/auth/register`
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**POST** `/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse:**
```json
{
  "user": { "id": "...", "username": "...", "email": "..." },
  "token": "jwt_token_here"
}
```

### CDs (Nécessite authentification)

**GET** `/cds/my-cds` - Récupérer tous mes CDs

**POST** `/cds/add`
```json
{
  "title": "Album Name",
  "artist": "Artist Name",
  "releaseYear": 2023,
  "imdbId": "tt123456",
  "condition": "Très bon",
  "notes": "Optional notes"
}
```

**DELETE** `/cds/:cdId` - Supprimer un CD

**GET** `/cds/search?q=search_term` - Rechercher des disques

### Emprunts (Nécessite authentification)

**POST** `/borrows/borrow`
```json
{
  "cdId": "...",
  "borrowerName": "Ami Name",
  "expectedReturnDate": "2024-12-31"
}
```

**GET** `/borrows/my-borrows` - Récupérer mes emprunts

**PUT** `/borrows/return/:borrowId` - Marquer comme retourné

### Favoris (Nécessite authentification)

**POST** `/favorites/add`
```json
{
  "imdbId": "tt123456",
  "title": "Album Name",
  "artist": "Artist Name",
  "favoriteType": "Favoris" ou "Achat futur"
}
```

**GET** `/favorites/my-favorites` - Récupérer mes favoris

**DELETE** `/favorites/:favoriteId` - Supprimer un favori

### Prompts

**POST** `/prompts/add`
```json
{
  "content": "Le contenu du prompt"
}
```

**GET** `/prompts/all` - Récupérer tous les prompts

## 🔑 Variables d'Environnement

### Backend (.env)

| Variable | Description | Exemple |
|----------|-------------|---------|
| MONGODB_URI | URI de connexion MongoDB | mongodb://localhost:27017/ladisquerie |
| JWT_SECRET | Secret pour les JWT tokens | dev_secret_key_12345 |
| PORT | Port du serveur | 5000 |
| OMDB_API_KEY | Clé API OMDB | sk_xxxxx |
| NODE_ENV | Environnement | development/production |

### Frontend (.env)

| Variable | Description | Exemple |
|----------|-------------|---------|
| VITE_API_URL | URL de l'API backend | http://localhost:5000 |

## 🛠️ Troubleshooting

**Erreur: "MONGODB_URI not found"**
- Assurez-vous que `.env` existe et contient MONGODB_URI
- Vérifiez que MongoDB est lancé

**Erreur: "OMDB_API_KEY not found"**
- Obtenez une clé sur [omdbapi.com](http://www.omdbapi.com/)
- Ajoutez-la dans `.env`

**Port déjà utilisé**
- Changez le PORT dans `.env`
- Ou tuez le processus: `lsof -i :5000 && kill -9 <PID>`

## 📁 Structure des Dossiers

```
LaDisquerie/
├── backend/
│   ├── controllers/     # Logique métier
│   ├── models/          # Schémas MongoDB
│   ├── routes/          # Routes API
│   ├── middleware/      # Middleware (auth, etc.)
│   ├── server.js        # Point d'entrée
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/       # Pages React
│   │   ├── components/  # Composants réutilisables
│   │   ├── services/    # Appels API
│   │   ├── styles/      # CSS
│   │   └── main.jsx     # Point d'entrée
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
├── README.md
├── FEATURES.md
└── QUICKSTART.md
```

## 🎯 Prochaines Étapes

1. Personnalisez les couleurs du thème dans `frontend/src/styles/`
2. Ajoutez plus de validations dans le backend
3. Implémentez les notifications de rappel
4. Déployez sur un serveur (Heroku, Vercel, etc.)

## 📞 Support

Pour des questions ou des problèmes:
1. Vérifiez la documentation du projet
2. Consultez les logs du serveur
3. Créez une issue sur GitHub

---

**Propriétaires du dépôt:** Trapsgogo  
**Développeurs:** Hugo Boubault, François Adeline, Michaël Millet, Antoine MERY
