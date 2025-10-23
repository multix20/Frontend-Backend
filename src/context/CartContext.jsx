import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Cargar carrito desde localStorage al iniciar
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Agregar producto al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Verificar si el producto ya existe en el carrito
      const existingProductIndex = prevCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex !== -1) {
        // Si existe, incrementar la cantidad
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: updatedCart[existingProductIndex].quantity + 1,
        };
        return updatedCart;
      } else {
        // Si no existe, agregarlo con cantidad 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remover producto del carrito completamente
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Incrementar cantidad de un producto
  const increaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrementar cantidad de un producto
  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity - 1;
            // Si la cantidad llega a 0, se eliminará en el filter siguiente
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  // Actualizar cantidad directamente
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Obtener cantidad total de productos
  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Obtener total del carrito
  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Limpiar carrito
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return cart.some((item) => item.id === productId);
  };

  // Obtener cantidad de un producto específico
  const getProductQuantity = (productId) => {
    const product = cart.find((item) => item.id === productId);
    return product ? product.quantity : 0;
  };

  // Formatear el carrito para enviar al backend
  const getCartForCheckout = () => {
    return cart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        getTotalQuantity,
        getTotal,
        clearCart,
        isInCart,
        getProductQuantity,
        getCartForCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};