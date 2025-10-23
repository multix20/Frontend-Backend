const mongoose = require('mongoose');
const Pizza = require('../models/Pizza');
const pizzasData = require('../data/pizzas');

const connectDB = require('../config/database');

const seedPizzas = async () => {
  try {
    await connectDB();

    console.log('🗑️  Limpiando colección de pizzas...');
    await Pizza.deleteMany({});

    console.log('📦 Insertando pizzas...');
    const pizzas = await Pizza.insertMany(pizzasData);

    console.log('==================================================');
    console.log(`✅ ${pizzas.length} pizzas insertadas exitosamente`);
    console.log('==================================================');
    
    pizzas.forEach(pizza => {
      console.log(`  🍕 ${pizza.name} - $${pizza.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seedPizzas();