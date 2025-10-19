const connectDB = require('./config/database');

// Conectar a MongoDB
connectDB();

const express = require('express');
const cors = require('cors');
const requestLogger = require('./middlewares/logger');

// Importar rutas
const pizzaRoutes = require('./routes/pizzaRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARES GLOBALES
// ============================================
app.use(cors());
app.use(express.json());
app.use(requestLogger); // Nuestro logger personalizado

// ============================================
// RUTAS
// ============================================
// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'API Pizzería Mamma Mia',
    version: '1.0.0',
    endpoints: {
      pizzas: '/api/pizzas',
      auth: '/api/auth'
    }
  });
});

// Rutas de pizzas
app.use('/api/pizzas', pizzaRoutes);

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// ============================================
// MANEJO DE RUTAS NO ENCONTRADAS (404)
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.url,
    message: 'El endpoint solicitado no existe'
  });
});

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`✅ Servidor backend corriendo`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🍕 Pizzas: http://localhost:${PORT}/api/pizzas`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log('='.repeat(50));
});