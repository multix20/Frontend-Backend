# 🍕 Pizzería Mamma Mía - Full Stack Application

![Status](https://img.shields.io/badge/status-production%20ready-success.svg)
![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0.15-green.svg)
![Node](https://img.shields.io/badge/Node-18.19.1-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Aplicación web completa de pizzería con sistema de autenticación JWT, carrito de compras y gestión de órdenes. Desarrollada con React, Node.js, Express y MongoDB.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Documentation](#-api-documentation)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Problemas Comunes](#-problemas-comunes)
- [Contribuir](#-contribuir)
- [Changelog](#-changelog)
- [Licencia](#-licencia)

---

## ✨ Características

### Frontend
- ⚛️ **React 18** con Hooks modernos
- 🚀 **Vite** para desarrollo ultrarrápido
- 🎨 **CSS personalizado** con diseño responsivo
- 🛣️ **React Router** para navegación SPA
- 🔐 **Context API** para gestión de estado global
- 🛒 **Carrito de compras** persistente
- 📱 **100% Responsive**

### Backend
- 🟢 **Node.js** con Express
- 🗄️ **MongoDB** con Mongoose ODM
- 🔒 **JWT Authentication** completa
- 🔐 **bcrypt** para hash de contraseñas
- 📚 **Swagger/OpenAPI** documentation
- ✅ **Validaciones** en frontend y backend
- 🛡️ **Middleware** de seguridad
- 📝 **Logging** de peticiones

### Funcionalidades
- ✅ Registro e inicio de sesión de usuarios
- ✅ Autenticación persistente con JWT
- ✅ Catálogo de pizzas desde MongoDB
- ✅ Carrito de compras interactivo
- ✅ Sistema de órdenes/checkout
- ✅ Panel de perfil de usuario
- ✅ Gestión de pizzas (Admin)
- ✅ Soft delete de pizzas
- ✅ Actualización de perfil
- ✅ Cambio de contraseña

---

## 🛠️ Tecnologías

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18.2.0 | Biblioteca UI |
| Vite | 5.x | Build tool |
| React Router | 6.x | Navegación |
| Axios | 1.x | Cliente HTTP |

### Backend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | 18.19.1 | Runtime |
| Express | 4.x | Framework web |
| MongoDB | 5.0.15 | Base de datos |
| Mongoose | 8.x | ODM |
| JWT | 9.x | Autenticación |
| bcryptjs | 2.x | Hash passwords |
| Swagger | 5.0.0 | Documentación API |

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

```bash
Node.js >= 18.19.1
npm >= 9.x
MongoDB >= 5.0 (instalado vía Snap o manualmente)
Git
```

### Verificar instalaciones:

```bash
node --version
npm --version
mongosh --version
```

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/multix20/Hito8-main.git
cd Hito8-main
```

### 2. Instalar dependencias del Frontend

```bash
npm install
```

### 3. Instalar dependencias del Backend

```bash
cd backend
npm install
cd ..
```

### 4. Verificar MongoDB

```bash
# Si usas Snap (recomendado en Ubuntu)
sudo snap services | grep mongo

# O conectar directamente
mongosh
```

---

## ⚙️ Configuración

### 1. Variables de Entorno - Frontend

Crear archivo `.env` en la **raíz del proyecto**:

```env
# URL del backend API (SIN /api al final)
VITE_API_URL=http://localhost:5000

# Configuración opcional
VITE_APP_NAME=Pizzería Mamma Mia
VITE_NODE_ENV=development
```

> ⚠️ **IMPORTANTE:** No incluir `/api` al final de `VITE_API_URL`

### 2. Variables de Entorno - Backend

Crear archivo `.env` en la carpeta **`backend/`**:

```env
# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/pizzeria_mamma_mia

# JWT
JWT_SECRET=tu_clave_super_secreta_cambiar_en_produccion_12345
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (para CORS)
CLIENT_URL=http://localhost:5173

# Admin inicial (opcional)
ADMIN_EMAIL=admin@mammamia.com
ADMIN_PASSWORD=Admin123!Change
ADMIN_NAME=Administrador
```

### 3. Migrar Datos Iniciales

```bash
cd backend

# Migrar pizzas al catálogo
node scripts/seedPizzas.js

# Crear usuario administrador (opcional)
npm run create-admin
```

---

## 🎮 Uso

### Iniciar todos los servicios

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Servidor corriendo en: http://localhost:5000

#### Terminal 2 - Frontend
```bash
npm run dev
```
Aplicación corriendo en: http://localhost:5173

### Verificar servicios

```bash
# Backend API
curl http://localhost:5000

# Swagger Documentation
open http://localhost:5000/api-docs

# Frontend
open http://localhost:5173
```

---

## 📚 API Documentation

### Swagger UI Interactivo

Accede a la documentación interactiva completa en:

**URL:** http://localhost:5000/api-docs

### Endpoints Principales

#### 🔐 Autenticación

```http
POST   /api/auth/register       # Registrar usuario
POST   /api/auth/login          # Iniciar sesión
GET    /api/auth/profile        # Obtener perfil (requiere auth)
PUT    /api/auth/profile        # Actualizar perfil (requiere auth)
PUT    /api/auth/change-password # Cambiar contraseña (requiere auth)
```

#### 🍕 Pizzas

```http
GET    /api/pizzas              # Listar pizzas (público)
GET    /api/pizzas/:id          # Obtener pizza por ID (público)
POST   /api/pizzas              # Crear pizza (requiere admin)
PUT    /api/pizzas/:id          # Actualizar pizza (requiere admin)
DELETE /api/pizzas/:id          # Eliminar pizza (requiere admin)
PATCH  /api/pizzas/:id/restore  # Restaurar pizza (requiere admin)
```

#### 🛒 Checkout/Órdenes

```http
POST   /api/checkouts           # Crear orden (requiere auth)
GET    /api/checkouts           # Listar órdenes (requiere auth)
GET    /api/checkouts/:id       # Obtener orden (requiere auth)
PATCH  /api/checkouts/:id/status # Actualizar estado (requiere admin)
DELETE /api/checkouts/:id       # Cancelar orden (requiere auth)
```

### Ejemplo de Uso - Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

### Ejemplo de Uso - Crear Pizza (Admin)

```bash
curl -X POST http://localhost:5000/api/pizzas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "name": "Vegana",
    "price": 6990,
    "ingredients": ["tomate", "pimientos", "champiñones"],
    "img": "https://ejemplo.com/pizza.jpg",
    "desc": "Pizza 100% vegetal"
  }'
```

---

## 📁 Estructura del Proyecto

```
Hito8-main/
├── backend/
│   ├── config/
│   │   ├── database.js          # Conexión MongoDB
│   │   └── swagger.js           # Configuración Swagger
│   ├── controllers/
│   │   ├── authController.js    # Lógica de autenticación
│   │   ├── checkoutController.js # Lógica de órdenes
│   │   └── pizzaController.js   # Lógica de pizzas
│   ├── middleware/
│   │   ├── authMiddleware.js    # Verificación JWT
│   │   └── logger.js            # Logging de peticiones
│   ├── models/
│   │   ├── User.js              # Modelo de usuario
│   │   ├── Pizza.js             # Modelo de pizza
│   │   └── Order.js             # Modelo de orden
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de auth
│   │   ├── checkoutRoutes.js    # Rutas de órdenes
│   │   └── pizzaRoutes.js       # Rutas de pizzas
│   ├── scripts/
│   │   ├── createAdmin.js       # Crear usuario admin
│   │   └── seedPizzas.js        # Migrar pizzas
│   ├── .env                     # Variables de entorno
│   ├── index.js                 # Entry point
│   └── package.json
├── src/
│   ├── components/
│   │   ├── CardPizza.jsx        # Tarjeta de pizza
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   └── Navbar.jsx
│   ├── context/
│   │   ├── CartContext.jsx      # Estado del carrito
│   │   ├── PizzaContext.jsx     # Estado de pizzas
│   │   └── UserContext.jsx      # Estado de usuario
│   ├── hooks/
│   │   └── index.js             # Hooks personalizados
│   ├── pages/
│   │   ├── Cart.jsx             # Página del carrito
│   │   ├── Home.jsx             # Página principal
│   │   ├── Login.jsx            # Inicio de sesión
│   │   ├── Pizza.jsx            # Detalle de pizza
│   │   ├── Profile.jsx          # Perfil de usuario
│   │   └── Register.jsx         # Registro
│   ├── services/
│   │   └── api.js               # Cliente API con Axios
│   ├── App.jsx                  # Componente principal
│   └── main.jsx                 # Entry point
├── .env                         # Variables de entorno frontend
├── CHANGELOG.md                 # Historial de cambios
├── README.md                    # Este archivo
└── package.json
```

---

## 📜 Scripts Disponibles

### Frontend

```bash
npm run dev          # Iniciar servidor de desarrollo (Vite)
npm run build        # Compilar para producción
npm run preview      # Preview del build de producción
npm run lint         # Ejecutar ESLint
```

### Backend

```bash
npm run dev          # Iniciar servidor con nodemon
npm start            # Iniciar servidor en producción
npm run create-admin # Crear usuario administrador
```

### MongoDB

```bash
mongosh                              # Conectar a MongoDB
use pizzeria_mamma_mia              # Usar base de datos
show collections                     # Ver colecciones
db.pizzas.find().pretty()           # Ver pizzas
db.users.find({}, {password: 0})    # Ver usuarios (sin password)
```

---

## 🐛 Problemas Comunes

### Error: URLs duplicadas (/api/api/...)

**Problema:** El `.env` tiene una URL incorrecta

**Solución:**
```env
# ❌ INCORRECTO
VITE_API_URL=http://localhost:5000/api

# ✅ CORRECTO
VITE_API_URL=http://localhost:5000
```

Luego reinicia el servidor frontend.

---

### Error: Login no funciona

**Problema:** El componente no maneja excepciones correctamente

**Solución:** Usa try-catch en el componente Login:
```javascript
try {
  await login({ email, password });
  // éxito
} catch (error) {
  setMessage(error.response?.data?.message || 'Error al iniciar sesión');
}
```

---

### Error: Cannot find module 'orderService'

**Problema:** Import incorrecto en Cart.jsx

**Solución:**
```javascript
// Usa checkoutService en lugar de orderService
import { checkoutService } from '../services/api';
```

---

### MongoDB Error 48: Address already in use

**Problema:** Puerto 27017 en uso

**Solución:**
```bash
# Verificar proceso
sudo lsof -i :27017

# Si es MongoDB Snap, ya está corriendo
mongosh  # Conectar directamente

# Si necesitas detenerlo
sudo snap stop mongodb
sudo snap start mongodb
```

---

### Error: CORS blocked

**Problema:** El backend no permite peticiones del frontend

**Solución:** Verifica que `backend/.env` tenga:
```env
CLIENT_URL=http://localhost:5173
```

Y que `backend/index.js` tenga CORS configurado:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo, punto y coma faltante, etc
refactor: refactorización de código
test: agregar tests
chore: actualizar dependencias, etc
```

---

## 📝 Changelog

Ver [CHANGELOG.md](CHANGELOG.md) para el historial completo de cambios.

### Últimas Versiones

**[1.2.0] - 2025-10-26**
- Fixed: URLs duplicadas en configuración
- Fixed: Login con manejo de excepciones
- Changed: Reorganización de middlewares
- Added: CHANGELOG.md completo

**[1.1.0] - 2025-10-23**
- Added: Documentación Swagger/OpenAPI
- Fixed: MongoDB Error 48
- Fixed: Exports de hooks

**[1.0.0] - 2025-10-18**
- Added: Integración completa con MongoDB
- Added: Autenticación JWT
- Added: CRUD de pizzas y órdenes

---

## 👥 Autores

- **multix** - [multix20](https://github.com/multix20)

---

## 🙏 Agradecimientos

- [Desafío Latam](https://desafiolatam.com/) por el bootcamp
- Comunidad de React y Node.js
- Documentación de MongoDB y Mongoose

---

## 📧 Contacto

Proyecto Link: [https://github.com/multix20/Hito8-main](https://github.com/multix20/Hito8-main)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🎯 Estado del Proyecto

- ✅ Frontend: Completamente funcional
- ✅ Backend: API REST completa
- ✅ MongoDB: Integrado y funcionando
- ✅ Autenticación: JWT implementado
- ✅ Documentación: 100% completa
- ✅ Tests: 20/20 exitosos

**Estado:** 🟢 **PRODUCTION READY**

---

**Última actualización:** 26 de Octubre, 2025  
**Versión:** 1.2.0

⭐️ Si te gusta este proyecto, ¡dale una estrella en GitHub!