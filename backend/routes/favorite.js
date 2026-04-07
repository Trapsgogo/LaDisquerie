const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/add', authMiddleware, favoriteController.addFavorite);
router.get('/my-favorites', authMiddleware, favoriteController.getFavorites);
router.delete('/:favoriteId', authMiddleware, favoriteController.removeFavorite);

module.exports = router;
