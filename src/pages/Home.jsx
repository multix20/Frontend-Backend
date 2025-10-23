import React from 'react';
import CardPizza from '../components/CardPizza';
import { usePizza } from '../hooks';

function Home() {
  const { pizzas, loading, error, refreshPizzas } = usePizza();

  // Mostrar loading
  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '20px', fontSize: '18px' }}>Cargando pizzas deliciosas...</p>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h3>⚠️ Error al cargar las pizzas</h3>
          <p>{error}</p>
          <button 
            onClick={refreshPizzas}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  // Mostrar si no hay pizzas
  if (!pizzas || pizzas.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>No hay pizzas disponibles en este momento</h2>
        <p>Por favor, vuelve más tarde.</p>
        <button 
          onClick={refreshPizzas}
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Refrescar
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header con título y botón de refresh */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h2 className="section-title">
          Nuestras Pizzas 🍕
          <span style={{ 
            fontSize: '16px', 
            color: '#666', 
            marginLeft: '10px',
            fontWeight: 'normal'
          }}>
            ({pizzas.length} disponibles)
          </span>
        </h2>
        <button 
          onClick={refreshPizzas}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          title="Refrescar lista de pizzas"
        >
          🔄 Refrescar
        </button>
      </div>

      {/* Grid de pizzas */}
      <div className="row">
        {pizzas.map(pizza => (
          <div key={pizza.id || pizza._id} className="col-md-4 mb-4">
            <CardPizza pizza={pizza} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;