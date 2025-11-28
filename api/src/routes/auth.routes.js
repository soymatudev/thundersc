const express = require('express');
const router = express.Router();

const { login, register, profile } = require('../controllers/auth.controller');

router.post('/login', login);

router.post('/register', register);

router.get('/profile', profile);

module.exports = router;