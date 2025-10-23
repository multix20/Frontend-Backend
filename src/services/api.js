import axios from 'axios';

// Configuración base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// SERVICIOS DE AUTENTICACIÓN
// ============================================

export const authService = {
  // Registro de usuario
  register: async (email, password, name) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },

  // Login de usuario
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// ============================================
// SERVICIOS DE PIZZAS
// ============================================

export const pizzaService = {
  // Obtener todas las pizzas
  getAll: async () => {
    const response = await api.get('/pizzas');
    return response.data;
  },

  // Obtener una pizza por ID
  getById: async (id) => {
    const response = await api.get(`/pizzas/${id}`);
    return response.data;
  },

  // Crear pizza (solo admin)
  create: async (pizzaData) => {
    const response = await api.post('/pizzas', pizzaData);
    return response.data;
  },

  // Actualizar pizza (solo admin)
  update: async (id, pizzaData) => {
    const response = await api.put(`/pizzas/${id}`, pizzaData);
    return response.data;
  },

  // Eliminar pizza (solo admin)
  delete: async (id) => {
    const response = await api.delete(`/pizzas/${id}`);
    return response.data;
  },

  // Restaurar pizza (solo admin)
  restore: async (id) => {
    const response = await api.patch(`/pizzas/${id}/restore`);
    return response.data;
  },
};

// ============================================
// SERVICIOS DE CHECKOUT/ÓRDENES
// ============================================

export const orderService = {
  // Crear orden
  create: async (orderData) => {
    const response = await api.post('/checkouts', orderData);
    return response.data;
  },

  // Obtener todas las órdenes del usuario (o todas si es admin)
  getAll: async () => {
    const response = await api.get('/checkouts');
    return response.data;
  },

  // Obtener una orden específica
  getById: async (id) => {
    const response = await api.get(`/checkouts/${id}`);
    return response.data;
  },

  // Actualizar estado de orden (solo admin)
  updateStatus: async (id, status) => {
    const response = await api.patch(`/checkouts/${id}/status`, { status });
    return response.data;
  },

  // Cancelar orden
  cancel: async (id) => {
    const response = await api.delete(`/checkouts/${id}`);
    return response.data;
  },
};

// Exportar la instancia de axios para casos especiales
export default api;