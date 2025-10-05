import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; 
import Register from './Register'; 

const RegisterRedirect = () => {
    const { token } = useContext(UserContext);

   
    if (token) {
        return <Navigate to="/" />;
    }


    return <Register />;
};

export default RegisterRedirect;
