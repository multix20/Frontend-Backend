const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true // ✅ Esto ya crea el índice automáticamente
  },
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  ingredients: [{
    type: String,
    required: true
  }],
  img: {
    type: String,
    required: [true, 'La imagen es requerida']
  },
  desc: {
    type: String,
    required: [true, 'La descripción es requerida']
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice para búsquedas más rápidas
pizzaSchema.index({ name: 1 });
// ❌ ELIMINAR esta línea: pizzaSchema.index({ id: 1 });

module.exports = mongoose.model('Pizza', pizzaSchema);