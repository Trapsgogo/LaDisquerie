const mongoose = require('mongoose');

const cdSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  releaseYear: {
    type: Number
  },
  imdbId: {
    type: String
  },
  imdbData: {
    type: Object
  },
  condition: {
    type: String,
    enum: ['Neuf', 'Très bon', 'Bon', 'Acceptable', 'Mauvais'],
    default: 'Très bon'
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  notes: String
});

module.exports = mongoose.model('CD', cdSchema);
