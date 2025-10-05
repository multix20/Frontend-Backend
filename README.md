# 🍕 Pizzería Mamma Mia

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)

Aplicación web moderna para una pizzería, desarrollada con React + Vite en el frontend y Express.js en el backend. Permite a los usuarios explorar el menú, gestionar su carrito de compras y realizar pedidos de manera intuitiva.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

### Frontend
- 🎨 Interfaz moderna y responsive con React
- 🛒 Carrito de compras con gestión de estado mediante Context API
- 🔐 Sistema de autenticación (Login/Registro)
- 🍕 Catálogo dinámico de pizzas
- 🔒 Rutas protegidas para usuarios autenticados
- ⚡ Hot Module Replacement (HMR) con Vite
- 📱 Diseño responsive para dispositivos móviles

### Backend
- 🚀 API RESTful con Express.js
- 🔐 Endpoints de autenticación
- 📊 Gestión de datos de pizzas
- 🌐 CORS habilitado para desarrollo
- 📝 Validación de datos

## 🛠️ Tecnologías

### Frontend
- **React** 18.x - Biblioteca de JavaScript para interfaces de usuario
- **Vite** 5.x - Build tool y dev server de última generación
- **React Router DOM** - Enrutamiento para aplicaciones SPA
- **Context API** - Gestión de estado global
- **ESLint** - Linter para mantener calidad de código

### Backend
- **Node.js** - Entorno de ejecución JavaScript
- **Express.js** - Framework web minimalista
- **CORS** - Middleware para habilitar CORS
- **Morgan** (opcional) - Logger de peticiones HTTP

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18.x o superior)
- **npm** (versión 9.x o superior)
- **Git** (para clonar el repositorio)

Verifica las versiones instaladas:

```bash
node --version
npm --version
git --version
```

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/multix20/Hito8-main.git
cd Hito8-main
```

### 2. Instalar dependencias del Frontend

En la raíz del proyecto:

```bash
npm install
```

### 3. Instalar dependencias del Backend

```bash
cd backend
npm install
cd ..
```

## 💻 Uso

### Modo Desarrollo

Necesitarás **dos terminales** abiertas simultáneamente:

#### Terminal 1 - Frontend
```bash
# En la raíz del proyecto
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

#### Terminal 2 - Backend
```bash
# En la carpeta backend
cd backend
node index.js
```

El backend estará disponible en: `http://localhost:5000`

### Producción

#### Build del Frontend
```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

#### Vista previa del Build
```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
Hito8-main/
├── backend/
│   ├── index.js              # Servidor Express
│   ├── package.json          # Dependencias del backend
│   └── package-lock.json
│
├── public/
│   ├── Pizza.jpeg            # Imágenes estáticas
│   └── vite.svg
│
├── src/
│   ├── assets/               # Recursos del proyecto
│   ├── components/           # Componentes reutilizables
│   │   ├── CardPizza.jsx
│   │   ├── Cart.css
│   │   ├── Footer.jsx
│   │   ├── Formulario.jsx
│   │   ├── Header.jsx
│   │   └── Navbar.jsx
│   │
│   ├── context/              # Context API (Estado global)
│   │   ├── CartContext.jsx
│   │   ├── PizzaContext.jsx
│   │   └── UserContext.jsx
│   │
│   ├── pages/                # Páginas de la aplicación
│   │   ├── Cart.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── Pizzas.jsx
│   │   ├── Profile.jsx
│   │   └── Register.jsx
│   │
│   ├── App.css
│   ├── App.jsx               # Componente principal
│   ├── index.css
│   └── main.jsx              # Punto de entrada
│
├── .gitignore
├── eslint.config.js          # Configuración ESLint
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js            # Configuración Vite
```

## 🔌 API Endpoints

### Autenticación

#### POST `/api/auth/login`
Iniciar sesión de usuario

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response:**
```json
{
  "message": "Login exitoso",
  "token": "exampleToken"
}
```

#### GET `/api/auth/me`
Obtener información del usuario autenticado

**Headers:**
```
Authorization: Bearer exampleToken
```

**Response:**
```json
{
  "email": "usuario@ejemplo.com",
  "name": "Usuario Ejemplo"
}
```

### Pizzas

#### GET `/api/pizzas`
Obtener todas las pizzas disponibles

**Response:**
```json
[
  {
    "id": "p001",
    "name": "Napolitana",
    "price": 5950,
    "ingredients": ["mozzarella", "tomates", "jamón", "orégano"],
    "img": "https://...",
    "desc": "Descripción de la pizza"
  }
]
```

#### GET `/api/pizzas/:id`
Obtener una pizza específica por ID

**Response:**
```json
{
  "id": "p001",
  "name": "Napolitana",
  "price": 5950,
  "ingredients": ["mozzarella", "tomates", "jamón", "orégano"],
  "img": "https://...",
  "desc": "Descripción de la pizza"
}
```

## 🧪 Testing con Thunder Client

Puedes probar los endpoints usando Thunder Client en Visual Studio Code:

1. Instala la extensión **Thunder Client**
2. Importa la colección de peticiones (si está disponible)
3. Ejecuta las peticiones de prueba

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Convención de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (sin afectar código)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👤 Autor

**multix20**

- GitHub: [@multix20](https://github.com/multix20)

## 🙏 Agradecimientos

- Comunidad de React
- Equipo de Vite
- Todos los contribuidores del proyecto

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub

🐛 ¿Encontraste un bug? [Reporta un issue](https://github.com/multix20/Hito8-main/issues)

📧 ¿Preguntas? Abre una [discusión](https://github.com/multix20/Hito8-main/discussions)