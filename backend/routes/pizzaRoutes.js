const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
  restorePizza
} = require('../controllers/pizzaController');

/**
 * @swagger
 * tags:
 *   name: Pizzas
 *   description: Endpoints de gestión de pizzas
 */

/**
 * @swagger
 * /api/pizzas:
 *   get:
 *     summary: Obtener todas las pizzas disponibles
 *     tags: [Pizzas]
 *     responses:
 *       200:
 *         description: Lista de pizzas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 pizzas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pizza'
 */
router.get('/', getAllPizzas);

/**
 * @swagger
 * /api/pizzas/{id}:
 *   get:
 *     summary: Obtener una pizza por ID
 *     tags: [Pizzas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la pizza
 *     responses:
 *       200:
 *         description: Pizza encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 pizza:
 *                   $ref: '#/components/schemas/Pizza'
 *       404:
 *         description: Pizza no encontrada
 */
router.get('/:id', getPizzaById);

/**
 * @swagger
 * /api/pizzas:
 *   post:
 *     summary: Crear nueva pizza (solo admin)
 *     tags: [Pizzas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - price
 *               - ingredients
 *             properties:
 *               id:
 *                 type: string
 *                 example: p007
 *               name:
 *                 type: string
 *                 example: Vegetariana
 *               price:
 *                 type: number
 *                 example: 6490
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["mozzarella", "tomate", "pimiento", "cebolla"]
 *               img:
 *                 type: string
 *                 example: https://example.com/pizza.jpg
 *               desc:
 *                 type: string
 *                 example: Pizza saludable con vegetales frescos
 *     responses:
 *       201:
 *         description: Pizza creada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Requiere permisos de administrador
 */
router.post('/', authenticateToken, requireAdmin, createPizza);

/**
 * @swagger
 * /api/pizzas/{id}:
 *   put:
 *     summary: Actualizar pizza (solo admin)
 *     tags: [Pizzas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               img:
 *                 type: string
 *               desc:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pizza actualizada
 *       404:
 *         description: Pizza no encontrada
 */
router.put('/:id', authenticateToken, requireAdmin, updatePizza);

/**
 * @swagger
 * /api/pizzas/{id}:
 *   delete:
 *     summary: Eliminar pizza (soft delete, solo admin)
 *     tags: [Pizzas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pizza eliminada
 *       404:
 *         description: Pizza no encontrada
 */
router.delete('/:id', authenticateToken, requireAdmin, deletePizza);

/**
 * @swagger
 * /api/pizzas/{id}/restore:
 *   patch:
 *     summary: Restaurar pizza eliminada (solo admin)
 *     tags: [Pizzas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pizza restaurada
 *       404:
 *         description: Pizza no encontrada
 */
router.patch('/:id/restore', authenticateToken, requireAdmin, restorePizza);

module.exports = router;