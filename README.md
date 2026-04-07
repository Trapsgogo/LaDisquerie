# LaDisquerie - Application Web de Gestion de Collection de Disques

Une application web moderne pour gérer votre collection de disques personnels avec authentification, recherche IMDB, gestion des emprunts et bien plus!

## 🎵 Fonctionnalités

### 🔐 Authentification
- **Création de compte**: Inscription avec validation
- **Connexion sécurisée**: Authentification par JWT
- **Gestion de session**: Tokens persistants

### 📀 Gestion de Collection
- **Ajouter des CD**: Enregistrez vos disques avec infos détaillées
- **Recherche**: Intégration OMDB pour trouver des informations sur vos disques
- **Supprimer**: Gérez votre collection facilement
- **État du disque**: Neuf, Très bon, Bon, Acceptable, Mauvais

### 🔄 Gestion des Emprunts
- **Suivre les emprunts**: Enregistrez qui a emprunté vos disques
- **Rappels**: Dates de retour attendues
- **Historique**: Voir tous les emprunts passés et actuels

### ⭐ Découvrir et Favoris
- **Page de découverte**: Trouvez les dernières sorties
- **Ajouter aux favoris**: Sauvegardez vos disques préférés
- **Liste d'achat**: Créez une liste de disques à acheter à l'avenir

### 📝 Historique des Prompts
- **Suivi des prompts**: Enregistrement de tous les prompts donnés
- **Timestamps**: Heure exacte de chaque prompt

### 🎬 Page de Crédits
Crédits pour les créateurs:
- Hugo Boubault
- François Adeline
- Michaël Millet
- Antoine MERY

Propriétaire du dépôt: **Trapsgogo**

## 🛠️ Installation

### Prérequis
- Node.js (v14+)
- MongoDB (local ou cloud)
- npm ou yarn

### Configuration du Backend

1. Naviguer vers le dossier backend:
```bash
cd backend
```

2. Installer les dépendances:
```bash
npm install
```

3. Créer un fichier `.env` basé sur `.env.example`:
```bash
cp .env.example .env
```

4. Remplir les variables d'environnement:
```
MONGODB_URI=mongodb://localhost:27017/ladisquerie
JWT_SECRET=votre_secret_jwt_ici
PORT=5000
OMDB_API_KEY=votre_clé_omdb_ici
NODE_ENV=development
```

5. Démarrer le serveur:
```bash
npm run dev
```

### Configuration du Frontend

1. Naviguer vers le dossier frontend:
```bash
cd frontend
```

2. Installer les dépendances:
```bash
npm install
```

3. Démarrer le serveur de développement:
```bash
npm run dev
```

L'application sera accessible à `http://localhost:3000`

## 🚀 Lancement avec Docker

```bash
docker-compose up
```

## 📡 API Endpoints

### Authentification
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter

### CDs
- `POST /api/cds/add` - Ajouter un CD
- `GET /api/cds/my-cds` - Récupérer mes CDs
- `DELETE /api/cds/:cdId` - Supprimer un CD
- `GET /api/cds/search?q=...` - Rechercher des CDs

### Emprunts
- `POST /api/borrows/borrow` - Enregistrer un emprunt
- `PUT /api/borrows/return/:borrowId` - Retourner un CD
- `GET /api/borrows/my-borrows` - Récupérer mes emprunts

### Favoris
- `POST /api/favorites/add` - Ajouter aux favoris
- `GET /api/favorites/my-favorites` - Récupérer mes favoris
- `DELETE /api/favorites/:favoriteId` - Supprimer un favori

### Prompts
- `POST /api/prompts/add` - Ajouter un prompt
- `GET /api/prompts/all` - Récupérer tous les prompts

## 🏗️ Structure du Projet

```
LaDisquerie/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── styles/
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 📚 Technologies Utilisées

### Backend
- **Node.js** - Serveur JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **Bcrypt** - Hachage de mots de passe
- **Axios** - Requêtes HTTP
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React 18** - Librairie UI
- **React Router** - Navigation
- **Vite** - Build tool
- **Axios** - Client HTTP
- **CSS Modern** - Styles

## 🔑 Clés API Requises

### OMDB API
Pour utiliser la recherche de disques, vous avez besoin d'une clé API OMDB:
1. Visitez [omdbapi.com](http://www.omdbapi.com/)
2. Inscrivez-vous et obtenez votre clé gratuite
3. Ajoutez-la à votre `.env`

## 💭 Fonctionnalités Futures

- [ ] Notifications de rappel d'emprunt
- [ ] Page de statistiques (nombre de CD, artistes favoris, etc.)
- [ ] Export/Import de collection
- [ ] Partage de collection avec d'autres utilisateurs
- [ ] Intégration Spotify pour la musique
- [ ] Système de notation et commentaires
- [ ] Mode hors ligne
- [ ] Application mobile

## 📝 License

Projet LaDisquerie - Développé par Hugo Boubault, François Adeline, Michaël Millet, et Antoine MERY

## 🤝 Support

Pour toute question ou problème, n'hésitez pas à créer une issue sur le dépôt GitHub.

---

Profitez de la gestion de votre collection de disques avec LaDisquerie! 🎵