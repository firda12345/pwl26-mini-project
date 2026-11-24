const express = require('express');
const router = express.Router();
const { register, login, getSaya } = require('../controllers/authController');
const { butuhLogin } = require('../middleware/auth');
const { validateAuth } = require('../validators/authValidator');

router.post('/register', validateAuth, register);
router.post('/login', validateAuth, login);
router.get('/saya', butuhLogin, getSaya);

module.exports = router;