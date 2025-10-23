const Pizza = require('../models/Pizza');

/**
 * GET /api/pizzas
 * Obtener todas las pizzas disponibles
 */
const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({ available: true })
      .sort({ name: 1 })
      .select('-__v');
    
    console.log(`✅ ${pizzas.length} pizzas encontradas`);
    
    res.json(pizzas);
  } catch (error) {
    console.error('❌ Error al obtener pizzas:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener pizzas',
      message: error.message 
    });
  }
};

/**
 * GET /api/pizzas/:id
 * Obtener una pizza específica por ID
 */
const getPizzaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar por el campo 'id' personalizado (ej: 'p001')
    const pizza = await Pizza.findOne({ id }).select('-__v');
    
    if (!pizza) {
      return res.status(404).json({ 
        error: 'Pizza no encontrada',
        id: id 
      });
    }
    
    if (!pizza.available) {
      return res.status(410).json({ 
        error: 'Pizza no disponible',
        message: 'Esta pizza ya no está disponible' 
      });
    }
    
    console.log(`✅ Pizza encontrada: ${pizza.name}`);
    
    res.json(pizza);
  } catch (error) {
    console.error('❌ Error al obtener pizza:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener pizza',
      message: error.message 
    });
  }
};

/**
 * POST /api/pizzas
 * Crear una nueva pizza (Admin)
 */
const createPizza = async (req, res) => {
  try {
    const { id, name, price, ingredients, img, desc } = req.body;
    
    // Validar campos requeridos
    if (!id || !name || !price || !ingredients || !img || !desc) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos',
        required: ['id', 'name', 'price', 'ingredients', 'img', 'desc']
      });
    }
    
    // Verificar si ya existe una pizza con ese ID
    const existingPizza = await Pizza.findOne({ id });
    if (existingPizza) {
      return res.status(409).json({ 
        error: 'Ya existe una pizza con ese ID',
        id: id 
      });
    }
    
    // Crear nueva pizza
    const newPizza = new Pizza({
      id,
      name,
      price,
      ingredients,
      img,
      desc,
      available: true
    });
    
    await newPizza.save();
    
    console.log(`✅ Pizza creada: ${newPizza.name}`);
    
    res.status(201).json({
      message: 'Pizza creada exitosamente',
      pizza: newPizza
    });
  } catch (error) {
    console.error('❌ Error al crear pizza:', error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Error de validación',
        details: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Error al crear pizza',
      message: error.message 
    });
  }
};

/**
 * PUT /api/pizzas/:id
 * Actualizar una pizza existente (Admin)
 */
const updatePizza = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // No permitir cambiar el ID
    delete updates.id;
    delete updates._id;
    
    const pizza = await Pizza.findOneAndUpdate(
      { id },
      updates,
      { 
        new: true, // Retornar documento actualizado
        runValidators: true // Ejecutar validaciones
      }
    ).select('-__v');
    
    if (!pizza) {
      return res.status(404).json({ 
        error: 'Pizza no encontrada',
        id: id 
      });
    }
    
    console.log(`✅ Pizza actualizada: ${pizza.name}`);
    
    res.json({
      message: 'Pizza actualizada exitosamente',
      pizza
    });
  } catch (error) {
    console.error('❌ Error al actualizar pizza:', error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Error de validación',
        details: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Error al actualizar pizza',
      message: error.message 
    });
  }
};

/**
 * DELETE /api/pizzas/:id
 * Eliminar (soft delete) una pizza (Admin)
 */
const deletePizza = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Soft delete: solo marcar como no disponible
    const pizza = await Pizza.findOneAndUpdate(
      { id },
      { available: false },
      { new: true }
    ).select('-__v');
    
    if (!pizza) {
      return res.status(404).json({ 
        error: 'Pizza no encontrada',
        id: id 
      });
    }
    
    console.log(`✅ Pizza eliminada (soft delete): ${pizza.name}`);
    
    res.json({
      message: 'Pizza eliminada exitosamente',
      pizza
    });
  } catch (error) {
    console.error('❌ Error al eliminar pizza:', error.message);
    res.status(500).json({ 
      error: 'Error al eliminar pizza',
      message: error.message 
    });
  }
};

/**
 * PATCH /api/pizzas/:id/restore
 * Restaurar una pizza eliminada (Admin)
 */
const restorePizza = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pizza = await Pizza.findOneAndUpdate(
      { id },
      { available: true },
      { new: true }
    ).select('-__v');
    
    if (!pizza) {
      return res.status(404).json({ 
        error: 'Pizza no encontrada',
        id: id 
      });
    }
    
    console.log(`✅ Pizza restaurada: ${pizza.name}`);
    
    res.json({
      message: 'Pizza restaurada exitosamente',
      pizza
    });
  } catch (error) {
    console.error('❌ Error al restaurar pizza:', error.message);
    res.status(500).json({ 
      error: 'Error al restaurar pizza',
      message: error.message 
    });
  }
};

module.exports = {
  getPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
  restorePizza
};