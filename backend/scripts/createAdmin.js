require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

const createAdminUser = async () => {
  try {
    // Conectar a MongoDB
    await connectDB();

    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('⚠️  Ya existe un usuario administrador con ese email');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Nombre: ${existingAdmin.name}`);
      console.log(`🔑 Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Crear usuario administrador
    const adminUser = new User({
      email: process.env.ADMIN_EMAIL || 'admin@pizzeria.com',
      password: process.env.ADMIN_PASSWORD || 'Admin123456!',
      name: process.env.ADMIN_NAME || 'Administrador',
      role: 'admin'
    });

    await adminUser.save();

    console.log('='.repeat(50));
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('='.repeat(50));
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`👤 Nombre: ${adminUser.name}`);
    console.log(`🔑 Role: ${adminUser.role}`);
    console.log(`🆔 ID: ${adminUser._id}`);
    console.log('='.repeat(50));
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
    console.log('='.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error.message);
    process.exit(1);
  }
};

// Ejecutar script
createAdminUser();
