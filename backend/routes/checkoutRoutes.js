const express = require('express');
const router = express.Router();
const { 
  createCheckout, 
  getOrders, 
  getOrderById, 
  updateOrderStatus,
  cancelOrder
} = require('../controllers/checkoutController');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/authMiddleware');

// POST /api/checkouts - Crear orden
router.post('/', optionalAuth, createCheckout);

// GET /api/checkouts - Listar órdenes
router.get('/', authenticateToken, getOrders);

// GET /api/checkouts/:id - Obtener orden específica
router.get('/:id', authenticateToken, getOrderById);

// DELETE /api/checkouts/:id - Cancelar orden
router.delete('/:id', authenticateToken, cancelOrder);

// PATCH /api/checkouts/:id/status - Actualizar estado (Admin)
router.patch('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);

module.exports = router;