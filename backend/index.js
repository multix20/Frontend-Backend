require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
const requestLogger = require('./middlewares/logger');

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
// CORS configurado con variable de entorno
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

// ============================================
// CONFIGURACIÓN DE SWAGGER
// ============================================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pizzería Mamma Mia API',
      version: '2.0.0',
      description: 'API REST para la gestión de la pizzería Mamma Mia',
      contact: {
        name: 'Soporte API',
        email: 'soporte@mammamia.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.mammamia.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Pizza: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Napolitana' },
            description: { type: 'string', example: 'Pizza clásica italiana' },
            price: { type: 'number', example: 5950 },
            img: { type: 'string', example: 'https://example.com/pizza.jpg' },
            ingredients: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['mozzarella', 'tomate', 'albahaca']
            },
            deleted: { type: 'boolean', example: false }
          }
        },
        Checkout: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string', description: 'ID del usuario' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  pizza: { type: 'string', description: 'ID de la pizza' },
                  quantity: { type: 'number', example: 2 }
                }
              }
            },
            total: { type: 'number', example: 11900 },
            status: { 
              type: 'string', 
              enum: ['pending', 'completed', 'cancelled'],
              example: 'pending'
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Error message' },
            message: { type: 'string', example: 'Detailed error description' }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación y gestión de usuarios'
      },
      {
        name: 'Pizzas',
        description: 'Endpoints para gestión de pizzas'
      },
      {
        name: 'Checkouts',
        description: 'Endpoints para órdenes y checkout'
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Ruta de documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Mamma Mia API Docs',
  customfavIcon: '/favicon.ico'
}));

// Ruta para obtener el JSON de Swagger
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ============================================
// RUTAS
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: 'API Pizzería Mamma Mia',
    version: '2.0.0',
    environment: process.env.NODE_ENV,
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      pizzas: '/api/pizzas',
      auth: '/api/auth',
      checkout: '/api/checkouts'
    },
    availableEndpoints: {
      pizzas: {
        'GET /api/pizzas': 'Listar todas las pizzas disponibles',
        'GET /api/pizzas/:id': 'Obtener pizza por ID',
        'POST /api/pizzas': 'Crear pizza (Admin)',
        'PUT /api/pizzas/:id': 'Actualizar pizza (Admin)',
        'DELETE /api/pizzas/:id': 'Eliminar pizza (Admin)',
        'PATCH /api/pizzas/:id/restore': 'Restaurar pizza (Admin)'
      },
      auth: {
        'POST /api/auth/register': 'Registrar usuario',
        'POST /api/auth/login': 'Iniciar sesión',
        'GET /api/auth/profile': 'Obtener perfil (Auth)',
        'PUT /api/auth/profile': 'Actualizar perfil (Auth)',
        'PUT /api/auth/change-password': 'Cambiar contraseña (Auth)'
      },
      checkout: {
        'POST /api/checkouts': 'Crear orden',
        'GET /api/checkouts': 'Listar órdenes (Auth)',
        'GET /api/checkouts/:id': 'Obtener orden (Auth)',
        'PATCH /api/checkouts/:id/status': 'Actualizar estado (Admin)',
        'DELETE /api/checkouts/:id': 'Cancelar orden (Auth)'
      }
    }
  });
});

// Rutas de la API
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/checkouts', checkoutRoutes);

// ============================================
// MANEJO DE RUTAS NO ENCONTRADAS (404)
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.url,
    message: 'El endpoint solicitado no existe',
    documentation: `http://localhost:${PORT}/api-docs`
  });
});

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      message: 'El token de autenticación no es válido'
    });
  }
  
  // Error de JWT expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado',
      message: 'El token de autenticación ha expirado'
    });
  }
  
  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      message: err.message
    });
  }
  
  // Error genérico
  res.status(err.status || 500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error inesperado'
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`✅ Servidor backend corriendo`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📚 Docs: http://localhost:${PORT}/api-docs`);
  console.log(`🍕 Pizzas: http://localhost:${PORT}/api/pizzas`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`🛒 Checkout: http://localhost:${PORT}/api/checkouts`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
  console.log('='.repeat(50));
});