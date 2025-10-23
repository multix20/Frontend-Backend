import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';

const Login = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validaciones en el frontend
    if (!formData.email || !formData.password) {
      setMessage('Todos los campos son obligatorios');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Intentar login
    const result = await login(formData.email, formData.password);

    if (result.success) {
      setMessage('¡Inicio de sesión exitoso!');
      // Redirigir al home después de 1 segundo
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      setMessage(result.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="formulario">
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            disabled={loading}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      
      {/* Mostrar mensaje de éxito o error */}
      {message && (
        <p style={{ 
          color: message.includes('exitoso') ? 'green' : 'red',
          marginTop: '10px'
        }}>
          {message}
        </p>
      )}
      
      {/* Mostrar error del context si existe */}
      {error && !message && (
        <p style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Login;