import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(UserContext); // Obtener el token desde el UserContext

    // Si el token es false, redirige al usuario a /login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Si el token es true, renderiza el componente que se pasa como children
    return children;
};

export default ProtectedRoute;
