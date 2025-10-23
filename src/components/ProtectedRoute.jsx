import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';

/**
 * Componente para proteger rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

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

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere admin y no es admin, redirigir al home
  if (requireAdmin && !isAdmin) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        backgroundColor: '#f8d7da',
        margin: '20px',
        borderRadius: '8px'
      }}>
        <h2 style={{ color: '#721c24' }}>Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta página.</p>
        <button onClick={() => window.history.back()}>Volver</button>
      </div>
    );
  }

  // Si todo está bien, mostrar el componente
  return children;
};

export default ProtectedRoute;