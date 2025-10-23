import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePizza, useCart } from '../hooks';

const Pizza = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPizzaById } = usePizza();
  const { addToCart, isInCart, getProductQuantity } = useCart();
  
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchPizza = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getPizzaById(id);
        setPizza(data);
      } catch (error) {
        console.error("Error fetching pizza:", error);
        setError(error.response?.data?.message || 'Error al cargar la pizza');
      } finally {
        setLoading(false);
      }
    };

    fetchPizza();
  }, [id, getPizzaById]);

  const handleAddToCart = () => {
    if (pizza) {
      addToCart(pizza);
      setAddedToCart(true);
      
      // Ocultar mensaje después de 2 segundos
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    }
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '20px', fontSize: '18px' }}>Cargando pizza...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        minHeight: '50vh'
      }}>
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '30px',
          borderRadius: '8px',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h2>⚠️ Error</h2>
          <p style={{ fontSize: '16px', margin: '20px 0' }}>{error}</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  if (!pizza) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        minHeight: '50vh'
      }}>
        <h2>No se encontró la pizza</h2>
        <button 
          onClick={() => navigate('/')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  const inCart = isInCart(pizza.id);
  const quantity = getProductQuantity(pizza.id);

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
      {/* Botón volver */}
      <button 
        onClick={() => navigate('/')}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ← Volver
      </button>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
      className="pizza-detail-grid"
      >
        {/* Imagen */}
        <div>
          <img 
            src={pizza.img} 
            alt={pizza.name}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '10px',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Información */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              marginBottom: '10px',
              color: '#333'
            }}>
              {pizza.name}
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: '#666',
              lineHeight: '1.6'
            }}>
              {pizza.desc}
            </p>
          </div>

          {/* Ingredientes */}
          <div>
            <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>
              🍕 Ingredientes:
            </h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {pizza.ingredients.map((ingredient, index) => (
                <li 
                  key={index}
                  style={{
                    backgroundColor: '#f8f9fa',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    color: '#495057'
                  }}
                >
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Precio y acciones */}
          <div style={{ 
            borderTop: '2px solid #dee2e6',
            paddingTop: '20px',
            marginTop: 'auto'
          }}>
            <p style={{ 
              fontSize: '32px', 
              fontWeight: 'bold',
              color: '#28a745',
              marginBottom: '20px'
            }}>
              ${pizza.price.toLocaleString()}
            </p>

            {inCart && (
              <p style={{ 
                color: '#007bff', 
                fontSize: '14px',
                marginBottom: '10px'
              }}>
                ✓ {quantity} {quantity === 1 ? 'unidad' : 'unidades'} en el carrito
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  minWidth: '150px',
                  padding: '15px 30px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
              >
                🛒 Añadir al Carrito
              </button>

              {inCart && (
                <button
                  onClick={handleGoToCart}
                  style={{
                    flex: 1,
                    minWidth: '150px',
                    padding: '15px 30px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Ver Carrito
                </button>
              )}
            </div>

            {/* Mensaje de confirmación */}
            {addedToCart && (
              <div style={{
                marginTop: '15px',
                padding: '12px',
                backgroundColor: '#d4edda',
                color: '#155724',
                borderRadius: '5px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                ✓ Agregado al carrito exitosamente
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pizza;