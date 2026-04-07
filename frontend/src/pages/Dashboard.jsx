import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cdService, borrowService, favoriteService } from '../services/services';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [cds, setCds] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('collection');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserCDs();
    loadBorrows();
    loadFavorites();
  }, []);

  const loadUserCDs = async () => {
    try {
      const response = await cdService.getUserCDs();
      setCds(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des CDs:', error);
    }
  };

  const loadBorrows = async () => {
    try {
      const response = await borrowService.getBorrows();
      setBorrows(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des emprunts:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await favoriteService.getFavorites();
      setFavorites(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      const response = await cdService.searchCDs(searchTerm);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCD = async (cdData) => {
    try {
      await cdService.addCD(
        cdData.title,
        cdData.artist,
        cdData.releaseYear,
        cdData.imdbId,
        cdData.condition,
        cdData.notes
      );
      loadUserCDs();
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du CD:', error);
    }
  };

  const handleDeleteCD = async (cdId) => {
    if (window.confirm('Êtes-vous sûr(e) de vouloir supprimer ce CD?')) {
      try {
        await cdService.deleteCD(cdId);
        loadUserCDs();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleAddFavorite = async (imdbId, title, artist, favoriteType) => {
    try {
      await favoriteService.addFavorite(imdbId, title, artist, {}, favoriteType);
      loadFavorites();
      alert('Ajouté aux favoris!');
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>🎵 LaDisquerie</h1>
        </div>
        <ul className="nav-menu">
          <li onClick={() => setActiveTab('collection')} className={activeTab === 'collection' ? 'active' : ''}>
            📀 Ma Collection
          </li>
          <li onClick={() => setActiveTab('borrows')} className={activeTab === 'borrows' ? 'active' : ''}>
            🔄 Emprunts
          </li>
          <li onClick={() => setActiveTab('discover')} className={activeTab === 'discover' ? 'active' : ''}>
            ⭐ Découvrir
          </li>
          <li onClick={() => setActiveTab('favorites')} className={activeTab === 'favorites' ? 'active' : ''}>
            ❤️ Favoris
          </li>
          <li onClick={() => navigate('/prompts')} className="nav-link">
            📝 Prompts
          </li>
          <li onClick={() => navigate('/credits')} className="nav-link">
            🎬 Crédits
          </li>
          <li onClick={handleLogout} className="logout-link">
            🚪 Déconnexion
          </li>
        </ul>
      </nav>

      <div className="content">
        {activeTab === 'collection' && (
          <div className="collection-view">
            <h2>📀 Ma Collection de Disques</h2>
            <div className="action-buttons">
              <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
                {showAddForm ? '❌ Annuler' : '➕ Ajouter un CD'}
              </button>
              <p className="collection-count">Total: {cds.length} disque(s)</p>
            </div>

            {showAddForm && <AddCDForm onSubmit={handleAddCD} />}

            {cds.length === 0 ? (
              <p className="empty-state">Aucun CD dans votre collection. Commencez à en ajouter!</p>
            ) : (
              <div className="cds-grid">
                {cds.map(cd => (
                  <div key={cd._id} className="cd-card">
                    <h3>{cd.title}</h3>
                    <p>🎤 {cd.artist}</p>
                    {cd.releaseYear && <p>📅 {cd.releaseYear}</p>}
                    <p>Condition: <span className="condition-badge">{cd.condition}</span></p>
                    {cd.notes && <p className="notes">💬 {cd.notes}</p>}
                    <button onClick={() => handleDeleteCD(cd._id)} className="btn-danger">
                      🗑️ Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'borrows' && (
          <div className="borrows-view">
            <h2>🔄 Gestion des Emprunts</h2>
            {borrows.length === 0 ? (
              <p className="empty-state">Aucun emprunt enregistré.</p>
            ) : (
              <div className="borrows-list">
                {borrows.map(borrow => (
                  <div key={borrow._id} className={`borrow-card ${borrow.status === 'Retourné' ? 'returned' : 'borrowed'}`}>
                    <h3>CD: {borrow.cdId?.title}</h3>
                    <p>👤 Emprunté par: <strong>{borrow.borrowerName}</strong></p>
                    <p>📌 Statut: <span className={`status-${borrow.status.toLowerCase().replace(' ', '-')}`}>{borrow.status}</span></p>
                    {borrow.borrowDate && (
                      <p>📅 Emprunté le: {new Date(borrow.borrowDate).toLocaleDateString()}</p>
                    )}
                    {borrow.expectedReturnDate && (
                      <p>⏰ Retour attendu: {new Date(borrow.expectedReturnDate).toLocaleDateString()}</p>
                    )}
                    {borrow.returnDate && (
                      <p>✓ Retourné le: {new Date(borrow.returnDate).toLocaleDateString()}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'discover' && (
          <div className="discover-view">
            <h2>⭐ Découvrir des Disques</h2>
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Rechercher par titre ou artiste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn-primary">🔍 Rechercher</button>
            </form>
            {loading && <p className="loading-text">Recherche en cours...</p>}
            {searchResults.length === 0 && searchTerm && !loading && (
              <p className="empty-state">Aucun résultat trouvé pour "{searchTerm}"</p>
            )}
            <div className="search-results">
              {searchResults.map((result, idx) => (
                <div key={idx} className="search-result">
                  <h4>{result.Title || result.title}</h4>
                  {result.Year && <p className="result-year">{result.Year}</p>}
                  {result.Type && <p className="result-type">{result.Type}</p>}
                  <div className="result-actions">
                    <button 
                      onClick={() => handleAddFavorite(result.imdbID, result.Title, result.Year, 'Favoris')}
                      className="btn-secondary"
                    >
                      ❤️ Favoris
                    </button>
                    <button 
                      onClick={() => handleAddFavorite(result.imdbID, result.Title, result.Year, 'Achat futur')}
                      className="btn-secondary"
                    >
                      🛒 À acheter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="favorites-view">
            <h2>❤️ Mes Favoris</h2>
            {favorites.length === 0 ? (
              <p className="empty-state">Vous n'avez pas encore d'éléments dans vos favoris.</p>
            ) : (
              <div className="favorites-grid">
                {favorites.map(fav => (
                  <div key={fav._id} className={`favorite-card type-${fav.favoriteType.toLowerCase().replace(' ', '-')}`}>
                    <h4>{fav.title}</h4>
                    {fav.artist && <p>🎤 {fav.artist}</p>}
                    <p>🏷️ {fav.favoriteType}</p>
                    <button 
                      onClick={() => favoriteService.removeFavorite(fav._id).then(loadFavorites)}
                      className="btn-danger"
                    >
                      ❌ Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AddCDForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    releaseYear: '',
    imdbId: '',
    condition: 'Très bon',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.artist.trim()) {
      alert('Le titre et l\'artiste sont obligatoires');
      return;
    }
    onSubmit(formData);
    setFormData({ title: '', artist: '', releaseYear: '', imdbId: '', condition: 'Très bon', notes: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="add-cd-form">
      <input 
        type="text" 
        name="title" 
        placeholder="Titre du disque *" 
        value={formData.title} 
        onChange={handleChange} 
        required 
      />
      <input 
        type="text" 
        name="artist" 
        placeholder="Artiste/Groupe *" 
        value={formData.artist} 
        onChange={handleChange} 
        required 
      />
      <input 
        type="number" 
        name="releaseYear" 
        placeholder="Année de sortie" 
        value={formData.releaseYear} 
        onChange={handleChange} 
      />
      <input 
        type="text" 
        name="imdbId" 
        placeholder="ID IMDB (optionnel)" 
        value={formData.imdbId} 
        onChange={handleChange} 
      />
      <select name="condition" value={formData.condition} onChange={handleChange}>
        <option>Neuf</option>
        <option>Très bon</option>
        <option>Bon</option>
        <option>Acceptable</option>
        <option>Mauvais</option>
      </select>
      <textarea 
        name="notes" 
        placeholder="Notes supplémentaires (optionnel)"
        value={formData.notes} 
        onChange={handleChange}
        rows="3"
      ></textarea>
      <button type="submit" className="btn-primary">➕ Ajouter CD</button>
    </form>
  );
}


