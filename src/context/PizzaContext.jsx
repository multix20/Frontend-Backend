import { createContext, useState, useContext } from 'react';
import { pizzaService } from '../services/api';

export const PizzaContext = createContext();

export const PizzaProvider = ({ children }) => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPizzas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🍕 Fetching pizzas...');
      const response = await pizzaService.getAll();
      
      console.log('📦 Response completa:', response);
      console.log('📊 Response.data:', response.data);
      
      // Manejar diferentes formatos de respuesta:
      // 1. { success: true, pizzas: [...] }
      // 2. { data: [...] }
      // 3. [...] (array directo)
      let pizzasData;
      
      if (response.data?.pizzas) {
        // Formato: { pizzas: [...] }
        pizzasData = response.data.pizzas;
      } else if (response.data?.data) {
        // Formato: { data: [...] }
        pizzasData = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Formato: [...] (array directo)
        pizzasData = response.data;
      } else {
        // Último recurso
        pizzasData = response.data;
      }
      
      console.log('🎯 Pizzas extraídas:', pizzasData);
      console.log('✅ Es array?', Array.isArray(pizzasData));
      
      // Asegurar que sea un array
      if (Array.isArray(pizzasData)) {
        setPizzas(pizzasData);
        console.log(`✅ ${pizzasData.length} pizzas cargadas`);
      } else {
        console.error('❌ pizzasData no es un array:', pizzasData);
        setPizzas([]);
        setError('Formato de datos incorrecto del servidor');
      }
    } catch (err) {
      console.error('❌ Error fetching pizzas:', err);
      console.error('📋 Error completo:', err.response?.data || err.message);
      
      setError(err.response?.data?.message || 'Error al cargar las pizzas');
      setPizzas([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPizzaById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🍕 Fetching pizza ${id}...`);
      const response = await pizzaService.getById(id);
      
      console.log('📦 Pizza response:', response);
      
      // El backend devuelve { success: true, pizza: {...} }
      const pizzaData = response.data?.pizza || response.data?.data || response.data;
      
      console.log('🎯 Pizza extraída:', pizzaData);
      
      return pizzaData;
    } catch (err) {
      console.error('❌ Error fetching pizza:', err);
      console.error('📋 Error completo:', err.response?.data || err.message);
      
      setError(err.response?.data?.message || 'Error al cargar la pizza');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    pizzas,
    loading,
    error,
    fetchPizzas,
    fetchPizzaById
  };

  return (
    <PizzaContext.Provider value={value}>
      {children}
    </PizzaContext.Provider>
  );
};

// Hook personalizado
export const usePizzaContext = () => {
  const context = useContext(PizzaContext);
  if (!context) {
    throw new Error('usePizzaContext debe usarse dentro de PizzaProvider');
  }
  return context;
};