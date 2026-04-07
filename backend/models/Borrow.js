const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  cdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CD',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  borrowerName: {
    type: String,
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  returnDate: Date,
  expectedReturnDate: Date,
  status: {
    type: String,
    enum: ['Emprunté', 'Retourné'],
    default: 'Emprunté'
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  notes: String
});

module.exports = mongoose.model('Borrow', borrowSchema);
