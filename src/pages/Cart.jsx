import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../hooks';
import { orderService } from '../services/api';

const Cart = () => {
  const { 
    cart, 
    increaseQuantity, 
    decreaseQuantity, 
    removeFromCart, 
    getTotal, 
    clearCart,
    getCartForCheckout 
  } = useCart();
  
  const { token, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Datos de entrega (opcional para usuarios no autenticados)
  const [deliveryData, setDeliveryData] = useState({
    email: user?.email || '',
    street: '',
    city: '',
    postalCode: '',
    phone: '',
    notes: '',
  });
  
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);

  // Manejar cambios en el formulario de entrega
  const handleDeliveryChange = (e) => {
    setDeliveryData({
      ...deliveryData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para manejar el proceso de checkout
  const handleCheckout = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    // Si no está autenticado, mostrar formulario de entrega
    if (!isAuthenticated) {
      if (!showDeliveryForm) {
        setShowDeliveryForm(true);
        return;
      }
      
      // Validar datos de entrega
      if (!deliveryData.email || !deliveryData.street || !deliveryData.city || 
          !deliveryData.postalCode || !deliveryData.phone) {
        setErrorMessage('Por favor completa todos los campos de entrega');
        return;
      }
    }

    setLoading(true);

    try {
      // Preparar datos de la orden
      const orderData = {
        items: getCartForCheckout(),
        email: deliveryData.email || user?.email,
        deliveryAddress: {
          street: deliveryData.street,
          city: deliveryData.city,
          postalCode: deliveryData.postalCode,
          phone: deliveryData.phone,
        },
        paymentMethod: 'cash', // Por defecto, puedes agregar selector
        notes: deliveryData.notes,
      };

      // Crear orden
      const response = await orderService.create(orderData);

      if (response.success) {
        setSuccessMessage(`¡Compra realizada con éxito! Número de orden: ${response.order._id}`);
        clearCart(); // Limpiar el carrito
        setShowDeliveryForm(false);
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setErrorMessage('Error al procesar la orden');
      }
    } catch (error) {
      console.error('Error en checkout:', error);
      setErrorMessage(
        error.response?.data?.message || 
        'Error al procesar la compra. Por favor intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Si hay mensaje de éxito, mostrar solo eso
  if (successMessage) {
    return (
      <div className="cart-container">
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          backgroundColor: '#d4edda',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <h2 style={{ color: '#155724' }}>✓ {successMessage}</h2>
          <p>Redirigiendo al inicio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Tu Carrito</h2>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Tu carrito está vacío</p>
          <button onClick={() => navigate('/')}>
            Ver Pizzas
          </button>
        </div>
      ) : (
        <div>
          {/* Items del carrito */}
          {cart.map((pizza) => (
            <div key={pizza.id} className="cart-item">
              <img src={pizza.img} alt={pizza.name} style={{ width: '100px' }} />
              <div>
                <h4>{pizza.name}</h4>
                <p>Precio: ${pizza.price.toLocaleString()}</p>
                <p>Cantidad: {pizza.quantity}</p>
                <p><strong>Subtotal: ${(pizza.price * pizza.quantity).toLocaleString()}</strong></p>
                
                <div className="btn-group" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => increaseQuantity(pizza.id)}>+</button>
                  <button onClick={() => decreaseQuantity(pizza.id)}>-</button>
                  <button 
                    onClick={() => removeFromCart(pizza.id)} 
                    className="btn btn-danger"
                    style={{ backgroundColor: '#dc3545', color: 'white' }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Total */}
          <div style={{ 
            borderTop: '2px solid #ddd', 
            marginTop: '20px', 
            paddingTop: '20px' 
          }}>
            <h3>Total: ${getTotal().toLocaleString()}</h3>
          </div>

          {/* Formulario de entrega para usuarios no autenticados */}
          {showDeliveryForm && !isAuthenticated && (
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '8px',
              marginTop: '20px' 
            }}>
              <h3>Datos de Entrega</h3>
              <form>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={deliveryData.email}
                    onChange={handleDeliveryChange}
                    required
                  />
                </div>
                <div>
                  <label>Dirección:</label>
                  <input
                    type="text"
                    name="street"
                    value={deliveryData.street}
                    onChange={handleDeliveryChange}
                    placeholder="Calle y número"
                    required
                  />
                </div>
                <div>
                  <label>Ciudad:</label>
                  <input
                    type="text"
                    name="city"
                    value={deliveryData.city}
                    onChange={handleDeliveryChange}
                    required
                  />
                </div>
                <div>
                  <label>Código Postal:</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={deliveryData.postalCode}
                    onChange={handleDeliveryChange}
                    required
                  />
                </div>
                <div>
                  <label>Teléfono:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryData.phone}
                    onChange={handleDeliveryChange}
                    placeholder="+56912345678"
                    required
                  />
                </div>
                <div>
                  <label>Notas (opcional):</label>
                  <textarea
                    name="notes"
                    value={deliveryData.notes}
                    onChange={handleDeliveryChange}
                    placeholder="Instrucciones especiales de entrega"
                    rows="3"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Botón de pagar */}
          <div style={{ marginTop: '20px' }}>
            <button
              className="btn-pay"
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '18px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Procesando...' : 
               showDeliveryForm ? 'Confirmar Compra' : 
               isAuthenticated ? 'Pagar' : 'Continuar con la Compra'}
            </button>

            {/* Mensaje informativo */}
            {!isAuthenticated && !showDeliveryForm && (
              <p style={{ 
                color: '#6c757d', 
                textAlign: 'center', 
                marginTop: '10px',
                fontSize: '14px'
              }}>
                Puedes comprar sin iniciar sesión
              </p>
            )}
          </div>

          {/* Mensajes de error */}
          {errorMessage && (
            <p style={{ 
              color: 'red', 
              backgroundColor: '#f8d7da',
              padding: '10px',
              borderRadius: '5px',
              marginTop: '10px'
            }}>
              {errorMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;