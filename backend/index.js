require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
const requestLogger = require('./middleware/logger');

// Importar rutas
const pizzaRoutes = require('./routes/pizzaRoutes');
const authRoutes = require('./routes/authRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CONECTAR A BASE DE DATOS
// ============================================
connectDB();

// ============================================
// MIDDLEWARES GLOBALES
// ============================================
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://frontend-backend-phi.vercel.app',
      'https://frontend-backend-git-main-multix20s-projects.vercel.app',
      /https:\/\/frontend-backend-.*\.vercel\.app$/
    ];
    
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

// ============================================
// RUTAS
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: 'API Pizzería Mamma Mia',
    version: '2.0.0',
    environment: process.env.NODE_ENV,
    endpoints: {
      pizzas: '/api/pizzas',
      auth: '/api/auth',
      checkout: '/api/checkouts',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/pizzas', pizzaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/checkouts', checkoutRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.url
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error'
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
  console.log(`🛒 Checkout: http://localhost:${PORT}/api/checkouts`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
  console.log('='.repeat(50));
});
