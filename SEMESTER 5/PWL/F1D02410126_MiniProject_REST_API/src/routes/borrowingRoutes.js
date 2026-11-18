const express = require('express');
const router = express.Router();
const { createBorrowing } = require('../controllers/borrowingController');

router.post('/', createBorrowing);

module.exports = router;