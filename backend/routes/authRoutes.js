const express = require('express');
const router = express.Router();
const { login, getProfile, register } = require('../controllers/authController');

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// POST /api/auth/register - Registrar usuario
router.post('/register', register);

// GET /api/auth/me - Obtener perfil del usuario autenticado
router.get('/me', getProfile);

module.exports = router;