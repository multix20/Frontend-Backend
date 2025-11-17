import React, { createContext, useState, useEffect } from 'react';
import API_URL from '../config/api';

export const PizzaContext = createContext();

export const PizzaProvider = ({ children }) => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      console.log('🔄 Fetching pizzas from:', `${API_URL}/api/pizzas`);
      setLoading(true);
      const response = await fetch(`${API_URL}/api/pizzas`);
      
      if (!response.ok) {
        throw new Error('Error al cargar las pizzas');
      }
      
      const data = await response.json();
      console.log('📦 Data recibida:', data);
      console.log('🍕 Pizzas:', data.pizzas);
      
      // CORRECCIÓN: usar data.pizzas en lugar de data.data
      setPizzas(data.pizzas || []);
      setError(null);
    } catch (error) {
      console.error('❌ Error fetching pizzas:', error);
      setError(error.message);
      setPizzas([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PizzaContext.Provider value={{ pizzas, loading, error, fetchPizzas }}>
      {children}
    </PizzaContext.Provider>
  );
};
