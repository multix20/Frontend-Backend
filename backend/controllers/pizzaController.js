const Pizza = require('../models/Pizza');

// GET /api/pizzas - Obtener todas las pizzas disponibles
const getAllPizzas = async (req, res, next) => {
  try {
    const pizzas = await Pizza.find({ available: true }).sort({ createdAt: -1 });
    
    // ⭐ FORMATO CORRECTO: devolver objeto con estructura
    res.json({
      success: true,
      count: pizzas.length,
      pizzas: pizzas  // Array de pizzas dentro del objeto
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/pizzas/:id - Obtener una pizza por ID
const getPizzaById = async (req, res, next) => {
  try {
    const pizza = await Pizza.findOne({ 
      $or: [
        { _id: req.params.id },
        { id: req.params.id }
      ],
      available: true 
    });

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: 'Pizza no encontrada'
      });
    }

    res.json({
      success: true,
      pizza: pizza
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/pizzas - Crear nueva pizza (solo admin)
const createPizza = async (req, res, next) => {
  try {
    const { id, name, price, ingredients, img, desc } = req.body;

    // Validar campos requeridos
    if (!id || !name || !price || !ingredients) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: id, name, price, ingredients'
      });
    }

    // Verificar si ya existe una pizza con ese ID
    const existingPizza = await Pizza.findOne({ id });
    if (existingPizza) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una pizza con ese ID'
      });
    }

    const pizza = await Pizza.create({
      id,
      name,
      price,
      ingredients,
      img,
      desc
    });

    res.status(201).json({
      success: true,
      message: 'Pizza creada exitosamente',
      pizza: pizza
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/pizzas/:id - Actualizar pizza (solo admin)
const updatePizza = async (req, res, next) => {
  try {
    const { name, price, ingredients, img, desc } = req.body;

    const pizza = await Pizza.findOne({
      $or: [
        { _id: req.params.id },
        { id: req.params.id }
      ]
    });

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: 'Pizza no encontrada'
      });
    }

    // Actualizar campos
    if (name) pizza.name = name;
    if (price) pizza.price = price;
    if (ingredients) pizza.ingredients = ingredients;
    if (img) pizza.img = img;
    if (desc) pizza.desc = desc;

    await pizza.save();

    res.json({
      success: true,
      message: 'Pizza actualizada exitosamente',
      pizza: pizza
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/pizzas/:id - Eliminar pizza (soft delete, solo admin)
const deletePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findOne({
      $or: [
        { _id: req.params.id },
        { id: req.params.id }
      ]
    });

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: 'Pizza no encontrada'
      });
    }

    // Soft delete
    pizza.available = false;
    await pizza.save();

    res.json({
      success: true,
      message: 'Pizza eliminada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/pizzas/:id/restore - Restaurar pizza eliminada (solo admin)
const restorePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findOne({
      $or: [
        { _id: req.params.id },
        { id: req.params.id }
      ]
    });

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: 'Pizza no encontrada'
      });
    }

    pizza.available = true;
    await pizza.save();

    res.json({
      success: true,
      message: 'Pizza restaurada exitosamente',
      pizza: pizza
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
  restorePizza
};