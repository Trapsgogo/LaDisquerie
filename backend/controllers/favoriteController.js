const Favorite = require('../models/Favorite');

exports.addFavorite = async (req, res) => {
  try {
    const { imdbId, title, artist, imdbData, favoriteType } = req.body;

    const favorite = await Favorite.create({
      userId: req.userId,
      imdbId,
      title,
      artist,
      imdbData,
      favoriteType: favoriteType || 'Favoris'
    });

    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout aux favoris', error: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId });
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des favoris', error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;

    const favorite = await Favorite.findOne({ _id: favoriteId, userId: req.userId });
    if (!favorite) {
      return res.status(404).json({ message: 'Favori non trouvé' });
    }

    await Favorite.deleteOne({ _id: favoriteId });
    res.status(200).json({ message: 'Favori supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du favori', error: error.message });
  }
};
