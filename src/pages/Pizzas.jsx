import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Pizza = () => {
  const { id } = useParams(); // Obtiene el id de la pizza desde la URL
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPizza = async () => {
      try {
        // Asegúrate de que el id en la URL corresponda al id de la API (como p001, p002, etc.)
        const response = await fetch(`http://localhost:5000/api/pizzas/${id}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setPizza(data);
      } catch (error) {
        console.error("Error fetching pizza:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPizza();
  }, [id]);

  if (loading) {
    return <div>Cargando pizza...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!pizza) {
    return <div>No se encontró la pizza.</div>;
  }

  return (
    <div>
      <h1>{pizza.name}</h1>
      <p>{pizza.desc}</p>
      <p>Precio: ${pizza.price}</p>
      <img src={pizza.img} alt={pizza.name} />
      <h3>Ingredientes:</h3>
      <ul>
        {pizza.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </div>
  );
};

export default Pizza;
