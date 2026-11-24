const express = require('express');
const router = express.Router();
const { getAllBooks, createBook } = require('../controllers/bookController');
const { butuhLogin } = require('../middleware/auth');

router.get('/', getAllBooks);
router.post('/', butuhLogin, createBook);

module.exports = router;