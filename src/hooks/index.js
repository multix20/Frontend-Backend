import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import { PizzaContext } from '../context/PizzaContext';

// Hook personalizado para usar el contexto de usuario
export const useAuth = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un UserProvider');
  }
  
  return context;
};

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  
  return context;
};

// Hook personalizado para usar el contexto de pizzas
export const usePizza = () => {
  const context = useContext(PizzaContext);
  
  if (!context) {
    throw new Error('usePizza debe ser usado dentro de un PizzaProvider');
  }
  
  return context;
};