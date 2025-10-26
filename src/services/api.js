import axios from 'axios';

// Configuración de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ❌ NO HAGAS ESTO: config.data = JSON.stringify(config.data);
    // ✅ Axios ya maneja la conversión automáticamente
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth services
export const authService = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (userData) => api.put('/api/auth/profile', userData),
  changePassword: (passwords) => api.put('/api/auth/change-password', passwords)
};

// Pizza services
export const pizzaService = {
  getAll: () => api.get('/api/pizzas'),
  getById: (id) => api.get(`/api/pizzas/${id}`),
  create: (pizzaData) => api.post('/api/pizzas', pizzaData),
  update: (id, pizzaData) => api.put(`/api/pizzas/${id}`, pizzaData),
  delete: (id) => api.delete(`/api/pizzas/${id}`)
};

// Checkout services
export const checkoutService = {
  create: (orderData) => api.post('/api/checkouts', orderData),
  getAll: () => api.get('/api/checkouts'),
  getById: (id) => api.get(`/api/checkouts/${id}`),
  updateStatus: (id, status) => api.patch(`/api/checkouts/${id}/status`, { status }),
  cancel: (id) => api.delete(`/api/checkouts/${id}`)
};

// Alias para compatibilidad
export const orderService = checkoutService;