# LaDisquerie - Gestionnaire de Collection de Disques

## 📋 Fonctionnalités Principais de l'Application

### ✅ Implémentées

1. **Système d'authentification**
   - ✓ Inscription with password validation
   - ✓ Connexion secure avec JWT
   - ✓ Gestion de session

2. **Gestion de collection**
   - ✓ Ajouter des CDs
   - ✓ Supprimer des CDs
   - ✓ Voir sa collection complète
   - ✓ Intégration OMDB pour les données de disques

3. **Gestion des emprunts**
   - ✓ Enregistrer un emprunt
   - ✓ Marquer un retour
   - ✓ Suivre les dates de retour attendues

4. **Page de découverte**
   - ✓ Recherche de disques via OMDB
   - ✓ Ajouter aux favoris
   - ✓ Classer comme "Achat futur"

5. **Historique des prompts**
   - ✓ Enregistrement des prompts avec timestamps
   - ✓ Page dédiée pour afficher les prompts

6. **Page de crédits**
   - ✓ Liste des créateurs: Hugo Boubault, François Adeline, Michaël Millet, Antoine MERY
   - ✓ Propriétaire du dépôt: Trapsgogo

### 🚀 Démarrage Rapide

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos configurations
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Avec Docker:**
```bash
docker-compose up
```

### 🔑 Variables d'Environnement Requises

- `MONGODB_URI` - Connexion MongoDB
- `JWT_SECRET` - Secret pour les tokens JWT
- `OMDB_API_KEY` - Clé API OMDB

### 📱 Pages disponibles

- `/login` - Connexion
- `/register` - Inscription
- `/dashboard` - Tableau de bord principal avec:
  - Ma Collection (gestion des CDs)
  - Emprunts (suivi des emprunts)
  - Découvrir (recherche et favoris)
  - Prompts (historique)
  - Crédits

---

**Version**: 1.0.0  
**Développeurs**: Hugo Boubault, François Adeline, Michaël Millet, Antoine MERY  
**Propriétaire du dépôt**: Trapsgogo
