require('dotenv').config();
const mongoose = require('mongoose');
const Pizza = require('./models/Pizza');

const pizzas = [
  {
    id: "p001",
    name: "Napolitana",
    price: 5950,
    ingredients: ["mozzarella", "tomates", "jamón", "orégano"],
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop",
    desc: "La pizza napolitana, de masa tierna y delgada pero bordes altos, es la versión propia de la cocina napolitana de la pizza redonda.",
    available: true
  },
  {
    id: "p002",
    name: "Española",
    price: 6950,
    ingredients: ["mozzarella", "gorgonzola", "parmesano", "provolone"],
    img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop",
    desc: "La pizza española es una deliciosa combinación de quesos que hará que tu paladar explote de sabor.",
    available: true
  },
  {
    id: "p003",
    name: "Pepperoni",
    price: 6950,
    ingredients: ["mozzarella", "pepperoni", "orégano"],
    img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=500&fit=crop",
    desc: "La pizza de pepperoni es una pizza estadounidense elaborada con pepperoni, mozzarella y salsa de tomate.",
    available: true
  },
  {
    id: "p004",
    name: "Margherita",
    price: 5490,
    ingredients: ["mozzarella", "tomate", "albahaca"],
    img: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&h=500&fit=crop",
    desc: "La pizza margarita es una típica pizza napolitana elaborada con tomate, mozzarella, albahaca fresca, sal y aceite.",
    available: true
  },
  {
    id: "p005",
    name: "Hawaiana",
    price: 6490,
    ingredients: ["mozzarella", "jamón", "piña"],
    img: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&h=500&fit=crop",
    desc: "La pizza hawaiana es una pizza dulce y salada con jamón y piña que divide opiniones pero conquista paladares.",
    available: true
  },
  {
    id: "p006",
    name: "Cuatro Quesos",
    price: 7490,
    ingredients: ["mozzarella", "gorgonzola", "parmesano", "queso de cabra"],
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop",
    desc: "Una explosión de sabor con cuatro tipos de queso que se derriten en tu boca.",
    available: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    console.log('🗑️  Limpiando pizzas anteriores...');
    await Pizza.deleteMany({});
    
    console.log('🍕 Insertando pizzas...');
    await Pizza.insertMany(pizzas);
    
    console.log('='.repeat(50));
    console.log('✅ ¡Base de datos poblada exitosamente!');
    console.log(`🍕 ${pizzas.length} pizzas insertadas:`);
    pizzas.forEach((pizza, i) => {
      console.log(`   ${i + 1}. ${pizza.name} - $${pizza.price.toLocaleString('es-CL')}`);
    });
    console.log('='.repeat(50));
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedDatabase();