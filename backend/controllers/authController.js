const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_cambiar_en_produccion';
const JWT_EXPIRES_IN = '7d';

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario
 */
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ 
        error: 'El email ya está registrado',
        message: 'Por favor usa otro email o inicia sesión' 
      });
    }
    
    // Crear nuevo usuario (el password se hashea automáticamente en el modelo)
    const user = new User({
      email: email.toLowerCase(),
      password,
      name: name || email.split('@')[0], // Nombre por defecto
      role: 'user'
    });
    
    await user.save();
    
    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user._id.toString(),
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    console.log(`✅ Usuario registrado: ${user.email}`);
    
    // El método toJSON del modelo ya elimina el password
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Error de validación',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      error: 'Error al registrar usuario',
      message: error.message 
    });
  }
};

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }
    
    // Buscar usuario
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos' 
      });
    }
    
    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(403).json({ 
        error: 'Cuenta desactivada',
        message: 'Tu cuenta ha sido desactivada. Contacta al soporte.' 
      });
    }
    
    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos' 
      });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user._id.toString(),
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    console.log(`✅ Usuario autenticado: ${user.email}`);
    
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Error al iniciar sesión:', error.message);
    res.status(500).json({ 
      error: 'Error al iniciar sesión',
      message: error.message 
    });
  }
};

/**
 * GET /api/auth/profile
 * Obtener perfil del usuario autenticado
 * Requiere: authenticateToken middleware
 */
const getProfile = async (req, res) => {
  try {
    // req.user es agregado por el middleware authenticateToken
    const user = await User.findById(req.user.id).select('-password -__v');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    console.log(`✅ Perfil obtenido: ${user.email}`);
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener perfil',
      message: error.message 
    });
  }
};

/**
 * PUT /api/auth/profile
 * Actualizar perfil del usuario autenticado
 * Requiere: authenticateToken middleware
 */
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (email) updates.email = email.toLowerCase();
    
    // Si se intenta cambiar el email, verificar que no exista
    if (email && email.toLowerCase() !== req.user.email.toLowerCase()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ 
          error: 'El email ya está en uso' 
        });
      }
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { 
        new: true,
        runValidators: true
      }
    ).select('-password -__v');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    console.log(`✅ Perfil actualizado: ${user.email}`);
    
    res.json({
      message: 'Perfil actualizado exitosamente',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Error de validación',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      error: 'Error al actualizar perfil',
      message: error.message 
    });
  }
};

/**
 * PUT /api/auth/change-password
 * Cambiar contraseña del usuario autenticado
 * Requiere: authenticateToken middleware
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Contraseña actual y nueva son requeridas' 
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'La nueva contraseña debe tener al menos 6 caracteres' 
      });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    // Verificar contraseña actual
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Contraseña actual incorrecta' 
      });
    }
    
    // Actualizar contraseña (se hashea automáticamente en el modelo)
    user.password = newPassword;
    await user.save();
    
    console.log(`✅ Contraseña cambiada: ${user.email}`);
    
    res.json({
      message: 'Contraseña cambiada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error.message);
    res.status(500).json({ 
      error: 'Error al cambiar contraseña',
      message: error.message 
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};