import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUser, 
  faSignInAlt, 
  faCartShopping, 
  faSignOutAlt,
  faCrown 
} from '@fortawesome/free-solid-svg-icons';
import { useCart, useAuth } from '../hooks';

const Navbar = () => {
  const { getTotal, getTotalQuantity } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const totalPrice = getTotal();
  const totalItems = getTotalQuantity();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Mamma Mía 🍕
      </Link>
      
      <ul className="navbar-menu">
        <li>
          <Link to="/">
            <FontAwesomeIcon icon={faHome} /> Inicio
          </Link>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <Link to="/profile">
                <FontAwesomeIcon icon={faUser} /> 
                {user?.name ? ` ${user.name}` : ' Perfil'}
                {user?.role === 'admin' && (
                  <FontAwesomeIcon 
                    icon={faCrown} 
                    style={{ marginLeft: '5px', color: '#FFD700' }} 
                    title="Administrador"
                  />
                )}
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="btn-link">
                <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar sesión
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register">
                <FontAwesomeIcon icon={faUser} /> Registrarse
              </Link>
            </li>
            <li>
              <Link to="/login">
                <FontAwesomeIcon icon={faSignInAlt} /> Iniciar sesión
              </Link>
            </li>
          </>
        )}
      </ul>

      <Link to="/cart" className="btn cart-btn">
        <FontAwesomeIcon icon={faCartShopping} />
        {totalItems > 0 && (
          <span className="cart-badge">{totalItems}</span>
        )}
        <span style={{ marginLeft: '8px' }}>
          ${totalPrice.toLocaleString()}
        </span>
      </Link>
    </nav>
  );
};

export default Navbar;