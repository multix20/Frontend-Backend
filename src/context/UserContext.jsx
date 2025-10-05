import { createContext, useState } from 'react';

// Crear el contexto de usuario
const UserContext = createContext();  // Declaración del contexto de usuario

// Crear el proveedor del contexto de usuario
const UserProvider = ({ children }) => {
  // Definir los estados del token y el email del usuario autenticado
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);

  // Métodos para login, registro, logout, etc.

  // Método para login
  const login = async (userEmail, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
      });
      if (response.ok) {
        const data = await response.json();
        setToken(data.token); 
        setEmail(userEmail);  
      } else {
        console.error('Error en la autenticación');
      }
    } catch (error) {
      console.error('Error al hacer login:', error);
    }
  };

  
  const register = async (userEmail, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
      });
      if (response.ok) {
        const data = await response.json();
        setToken(data.token); // Guardar el token recibido
        setEmail(userEmail);  // Guardar el email recibido
      } else {
        console.error('Error en el registro');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  // Método para logout
  const logout = () => {
    setToken(null); // Limpiar el token
    setEmail(null); // Limpiar el email
  };

  // Método para obtener el perfil del usuario
  const getProfile = async () => {
    if (!token) {
      console.error('Usuario no autenticado');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/me', { // Cambié la URL aquí
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Perfil del usuario:', data);
      } else {
        console.error('Error al obtener el perfil del usuario');
      }
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        token,
        email,
        login,
        register,
        logout,
        getProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Exportar `UserContext` como exportación nombrada y por defecto
export { UserContext, UserProvider };
export default UserContext;  // Exportación por defecto
