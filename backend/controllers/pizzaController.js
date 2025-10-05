const pizzas = require('../data/pizzas');

// Obtener todas las pizzas
const getAllPizzas = (req, res) => {
  try {
    res.status(200).json(pizzas);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener las pizzas',
      message: error.message 
    });
  }
};

// Obtener una pizza por ID
const getPizzaById = (req, res) => {
  try {
    const { id } = req.params;
    const pizza = pizzas.find(p => p.id === id);
    
    if (!pizza) {
      return res.status(404).json({ 
        error: 'Pizza no encontrada',
        id: id 
      });
    }
    
    res.status(200).json(pizza);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener la pizza',
      message: error.message 
    });
  }
};

module.exports = {
  getAllPizzas,
  getPizzaById
};