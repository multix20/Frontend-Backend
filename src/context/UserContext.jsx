import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

// Crear el contexto de usuario
export const UserContext = createContext();

// Proveedor del contexto de usuario
export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        
        // Verificar que el token siga siendo válido
        try {
          const profile = await authService.getProfile();
          setUser(profile.user);
          localStorage.setItem('user', JSON.stringify(profile.user));
        } catch (error) {
          console.error('Token inválido, limpiando sesión');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Método para registro
  const register = async (email, password, name) => {
    try {
      setError(null);
      setLoading(true);

      const data = await authService.register(email, password, name);
      
      // Guardar token y usuario
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Método para login
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const data = await authService.login(email, password);
      
      // Guardar token y usuario
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Método para logout
  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Método para obtener el perfil actualizado
  const getProfile = async () => {
    if (!token) {
      setError('Usuario no autenticado');
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      setError(null);
      const data = await authService.getProfile();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al obtener perfil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Método para actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      setLoading(true);

      const data = await authService.updateProfile(profileData);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar perfil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Método para cambiar contraseña
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      setLoading(true);

      await authService.changePassword(currentPassword, newPassword);
      return { success: true, message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cambiar contraseña';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!token && !!user;

  // Verificar si el usuario es admin
  const isAdmin = user?.role === 'admin';

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        getProfile,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;