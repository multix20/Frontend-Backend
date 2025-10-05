const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Datos de ejemplo de pizzas
const pizzas = [
  {
    id: "p001",
    name: "Napolitana",
    price: 5950,
    ingredients: ["mozzarella", "tomates", "jamón", "orégano"],
    img: "https://firebasestorage.googleapis.com/v0/b/apis-varias-mias.appspot.com/o/pizzeria%2Fpizza-1239077_640_cl.jpg?alt=media&token=6a9a33da-5c00-49d4-9080-784dcc87ec2c",
    desc: "La pizza napolitana, de masa tierna y delgada pero bordes altos, es la versión propia de la cocina napolitana de la pizza redonda."
  },
  {
    id: "p002",
    name: "Española",
    price: 6950,
    ingredients: ["mozzarella", "gorgonzola", "parmesano", "provolone"],
    img: "https://firebasestorage.googleapis.com/v0/b/apis-varias-mias.appspot.com/o/pizzeria%2Fcheese-164872_640_com.jpg?alt=media&token=18b2b821-4d0d-43f2-a1c6-8c57bc388fab",
    desc: "La pizza española es una deliciosa combinación de quesos que hará que tu paladar explote de sabor."
  },
  {
    id: "p003",
    name: "Pepperoni",
    price: 6950,
    ingredients: ["mozzarella", "pepperoni", "orégano"],
    img: "https://firebasestorage.googleapis.com/v0/b/apis-varias-mias.appspot.com/o/pizzeria%2Fpizza-1239077_640_com.jpg?alt=media&token=e7cde87a-08d5-4040-ac54-90f6c31eb3e3",
    desc: "La pizza de pepperoni es una pizza estadounidense elaborada con pepperoni, mozzarella y salsa de tomate."
  },
  {
    id: "p004",
    name: "Margherita",
    price: 5490,
    ingredients: ["mozzarella", "tomate", "albahaca"],
    img: "https://firebasestorage.googleapis.com/v0/b/apis-varias-mias.appspot.com/o/pizzeria%2Fpizza-margherita.jpg?alt=media&token=8e0b4f14-b0a4-4b72-a0c6-5072d5e5c3e2",
    desc: "La pizza margarita es una típica pizza napolitana elaborada con tomate, mozzarella, albahaca fresca, sal y aceite."
  },
  {
    id: "p005",
    name: "Hawaiana",
    price: 6490,
    ingredients: ["mozzarella", "jamón", "piña"],
    img: "https://firebasestorage.googleapis.com/v0/b/apis-varias-mias.appspot.com/o/pizzeria%2Fpizza-hawaiana.jpg?alt=media&token=d209a91a-0f4d-4b50-8c5e-4e9d8c0fc5e6",
    desc: "La pizza hawaiana es una pizza dulce y salada con jamón y piña que divide opiniones pero conquista paladares."
  },
  {
    id: "p006",
    name: "Cuatro Quesos",
    price: 7490,
    ingredients: ["mozzarella", "gorgonzola", "parmesano", "queso de cabra"],
    img: "https://firebasestorage.googleapis.com/v0/b/apis-varias-mias.appspot.com/o/pizzeria%2Fpizza-quattro-formaggi.jpg?alt=media&token=71c3e5a7-8c3b-4e3a-a05f-3e9d8c0fc5e7",
    desc: "Una explosión de sabor con cuatro tipos de queso que se derriten en tu boca."
  }
];

// Rutas de autenticación
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
    }
  
    res.status(200).json({ message: 'Login exitoso', token: 'exampleToken' });
});
  
app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No autorizado' });
    }
  
    res.status(200).json({ email: 'usuario@ejemplo.com', name: 'Usuario Ejemplo' });
});

// Rutas de pizzas
app.get('/api/pizzas', (req, res) => {
  res.status(200).json(pizzas);
});

app.get('/api/pizzas/:id', (req, res) => {
  const pizza = pizzas.find(p => p.id === req.params.id);
  if (!pizza) {
    return res.status(404).json({ error: 'Pizza no encontrada' });
  }
  res.status(200).json(pizza);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});