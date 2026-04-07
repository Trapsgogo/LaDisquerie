const express = require('express');
const promptController = require('../controllers/promptController');

const router = express.Router();

router.post('/add', promptController.addPrompt);
router.get('/all', promptController.getAllPrompts);

module.exports = router;
