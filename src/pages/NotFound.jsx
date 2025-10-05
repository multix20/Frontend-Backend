import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h1>404 - Página no encontrada</h1>
    <p>Lo sentimos, la página que estás buscando no existe.</p>
    <Link to="/" style={{ color: '#1d72b8', textDecoration: 'none' }}>
      Volver al inicio
    </Link>
  </div>
);

export default NotFound;
