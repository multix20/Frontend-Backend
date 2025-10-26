import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import { PizzaContext } from '../context/PizzaContext';

// Hook de autenticación
export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de UserProvider');
  }
  
  console.log('🔐 useAuth llamado:', {
    isAuthenticated: !!context.token,
    user: context.user?.email
  });
  
  return context;
};

// Hook de usuario (alias de useAuth)
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }
  return context;
};

// Hook de carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  
  console.log('🛒 useCart llamado:', {
    items: context.cart?.length || 0,
    total: context.total
  });
  
  return context;
};

// Hook de pizzas
export const usePizzas = () => {
  const context = useContext(PizzaContext);
  if (!context) {
    throw new Error('usePizzas debe usarse dentro de PizzaProvider');
  }
  
  console.log('🍕 usePizzas llamado:', {
    pizzas: context.pizzas?.length || 0,
    loading: context.loading,
    error: context.error,
    isPizzasArray: Array.isArray(context.pizzas)
  });
  
  return context;
};

// Alias para compatibilidad
export const usePizza = usePizzas;

// Debug helper
export const useDebugContexts = () => {
  const user = useUser();
  const cart = useCart();
  const pizzas = usePizzas();
  
  return {
    user: {
      isAuthenticated: !!user.token,
      email: user.user?.email
    },
    cart: {
      items: cart.cart?.length || 0,
      total: cart.total
    },
    pizzas: {
      count: pizzas.pizzas?.length || 0,
      loading: pizzas.loading,
      error: pizzas.error
    }
  };
};