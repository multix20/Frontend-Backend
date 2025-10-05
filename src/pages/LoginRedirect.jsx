import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; 
import Login from './Login'; 

const LoginRedirect = () => {
    const { token } = useContext(UserContext);

   
    if (token) {
        return <Navigate to="/" />;
    }

    
    return <Login />;
};

export default LoginRedirect;
