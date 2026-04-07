const express = require('express');
const borrowController = require('../controllers/borrowController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/borrow', authMiddleware, borrowController.borrowCD);
router.put('/return/:borrowId', authMiddleware, borrowController.returnCD);
router.get('/my-borrows', authMiddleware, borrowController.getBorrows);

module.exports = router;
