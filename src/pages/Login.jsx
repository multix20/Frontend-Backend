import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';


const Login = () => {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Todos los campos son obligatorios');
      return;
    }

    if (password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await login(email, password);
      setMessage('Inicio de sesión exitoso');
    } catch (error) {
      setMessage('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div className="formulario">
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
