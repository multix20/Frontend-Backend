const express = require('express');
const router = express.Router();
const { getPizzas, getPizzaById, createPizza, updatePizza, deletePizza } = require('../controllers/pizzaController');

// GET /api/pizzas - Obtener todas las pizzas
router.get('/', getPizzas);

// GET /api/pizzas/:id - Obtener una pizza por ID
router.get('/:id', getPizzaById);

// POST /api/pizzas - Crear una nueva pizza (Admin)
router.post('/', createPizza);

// PUT /api/pizzas/:id - Actualizar una pizza (Admin)
router.put('/:id', updatePizza);

// DELETE /api/pizzas/:id - Eliminar una pizza (Admin)
router.delete('/:id', deletePizza);

module.exports = router;
