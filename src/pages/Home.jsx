import React, { useContext } from 'react';
import CardPizza from '../components/CardPizza.jsx';
import { PizzaContext } from '../context/PizzaContext.jsx'; // Importa el PizzaContext

function Home() {
    const { pizzas } = useContext(PizzaContext); // Usa el contexto para obtener las pizzas

    return (
        <div className="container">
            <h2 className="section-title">Nuestras Pizzas</h2>
            <div className="row">
                {pizzas.map(pizza => (
                    <div key={pizza.id} className="col-md-4 mb-4">
                        <CardPizza pizza={pizza} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
