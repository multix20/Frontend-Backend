const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword 
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario
 * Body: { email, password, name? }
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Iniciar sesión
 * Body: { email, password }
 */
router.post('/login', login);

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================

/**
 * GET /api/auth/profile
 * Obtener perfil del usuario autenticado
 * Headers: { Authorization: "Bearer <token>" }
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * PUT /api/auth/profile
 * Actualizar perfil del usuario autenticado
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { name?, email? }
 */
router.put('/profile', authenticateToken, updateProfile);

/**
 * PUT /api/auth/change-password
 * Cambiar contraseña del usuario autenticado
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { currentPassword, newPassword }
 */
router.put('/change-password', authenticateToken, changePassword);

module.exports = router;