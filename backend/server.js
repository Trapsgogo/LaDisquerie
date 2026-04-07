const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connecté');
}).catch(error => {
  console.log('Erreur MongoDB:', error);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cds', require('./routes/cd'));
app.use('/api/borrows', require('./routes/borrow'));
app.use('/api/favorites', require('./routes/favorite'));
app.use('/api/prompts', require('./routes/prompt'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Serveur en ligne' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
