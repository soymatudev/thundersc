const express = require('express');
const router = express.Router();
const { z } = require('zod');

const { login, logout, register, profile, updateUsuario } = require('./auth.controller');
const authMiddleware = require('../../shared/middleware/auth.middleware');
const validate = require('../../shared/middleware/validate.middleware');

// Validation schema for the login request
const loginSchema = z.object({
    username: z.string().min(1, { message: "El nombre de usuario es requerido." }),
    password: z.string().min(1, { message: "La contraseña es requerida." }),
});

router.post('/login', validate(loginSchema), login);

router.post('/logout', logout);

router.post('/register', register);

// Apply the authentication middleware to this route
router.get('/profile', authMiddleware, profile);

router.put('/profile/:cve', authMiddleware, updateUsuario); // Also protect the update route

module.exports = router;