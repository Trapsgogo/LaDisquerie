# 📚 Documentation de LaDisquerie

Bienvenue dans la documentation complète de **LaDisquerie** - Application Web de Gestion de Collection de Disques

## 📖 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Structure du Projet](#structure-du-projet)
3. [Fonctionnalités](#fonctionnalités)
4. [Installation](#installation)
5. [Utilisation](#utilisation)
6. [Documentation API](#documentation-api)
7. [Technologies](#technologies)
8. [Crédits](#crédits)

---

## Vue d'ensemble

**LaDisquerie** est une application web moderne permettant de:
- 📀 Gérer votre collection personnelle de disques
- 🔄 Suivre les emprunts de vos disques
- ⭐ Découvrir de nouvelles sorties
- ❤️ Créer des listes d'achat et de favoris
- 📝 Enregistrer l'historique des prompts

### Caractéristiques principales

✅ **Authentification JWT sécurisée**  
✅ **Intégration OMDB pour les données de disques**  
✅ **Gestion complète de collection**  
✅ **Système d'emprunt avec rappels**  
✅ **Page de découverte**  
✅ **Historique des prompts avec timestamps**  
✅ **Interface moderne et responsive**  

---

## Structure du Projet

```
LaDisquerie/
│
├── 📁 backend/                    # API Node.js/Express
│   ├── 📁 controllers/            # Logique métier
│   ├── 📁 models/                 # Schémas MongoDB
│   ├── 📁 routes/                 # Endpoints API
│   ├── 📁 middleware/             # Authentification, etc.
│   ├── 📄 server.js               # Point d'entrée
│   ├── 📄 package.json
│   ├── 📄 .env.example
│   └── 📄 Dockerfile
│
├── 📁 frontend/                   # App React/Vite
│   ├── 📁 src/
│   │   ├── 📁 pages/              # Pages React
│   │   ├── 📁 components/         # Composants réutilisables
│   │   ├── 📁 services/           # Appels API
│   │   ├── 📁 styles/             # Fichiers CSS
│   │   ├── 📄 main.jsx
│   │   ├── 📄 App.jsx
│   │   └── 📄 index.css
│   ├── 📄 index.html
│   ├── 📄 vite.config.js
│   ├── 📄 package.json
│   └── 📄 Dockerfile
│
├── 📄 docker-compose.yml          # Orchestration des services
├── 📄 README.md                   # Documentation principale
├── 📄 QUICKSTART.md               # Guide de démarrage
├── 📄 API_DOCUMENTATION.md        # Documentation API détaillée
├── 📄 FEATURES.md                 # Liste des fonctionnalités
└── 📄 .gitignore

```

---

## Fonctionnalités

### 🔐 Système d'Authentification

- **Inscription**: Création de compte avec validation
- **Connexion**: Authentification sécurisée par JWT
- **Session**: Token persistant avec expiration 7 jours
- **Protection**: Routes protégées côté client et serveur

### 📀 Gestion de Collection

- **Ajouter CD**: Enregistrez titre, artiste, année, état, notes
- **Voir Collection**: Liste complète avec détails
- **Supprimer CD**: Suppression facile avec confirmation
- **État du disque**: Neuf, Très bon, Bon, Acceptable, Mauvais
- **Recherche OMDB**: Intégration pour enrichir les données

### 🔄 Gestion des Emprunts

- **Enregistrer emprunt**: Nom emprunteur, date de retour
- **Suivi**: Statut Emprunté/Retourné
- **Rappels**: Dates de retour attendues
- **Historique**: Tous les emprunts passés et actuels

### ⭐ Page de Découverte

- **Recherche**: Par titre ou artiste (OMDB)
- **Favoris**: Ajout à la liste de favoris
- **Achat futur**: Créez une liste d'achat
- **Détails**: Informations complètes sur chaque disque

### ❤️ Gestion des Favoris

- **Catégories**: Favoris, Achat futur, Écoutés
- **Ajouter/Supprimer**: Gestion facile
- **Affichage**: Tous les favoris avec classification

### 📝 Historique des Prompts

- **Enregistrement**: Chaque prompt avec timestamp exact
- **Affichage**: Timeline chronologique
- **Détails**: Heure précise et contenu du prompt
- **Historique**: Tous les prompts depuis le début

### 🎬 Page de Crédits

- **Créateurs**: Hugo Boubault, François Adeline, Michaël Millet, Antoine MERY
- **Propriétaire**: Trapsgogo
- **Technologies**: Stack complet listéwp
- **Fonctionnalités**: Résumé des features

---

## Installation

### Prérequis

- Node.js v14+ et npm
- MongoDB (local ou cloud - MongoDB Atlas)
- Git

### Installation Locale

```bash
# 1. Cloner le dépôt
git clone https://github.com/Trapsgogo/LaDisquerie.git
cd LaDisquerie

# 2. Backend
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos configurations
npm run dev

# 3. Frontend (nouveau terminal)
cd ../frontend
npm install
npm run dev
```

### Installation avec Docker

```bash
docker-compose up
```

---

## Utilisation

### Première connexion

1. **Créer un compte** sur `/register`
2. **Se connecter** sur `/login`
3. **Accéder au dashboard** automatiquement redirigé

### Ajouter un CD

1. Allez dans "Ma Collection"
2. Cliquez "➕ Ajouter un CD"
3. Remplissez:
   - Titre (requis)
   - Artiste (requis)
   - Année (optionnel)
   - État (Neuf, Très bon, Bon, Acceptable, Mauvais)
   - Notes (optionnel)

### Découvrir & Ajouter aux Favoris

1. Allez dans "Découvrir"
2. Recherchez par titre ou artiste
3. Pour chaque résultat:
   - Cliquez "❤️ Favoris" ou "🛒 À acheter"
4. Consultez vos favoris dans l'onglet "Favoris"

### Gérer les Emprunts

1. Allez dans "Emprunts"
2. Cliquez sur un CD pour enregistrer un emprunt
3. Entrez:
   - Nom de la personne
   - Date de retour attendue
4. Suivez l'historique

### Consulter l'Historique des Prompts

1. Cliquez sur "📝 Prompts"
2. Voyez tous les prompts avec timestamps
3. Chaque prompt affiche l'heure exacte

### Voir les Crédits

1. Cliquez sur "🎬 Crédits"
2. Consultez les créateurs et technologies utilisées

---

## Documentation API

Pour la documentation complète des endpoints API, consultez [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

### Endpoints Principaux

**Authentification:**
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter

**CDs:**
- `POST /api/cds/add` - Ajouter un CD
- `GET /api/cds/my-cds` - Récupérer mes CDs
- `DELETE /api/cds/:cdId` - Supprimer un CD
- `GET /api/cds/search?q=...` - Rechercher des CDs

**Emprunts:**
- `POST /api/borrows/borrow` - Enregistrer un emprunt
- `GET /api/borrows/my-borrows` - Récupérer mes emprunts
- `PUT /api/borrows/return/:borrowId` - Marquer comme retourné

**Favoris:**
- `POST /api/favorites/add` - Ajouter aux favoris
- `GET /api/favorites/my-favorites` - Récupérer mes favoris
- `DELETE /api/favorites/:favoriteId` - Supprimer un favori

**Prompts:**
- `POST /api/prompts/add` - Ajouter un prompt
- `GET /api/prompts/all` - Récupérer tous les prompts

---

## Technologies

### Backend

- **Node.js** - Runtime JavaScript côté serveur
- **Express.js** - Framework web minimaliste
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - JSON Web Tokens pour authentification
- **Bcrypt** - Hachage sécurisé des mots de passe
- **Axios** - Client HTTP
- **CORS** - Gestion des requêtes cross-origin

### Frontend

- **React 18** - Librairie UI moderne
- **React Router v6** - Navigation
- **Vite** - Build tool rapide
- **Axios** - Client HTTP
- **CSS3** - Styles modernes et responsive

### Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Orchestration multi-conteneurs
- **MongoDB** - Base de données
- **OMDB API** - Données sur les films/musiques

---

## Variables d'Environnement

### Backend (.env)

```
MONGODB_URI=mongodb://localhost:27017/ladisquerie
JWT_SECRET=your_secret_key_here
PORT=5000
OMDB_API_KEY=your_omdb_api_key
NODE_ENV=development
```

### Frontend

Configuré automatiquement pour `http://localhost:5000`

---

## Déploiement

### Heroku (Backend)

```bash
git push heroku main
```

### Vercel (Frontend)

```bash
vercel deploy
```

---

## Troubleshooting

### "MongoDB connection refused"
- Vérifiez que MongoDB est lancé
- Vérifiez MONGODB_URI dans .env

### "OMDB_API_KEY not found"
- Inscrivez-vous sur [omdbapi.com](http://www.omdbapi.com/)
- Ajoutez votre clé dans .env

### Port déjà utilisé
- Changez le port dans .env
- Ou tuez le processus: `lsof -i :5000 && kill -9 <PID>`

---

## Futures Améliorations

- [ ] Notifications de rappel email
- [ ] Statistiques et graphiques
- [ ] Export/Import de collection
- [ ] Partage de collection
- [ ] Intégration Spotify
- [ ] Rating système
- [ ] Mode hors ligne
- [ ] Application mobile

---

## Support

### Documentation

- [README.md](README.md) - Vue d'ensemble générale
- [QUICKSTART.md](QUICKSTART.md) - Guide de démarrage
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Endpoints API
- [FEATURES.md](FEATURES.md) - Listes des fonctionnalités

### Aide

Pour toute question:
1. Consultez la documentation
2. Vérifiez les logs du serveur
3. Créez une issue sur GitHub

---

## Crédits

### Développeurs
- **Hugo Boubault**
- **François Adeline**
- **Michaël Millet**
- **Antoine MERY**

### Propriétaire du Dépôt
- **Trapsgogo**

### Licence

Projet LaDisquerie © 2024 - Tous droits réservés

---

**Dernière mise à jour:** Janvier 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅
