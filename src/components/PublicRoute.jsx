import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';

/**
 * Componente para rutas públicas (Login, Register)
 * Redirige al home si el usuario ya está autenticado
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh' 
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  // Si está autenticado, redirigir al home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si no está autenticado, mostrar el componente
  return children;
};

export default PublicRoute;