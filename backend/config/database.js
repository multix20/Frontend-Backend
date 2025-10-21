const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pizzeria_mamma_mia';

const connectDB = async () => {
  try {
    // ✅ Sin opciones deprecadas
    await mongoose.connect(MONGODB_URI);
    
    console.log('='.repeat(50));
    console.log('✅ MongoDB conectado:', mongoose.connection.host);
    console.log('📊 Base de datos:', mongoose.connection.name);
    console.log('='.repeat(50));
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;