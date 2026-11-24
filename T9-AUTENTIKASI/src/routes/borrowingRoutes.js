const express = require('express');
const router = express.Router();
const { butuhLogin } = require('../middleware/auth');
const { createBorrowing } = require('../controllers/borrowingController');

router.post('/', butuhLogin, createBorrowing);

module.exports = router;