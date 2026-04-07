const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imdbId: {
    type: String,
    required: true
  },
  title: String,
  artist: String,
  imdbData: Object,
  favoriteType: {
    type: String,
    enum: ['Favoris', 'Achat futur', 'Écouté'],
    default: 'Favoris'
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Favorite', favoriteSchema);
