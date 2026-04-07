const CD = require('../models/CD');
const axios = require('axios');

exports.addCD = async (req, res) => {
  try {
    const { title, artist, releaseYear, imdbId, condition, notes } = req.body;

    const cdData = {
      userId: req.userId,
      title,
      artist,
      releaseYear,
      imdbId,
      condition: condition || 'Très bon',
      notes
    };

    // Récupérer les données IMDB si disponible
    if (imdbId) {
      try {
        const imdbData = await axios.get(`http://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`);
        cdData.imdbData = imdbData.data;
      } catch (err) {
        console.log('Erreur lors de la récupération des données IMDB');
      }
    }

    const newCD = await CD.create(cdData);
    res.status(201).json(newCD);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du CD', error: error.message });
  }
};

exports.getUserCDs = async (req, res) => {
  try {
    const cds = await CD.find({ userId: req.userId });
    res.status(200).json(cds);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des CDs', error: error.message });
  }
};

exports.deleteCD = async (req, res) => {
  try {
    const { cdId } = req.params;
    const cd = await CD.findOne({ _id: cdId, userId: req.userId });

    if (!cd) {
      return res.status(404).json({ message: 'CD non trouvé' });
    }

    await CD.deleteOne({ _id: cdId });
    res.status(200).json({ message: 'CD supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du CD', error: error.message });
  }
};

exports.searchCDs = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Paramètre de recherche requis' });
    }

    // Rechercher dans OMDB
    const response = await axios.get(`http://www.omdbapi.com/?s=${q}&type=music&apikey=${process.env.OMDB_API_KEY}`);
    
    if (response.data.Search) {
      res.status(200).json(response.data.Search);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la recherche', error: error.message });
  }
};
