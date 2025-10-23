import { createContext, useState, useEffect } from 'react';
import { pizzaService } from '../services/api';

export const PizzaContext = createContext();

export const PizzaProvider = ({ children }) => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar pizzas al montar el componente
  useEffect(() => {
    fetchPizzas();
  }, []);

  // Obtener todas las pizzas
  const fetchPizzas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await pizzaService.getAll();
      setPizzas(data.pizzas || data);
    } catch (error) {
      console.error('Error al cargar pizzas:', error);
      setError('Error al cargar las pizzas');
      setPizzas([]);
    } finally {
      setLoading(false);
    }
  };

  // Obtener una pizza por ID
  const getPizzaById = async (id) => {
    try {
      const data = await pizzaService.getById(id);
      return data.pizza || data;
    } catch (error) {
      console.error('Error al cargar pizza:', error);
      throw error;
    }
  };

  // Crear pizza (solo admin)
  const createPizza = async (pizzaData) => {
    try {
      const data = await pizzaService.create(pizzaData);
      // Agregar la nueva pizza al estado
      setPizzas([...pizzas, data.pizza]);
      return { success: true, pizza: data.pizza };
    } catch (error) {
      console.error('Error al crear pizza:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al crear pizza' 
      };
    }
  };

  // Actualizar pizza (solo admin)
  const updatePizza = async (id, pizzaData) => {
    try {
      const data = await pizzaService.update(id, pizzaData);
      // Actualizar la pizza en el estado
      setPizzas(pizzas.map(p => p.id === id ? data.pizza : p));
      return { success: true, pizza: data.pizza };
    } catch (error) {
      console.error('Error al actualizar pizza:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al actualizar pizza' 
      };
    }
  };

  // Eliminar pizza (solo admin)
  const deletePizza = async (id) => {
    try {
      await pizzaService.delete(id);
      // Remover la pizza del estado
      setPizzas(pizzas.filter(p => p.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar pizza:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al eliminar pizza' 
      };
    }
  };

  // Restaurar pizza (solo admin)
  const restorePizza = async (id) => {
    try {
      const data = await pizzaService.restore(id);
      // Actualizar la pizza en el estado
      setPizzas(pizzas.map(p => p.id === id ? data.pizza : p));
      return { success: true, pizza: data.pizza };
    } catch (error) {
      console.error('Error al restaurar pizza:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al restaurar pizza' 
      };
    }
  };

  // Refrescar pizzas
  const refreshPizzas = () => {
    fetchPizzas();
  };

  return (
    <PizzaContext.Provider
      value={{
        pizzas,
        loading,
        error,
        getPizzaById,
        createPizza,
        updatePizza,
        deletePizza,
        restorePizza,
        refreshPizzas,
      }}
    >
      {children}
    </PizzaContext.Provider>
  );
};