import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    // Validaciones en el frontend
    if (!formData.email || !formData.password) {
      setMessage('Todos los campos son obligatorios');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      setIsSubmitting(false);
      return;
    }

    try {
      // ✅ CORRECCIÓN: usar try-catch porque login lanza excepciones
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      console.log('✅ Login exitoso:', result);
      setMessage('¡Inicio de sesión exitoso!');
      
      // Redirigir al home después de 1 segundo
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error en login:', error);
      
      // Extraer el mensaje de error
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Error al iniciar sesión';
      
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
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
            disabled={loading || isSubmitting}
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
            disabled={loading || isSubmitting}
            required
          />
        </div>
        <button type="submit" disabled={loading || isSubmitting}>
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      
      {/* Mostrar mensaje de éxito o error */}
      {message && (
        <p style={{ 
          color: message.includes('exitoso') ? 'green' : 'red',
          marginTop: '10px',
          fontWeight: 'bold'
        }}>
          {message}
        </p>
      )}
      
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        ¿No tienes cuenta?{' '}
        <a 
          href="/register" 
          style={{ color: '#007bff', textDecoration: 'none' }}
        >
          Regístrate aquí
        </a>
      </p>
    </div>
  );
};

export default Login;