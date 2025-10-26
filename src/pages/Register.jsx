import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Todos los campos son requeridos');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    try {
      setLoading(true);
      console.log('📝 Intentando registrar:', { 
        email: formData.email, 
        name: formData.name 
      });

      // Llamar a la función de registro del contexto
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name || formData.email.split('@')[0]
      });

      console.log('✅ Registro exitoso');
      
      // Redirigir al home
      navigate('/');
    } catch (err) {
      console.error('❌ Error en registro:', err);
      console.error('📋 Error completo:', err.response?.data);
      
      setError(
        err.response?.data?.message || 
        'Error al registrar usuario. Por favor intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">
                🍕 Registro
              </h2>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError('')}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nombre (opcional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    disabled={loading}
                  />
                  <small className="text-muted">
                    Si no lo ingresas, usaremos tu email
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmar Contraseña *
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Registrando...
                    </>
                  ) : (
                    'Registrarse'
                  )}
                </button>

                <div className="text-center">
                  <small className="text-muted">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Inicia sesión aquí
                    </Link>
                  </small>
                </div>
              </form>
            </div>
          </div>

          {/* Card de prueba rápida (solo desarrollo) */}
          {import.meta.env.DEV && (
            <div className="card mt-3 border-info">
              <div className="card-body p-3">
                <h6 className="card-title text-info mb-2">
                  🧪 Datos de prueba
                </h6>
                <small className="d-block text-muted">
                  Email: test{Math.floor(Math.random() * 1000)}@test.com
                </small>
                <small className="d-block text-muted">
                  Contraseña: 123456
                </small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;