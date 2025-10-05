import React, { useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { token, email, logout, getProfile } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay token, redirigir al inicio de sesión
    if (!token) {
      navigate('/login');
    } else {
      // Si deseas obtener más datos del perfil
      getProfile();
    }
  }, [token, navigate, getProfile]);

  const handleLogout = () => {
    logout(); // Llamar al método de logout
    navigate('/'); // Redirigir al inicio después de cerrar sesión
  };

  return (
    <div>
      <h2>Perfil del Usuario</h2>
      {email ? (
        <>
          <p>Email: {email}</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      ) : (
        <p>Cargando información del perfil...</p>
      )}
    </div>
  );
};

export default Profile;
