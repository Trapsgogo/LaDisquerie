const express = require('express');
const cdController = require('../controllers/cdController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/add', authMiddleware, cdController.addCD);
router.get('/my-cds', authMiddleware, cdController.getUserCDs);
router.delete('/:cdId', authMiddleware, cdController.deleteCD);
router.get('/search', authMiddleware, cdController.searchCDs);

module.exports = router;
