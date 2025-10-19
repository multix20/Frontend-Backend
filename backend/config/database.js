const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/pizzeria_mamma_mia', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('==================================================');
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log('==================================================');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// Manejo de eventos de conexión
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error en MongoDB:', err);
});

module.exports = connectDB;