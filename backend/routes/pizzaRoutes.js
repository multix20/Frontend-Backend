const express = require('express');
const router = express.Router();
const { getAllPizzas, getPizzaById } = require('../controllers/pizzaController');

// GET /api/pizzas - Obtener todas las pizzas
router.get('/', getAllPizzas);

// GET /api/pizzas/:id - Obtener una pizza por ID
router.get('/:id', getPizzaById);

module.exports = router;