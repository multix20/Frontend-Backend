import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al inicio si hay token
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          console.log('🔐 Cargando perfil de usuario...');
          const response = await authService.getProfile();
          console.log('✅ Usuario cargado:', response.data.user);
          setUser(response.data.user);
        } catch (error) {
          console.error('❌ Error al cargar usuario:', error);
          // Si el token es inválido, limpiar
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Función de registro
  const register = async (userData) => {
    try {
      console.log('📝 Registrando usuario:', { email: userData.email });
      
      const response = await authService.register(userData);
      
      console.log('📦 Respuesta del servidor:', response.data);
      
      const { token: newToken, user: newUser } = response.data;

      // Guardar token
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);

      console.log('✅ Registro exitoso, usuario guardado');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en register:', error);
      console.error('📋 Error response:', error.response?.data);
      throw error;
    }
  };

  // Función de login
  const login = async (credentials) => {
    try {
      console.log('🔐 Iniciando sesión:', { email: credentials.email });
      
      const response = await authService.login(credentials);
      
      console.log('📦 Respuesta del servidor:', response.data);
      
      const { token: newToken, user: newUser } = response.data;

      // Guardar token
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);

      console.log('✅ Login exitoso, usuario guardado');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error);
      console.error('📋 Error response:', error.response?.data);
      throw error;
    }
  };

  // Función de logout
  const logout = () => {
    console.log('👋 Cerrando sesión');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Función para actualizar perfil
  const updateProfile = async (userData) => {
    try {
      console.log('📝 Actualizando perfil:', userData);
      
      const response = await authService.updateProfile(userData);
      
      console.log('✅ Perfil actualizado:', response.data.user);
      
      setUser(response.data.user);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      throw error;
    }
  };

  // Función para cambiar contraseña
  const changePassword = async (passwords) => {
    try {
      console.log('🔒 Cambiando contraseña...');
      
      const response = await authService.changePassword(passwords);
      
      console.log('✅ Contraseña actualizada');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al cambiar contraseña:', error);
      throw error;
    }
  };

  const value = {
    token,
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin'
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};