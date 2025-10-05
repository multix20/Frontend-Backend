import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Asegúrate de que la ruta sea correcta

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(UserContext); // Obtener el token desde UserContext

    // Si no hay token (usuario no autenticado), redirige al login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Si el usuario está autenticado, renderiza el componente hijo
    return children;
};

export default ProtectedRoute;
