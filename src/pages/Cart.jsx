import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext'; // Importar el UserContext

const Cart = () => {
    const { cart, addToCart, removeFromCart, getTotal } = useContext(CartContext);
    const { token } = useContext(UserContext); // Obtener el token desde UserContext
    const [successMessage, setSuccessMessage] = useState('');

    // Función para incrementar la cantidad de un producto en el carrito
    const incrementQuantity = (pizza) => {
        addToCart(pizza);
    };

    // Función para decrementar la cantidad de un producto en el carrito
    const decrementQuantity = (pizzaId) => {
        const pizza = cart.find(item => item.id === pizzaId);
        if (pizza && pizza.quantity > 1) {
            removeFromCart(pizzaId); // Remueve el producto
            addToCart({ ...pizza, quantity: pizza.quantity - 1 }); // Vuelve a agregarlo con la cantidad actualizada
        } else {
            removeFromCart(pizzaId);
        }
    };

    // Función para manejar el proceso de checkout
    const handleCheckout = async () => {
        if (!token) {
            alert('Por favor, inicia sesión para continuar con la compra.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/checkouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items: cart })
            });

            if (response.ok) {
                setSuccessMessage('Compra realizada con éxito');
                cart.forEach(pizza => removeFromCart(pizza.id)); // Limpiar el carrito después de la compra
            } else {
                console.error('Error al realizar la compra');
                setSuccessMessage('Error al realizar la compra, por favor intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error en el proceso de checkout:', error);
            setSuccessMessage('Error en el proceso de checkout, por favor intenta de nuevo más tarde.');
        }
    };

    return (
        <div className="cart-container">
            <h2>Tu Carrito</h2>
            {cart.length === 0 && !successMessage ? (
                <p>Tu carrito está vacío</p>
            ) : (
                <div>
                    {cart.length > 0 && cart.map((pizza) => (
                        <div key={pizza.id} className="cart-item">
                            <img src={pizza.img} alt={pizza.name} />
                            <div>
                                <h4>{pizza.name}</h4>
                                <p>Precio: ${pizza.price.toFixed(2)}</p>
                                <p>Cantidad: {pizza.quantity}</p>
                                <div className="btn-group">
                                    <button onClick={() => incrementQuantity(pizza)}>+</button>
                                    <button onClick={() => decrementQuantity(pizza.id)}>-</button>
                                    <button onClick={() => removeFromCart(pizza.id)} className="btn btn-danger">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {cart.length > 0 && <h3>Total: ${getTotal().toFixed(2)}</h3>}
                    
                    {/* Botón de pagar que se llama al proceso de checkout */}
                    {cart.length > 0 && (
                        <button
                            className="btn-pay"  // Cambiar la clase del botón a btn-pay
                            onClick={handleCheckout}
                            disabled={!token}  // Deshabilitar si el token es false
                        >
                            Pagar
                        </button>
                    )}

                    {/* Mensaje si el botón está deshabilitado */}
                    {!token && cart.length > 0 && <p style={{ color: 'red' }}>Inicia sesión para poder realizar el pago.</p>}
                    {/* Mostrar mensaje de éxito o error si la compra fue realizada */}
                    {successMessage && <p style={{ color: successMessage.includes('éxito') ? 'green' : 'red' }}>{successMessage}</p>}
                </div>
            )}
        </div>
    );
};

export default Cart;