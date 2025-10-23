const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_cambiar_en_produccion';

/**
 * Middleware para verificar token JWT
 * Protege rutas que requieren autenticación
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token no proporcionado',
        message: 'Se requiere autenticación' 
      });
    }
    
    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar usuario
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        error: 'Usuario no válido o inactivo' 
      });
    }
    
    // Agregar usuario al request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    };
    
    next();
  } catch (error) {
    console.error('❌ Error en autenticación:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado',
        message: 'Por favor inicia sesión nuevamente' 
      });
    }
    
    res.status(500).json({ 
      error: 'Error en autenticación',
      message: error.message 
    });
  }
};

/**
 * Middleware para verificar que el usuario es administrador
 * Debe usarse después de authenticateToken
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Se requiere autenticación' 
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Acceso denegado',
      message: 'Se requieren permisos de administrador' 
    });
  }
  
  next();
};

/**
 * Middleware opcional de autenticación
 * No bloquea si no hay token, solo lo agrega si existe
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name
        };
      }
    }
    
    next();
  } catch (error) {
    // Si hay error, simplemente continuar sin usuario
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
};