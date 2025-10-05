// Login de usuario
const login = (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son obligatorios.' 
      });
    }

    // TODO: En el futuro aquí validaremos contra la base de datos
    // Por ahora, cualquier email/password es válido
    
    // Simular token (más adelante implementaremos JWT real)
    const token = 'exampleToken_' + Date.now();
    
    res.status(200).json({ 
      message: 'Login exitoso',
      token,
      user: {
        email: email,
        name: 'Usuario Demo'
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al iniciar sesión',
      message: error.message 
    });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'No autorizado. Token no proporcionado.' 
      });
    }

    // TODO: En el futuro validaremos el JWT y obtendremos datos reales
    // Por ahora retornamos datos de ejemplo
    
    res.status(200).json({ 
      email: 'usuario@ejemplo.com',
      name: 'Usuario Ejemplo',
      role: 'customer'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener perfil',
      message: error.message 
    });
  }
};

// Registro de usuario
const register = (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validar campos requeridos
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, contraseña y nombre son obligatorios.' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Formato de email inválido.' 
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres.' 
      });
    }

    // TODO: En el futuro guardaremos en la base de datos
    
    const token = 'exampleToken_' + Date.now();
    
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        email,
        name
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al registrar usuario',
      message: error.message 
    });
  }
};

module.exports = {
  login,
  getProfile,
  register
};