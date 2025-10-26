import { useEffect } from 'react';
import { usePizzas } from '../hooks';
import CardPizza from '../components/CardPizza';
import Header from '../components/Header';

const Home = () => {
  const { pizzas, loading, error, fetchPizzas } = usePizzas();

  useEffect(() => {
    fetchPizzas();
  }, []);

  // Debug: ver qué está devolviendo el hook
  console.log('Home - Estado:', { pizzas, loading, error });
  console.log('Home - pizzas es array?', Array.isArray(pizzas));

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando pizzas...</span>
          </div>
          <p className="mt-3">Cargando deliciosas pizzas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">¡Oops! Algo salió mal</h4>
          <p>{error}</p>
          <hr />
          <button 
            className="btn btn-primary" 
            onClick={fetchPizzas}
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  // Asegurar que pizzas sea siempre un array
  const pizzasList = Array.isArray(pizzas) ? pizzas : [];

  if (pizzasList.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info text-center" role="alert">
          <h4>No hay pizzas disponibles</h4>
          <p>Por favor, intenta más tarde</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header 
        title="¡Pizzería Mamma Mia!"
        subtitle="¡Tenemos las mejores pizzas que podrás encontrar!"
      />
      
      <div className="container mt-4">
        <div className="row">
          {pizzasList.map((pizza) => (
            <div key={pizza.id || pizza._id} className="col-md-4 mb-4">
              <CardPizza pizza={pizza} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;