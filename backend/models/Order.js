const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Puede ser null para usuarios no autenticados
  },
  email: {
    type: String,
    required: true
  },
  items: [{
    pizza: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pizza',
      required: true
    },
    pizzaId: String,
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La cantidad debe ser al menos 1']
    },
    subtotal: Number
  }],
  total: {
    type: Number,
    required: true,
    min: [0, 'El total no puede ser negativo']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online'],
    default: 'cash'
  },
  deliveryAddress: {
    street: String,
    city: String,
    postalCode: String,
    phone: String
  },
  notes: String
}, {
  timestamps: true
});

// Calcular total antes de guardar
orderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.total = this.items.reduce((sum, item) => {
      item.subtotal = item.price * item.quantity;
      return sum + item.subtotal;
    }, 0);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);