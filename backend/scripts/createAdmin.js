// backend/scripts/createAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Cargar variables de entorno
dotenv.config();

const createAdmin = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado a MongoDB');

    // Datos del admin desde .env o valores por defecto
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@mammamia.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    const adminName = process.env.ADMIN_NAME || 'Administrador';

    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('⚠️  El usuario administrador ya existe');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Nombre: ${existingAdmin.name}`);
      
      // Preguntar si desea actualizar la contraseña
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline.question('¿Deseas actualizar la contraseña? (s/n): ', async (answer) => {
        if (answer.toLowerCase() === 's') {
          const hashedPassword = await bcrypt.hash(adminPassword, 10);
          existingAdmin.password = hashedPassword;
          await existingAdmin.save();
          console.log('✅ Contraseña actualizada exitosamente');
        }
        readline.close();
        mongoose.connection.close();
      });
      
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Crear nuevo usuario admin
    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();

    console.log('\n✅ Usuario administrador creado exitosamente!');
    console.log('=====================================');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Contraseña: ${adminPassword}`);
    console.log(`👤 Nombre: ${adminName}`);
    console.log(`🛡️  Rol: admin`);
    console.log('=====================================');
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login\n');

    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error al crear administrador:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Ejecutar la función
createAdmin();