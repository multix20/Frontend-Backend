const Order = require('../models/Order');
const Pizza = require('../models/Pizza');

/**
 * POST /api/checkouts
 * Crear una nueva orden
 */
const createCheckout = async (req, res) => {
  try {
    const { items, email, deliveryAddress, notes, paymentMethod } = req.body;
    
    // Validar que hay items
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        error: 'El carrito está vacío',
        message: 'Debes agregar al menos una pizza a tu orden' 
      });
    }
    
    // Validar email
    if (!email) {
      return res.status(400).json({ 
        error: 'El email es requerido' 
      });
    }
    
    // Preparar items de la orden
    const orderItems = [];
    let total = 0;
    
    for (const item of items) {
      // Buscar pizza en la base de datos
      const pizza = await Pizza.findOne({ id: item.id });
      
      if (!pizza) {
        return res.status(404).json({ 
          error: 'Pizza no encontrada',
          pizzaId: item.id 
        });
      }
      
      if (!pizza.available) {
        return res.status(410).json({ 
          error: 'Pizza no disponible',
          message: `La pizza "${pizza.name}" ya no está disponible`,
          pizzaId: item.id 
        });
      }
      
      const quantity = item.quantity || 1;
      const subtotal = pizza.price * quantity;
      
      orderItems.push({
        pizza: pizza._id,
        pizzaId: pizza.id,
        name: pizza.name,
        price: pizza.price,
        quantity: quantity,
        subtotal: subtotal
      });
      
      total += subtotal;
    }
    
    // Crear la orden
    const order = new Order({
      user: req.user ? req.user.id : null,
      email: email.toLowerCase(),
      items: orderItems,
      total: total,
      status: 'pending',
      paymentMethod: paymentMethod || 'cash',
      deliveryAddress: deliveryAddress || {},
      notes: notes || ''
    });
    
    await order.save();
    await order.populate('items.pizza', 'name img desc');
    
    console.log(`✅ Orden creada: #${order._id} - Total: $${order.total}`);
    
    res.status(201).json({
      message: 'Orden creada exitosamente',
      order: {
        id: order._id,
        email: order.email,
        items: order.items,
        total: order.total,
        status: order.status,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Error al crear orden:', error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Error de validación',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      error: 'Error al procesar la orden',
      message: error.message 
    });
  }
};

/**
 * GET /api/checkouts
 * Obtener todas las órdenes
 */
const getOrders = async (req, res) => {
  try {
    let query = {};
    
    if (req.user && req.user.role !== 'admin') {
      query = { user: req.user.id };
    }
    
    const orders = await Order.find(query)
      .populate('items.pizza', 'name img')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .select('-__v');
    
    console.log(`✅ ${orders.length} órdenes encontradas`);
    
    res.json({
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('❌ Error al obtener órdenes:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener órdenes',
      message: error.message 
    });
  }
};

/**
 * GET /api/checkouts/:id
 * Obtener una orden específica
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id)
      .populate('items.pizza', 'name img desc ingredients')
      .populate('user', 'name email')
      .select('-__v');
    
    if (!order) {
      return res.status(404).json({ 
        error: 'Orden no encontrada',
        orderId: id 
      });
    }
    
    if (req.user) {
      const isOwner = order.user && order.user._id.toString() === req.user.id;
      const isAdmin = req.user.role === 'admin';
      
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ 
          error: 'No tienes permiso para ver esta orden' 
        });
      }
    }
    
    console.log(`✅ Orden encontrada: #${order._id}`);
    res.json(order);
  } catch (error) {
    console.error('❌ Error al obtener orden:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'ID de orden inválido' 
      });
    }
    
    res.status(500).json({ 
      error: 'Error al obtener orden',
      message: error.message 
    });
  }
};

/**
 * PATCH /api/checkouts/:id/status
 * Actualizar estado de orden
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Estado inválido',
        validStatuses 
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('items.pizza', 'name')
      .populate('user', 'name email')
      .select('-__v');
    
    if (!order) {
      return res.status(404).json({ 
        error: 'Orden no encontrada',
        orderId: id 
      });
    }
    
    console.log(`✅ Orden actualizada: #${order._id} - Estado: ${status}`);
    
    res.json({
      message: 'Estado de orden actualizado',
      order
    });
  } catch (error) {
    console.error('❌ Error al actualizar orden:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'ID de orden inválido' 
      });
    }
    
    res.status(500).json({ 
      error: 'Error al actualizar orden',
      message: error.message 
    });
  }
};

/**
 * DELETE /api/checkouts/:id
 * Cancelar orden
 */
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ 
        error: 'Orden no encontrada',
        orderId: id 
      });
    }
    
    if (req.user) {
      const isOwner = order.user && order.user.toString() === req.user.id;
      const isAdmin = req.user.role === 'admin';
      
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ 
          error: 'No tienes permiso para cancelar esta orden' 
        });
      }
    }
    
    if (order.status === 'delivered') {
      return res.status(400).json({ 
        error: 'No se puede cancelar una orden ya entregada' 
      });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    console.log(`✅ Orden cancelada: #${order._id}`);
    
    res.json({
      message: 'Orden cancelada exitosamente',
      order
    });
  } catch (error) {
    console.error('❌ Error al cancelar orden:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'ID de orden inválido' 
      });
    }
    
    res.status(500).json({ 
      error: 'Error al cancelar orden',
      message: error.message 
    });
  }
};

module.exports = {
  createCheckout,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};