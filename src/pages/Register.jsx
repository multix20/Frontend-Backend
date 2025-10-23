import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';

function Register() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setMessage('Todos los campos son obligatorios');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    // Intentar registro
    const result = await register(
      formData.email,
      formData.password,
      formData.name || undefined
    );

    if (result.success) {
      setMessage('¡Registro exitoso! Redirigiendo...');
      // Redirigir al home después de 1 segundo
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      setMessage(result.error || 'Error al registrarse');
    }
  };

  return (
    <div className="formulario">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre (opcional):</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            disabled={loading}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            disabled={loading}
            required
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
            required
          />
        </div>
        <div>
          <label>Confirmar Contraseña:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repite tu contraseña"
            disabled={loading}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar'}
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
}

export default Register;