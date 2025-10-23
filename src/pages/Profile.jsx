import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';

const Profile = () => {
  const { 
    token, 
    user, 
    loading, 
    logout, 
    getProfile, 
    updateProfile,
    changePassword 
  } = useAuth();
  
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState('');

  // Formulario de edición de perfil
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });

  // Formulario de cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    // Si no hay token, redirigir al login
    if (!loading && !token) {
      navigate('/login');
    }

    // Cargar datos del perfil si el usuario está disponible
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [token, user, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');

    const result = await updateProfile(profileData);

    if (result.success) {
      setMessage('Perfil actualizado exitosamente');
      setIsEditing(false);
    } else {
      setMessage(result.error || 'Error al actualizar perfil');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validaciones
    if (passwordData.newPassword.length < 6) {
      setMessage('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setMessage('Las contraseñas nuevas no coinciden');
      return;
    }

    const result = await changePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );

    if (result.success) {
      setMessage('Contraseña actualizada exitosamente');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } else {
      setMessage(result.error || 'Error al cambiar contraseña');
    }
  };

  if (loading) {
    return <div>Cargando información del perfil...</div>;
  }

  if (!user) {
    return <div>No se pudo cargar el perfil</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Perfil del Usuario</h2>

      {/* Información del perfil */}
      {!isEditing && !isChangingPassword && (
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Email:</strong> {user.email}</p>
          {user.name && <p><strong>Nombre:</strong> {user.name}</p>}
          <p><strong>Rol:</strong> {user.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
          <p><strong>Miembro desde:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button onClick={() => setIsEditing(true)}>
              Editar Perfil
            </button>
            <button onClick={() => setIsChangingPassword(true)}>
              Cambiar Contraseña
            </button>
            <button onClick={handleLogout} style={{ backgroundColor: '#dc3545' }}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {/* Formulario de edición de perfil */}
      {isEditing && (
        <form onSubmit={handleUpdateProfile}>
          <h3>Editar Perfil</h3>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              placeholder="tu@email.com"
              required
            />
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button type="submit">Guardar Cambios</button>
            <button 
              type="button" 
              onClick={() => {
                setIsEditing(false);
                setProfileData({
                  name: user.name || '',
                  email: user.email || '',
                });
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Formulario de cambio de contraseña */}
      {isChangingPassword && (
        <form onSubmit={handleChangePassword}>
          <h3>Cambiar Contraseña</h3>
          <div>
            <label>Contraseña Actual:</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div>
            <label>Nueva Contraseña:</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          <div>
            <label>Confirmar Nueva Contraseña:</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button type="submit">Cambiar Contraseña</button>
            <button 
              type="button" 
              onClick={() => {
                setIsChangingPassword(false);
                setPasswordData({
                  currentPassword: '',
                  newPassword: '',
                  confirmNewPassword: '',
                });
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Mensajes */}
      {message && (
        <p style={{
          color: message.includes('exitoso') ? 'green' : 'red',
          marginTop: '10px'
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Profile;