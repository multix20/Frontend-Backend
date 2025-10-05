import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { CartContext } from '../context/CartContext';

const CardPizza = ({ pizza }) => {
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = () => {
        addToCart(pizza);
        console.log('Añadiendo al carrito:', pizza);
    };

    return (
        <div className="card">
            <img src={pizza.img} alt={pizza.name} />
            <h3>{pizza.name}</h3>
            <p>{pizza.ingredients.join(', ')}</p>
            <p>Precio: ${pizza.price}</p>
            <div className="btn-group">
                <button onClick={handleAddToCart}>Añadir al carrito</button>
                {/* Botones adicionales si es necesario */}
            </div>
        </div>
    );
};

CardPizza.propTypes = {
    pizza: PropTypes.shape({
        id: PropTypes.string.isRequired,
        img: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
        price: PropTypes.number.isRequired,
    }).isRequired,
};

export default CardPizza;
