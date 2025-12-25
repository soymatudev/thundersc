const express = require('express');
const router = express.Router();

const { login, logout, register, profile, updateUsuario } = require('../controllers/auth.controller');

router.post('/login', login);

router.post('/logout', logout);

router.post('/register', register);

router.get('/profile', profile);

router.put('/profile/:cve', updateUsuario);

module.exports = router;