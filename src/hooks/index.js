// src/hooks/index.js
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import { PizzaContext } from '../context/PizzaContext';

// Custom hook para autenticación
export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de UserProvider');
  }
  return context;
};

// Custom hook para acceder al contexto de usuario
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe ser usado dentro de UserProvider');
  }
  return context;
};

// Custom hook para acceder al contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

// Custom hook para acceder al contexto de pizzas
export const usePizzas = () => {
  const context = useContext(PizzaContext);
  if (!context) {
    throw new Error('usePizzas debe ser usado dentro de PizzaProvider');
  }
  return context;
};

// Alias para compatibilidad (singular)
export const usePizza = usePizzas;
