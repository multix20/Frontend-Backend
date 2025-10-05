import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignInAlt, faCartShopping, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';


const Navbar = () => {
    const { getTotal } = useContext(CartContext);
    const { token, logout } = useContext(UserContext);
    const totalPrice = getTotal();
    const navigate = useNavigate(); 

    const handleLogout = () => {
        logout();  // 
        navigate('/');  
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Mamma Mía
            </Link>
            <ul className="navbar-menu">
                <li>
                    <Link to="/">
                        <FontAwesomeIcon icon={faHome} /> Inicio
                    </Link>
                </li>

                {token ? (
                    <>
                        <li>
                            <Link to="/profile">
                                <FontAwesomeIcon icon={faUser} /> Perfil
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
            <Link to="/cart" className="btn">
                <FontAwesomeIcon icon={faCartShopping} /> Total: ${totalPrice.toFixed(2)}
            </Link>
        </nav>
    );
};

export default Navbar;
