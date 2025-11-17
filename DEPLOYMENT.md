# 🚀 Guía de Deployment - Pizzería Mamma Mia

Esta guía te ayudará a hacer deploy de tu aplicación full-stack.

---

## 📋 Índice

1. [Frontend en GitHub Pages](#frontend-en-github-pages)
2. [Backend en Render (Recomendado)](#backend-en-render)
3. [Backend en Railway](#backend-en-railway)
4. [Backend en Vercel](#backend-en-vercel)
5. [Base de Datos MongoDB Atlas](#base-de-datos-mongodb-atlas)
6. [Variables de Entorno](#variables-de-entorno)

---

## 🎨 Frontend en GitHub Pages

### Prerequisitos
- Repositorio en GitHub
- GitHub Pages habilitado

### Pasos

1. **Configurar variables de entorno de producción**

   Edita `.env` y cambia la URL del backend:
   ```env
   VITE_API_URL=https://tu-backend-url.render.com
   ```

2. **Build del frontend**
   ```bash
   npm run build
   ```

3. **Deploy a GitHub Pages**
   ```bash
   npm run deploy
   ```

4. **Verificar el deploy**
   - Tu app estará disponible en: `https://multix20.github.io/MypizzaHito2`

---

## 🖥️ Backend en Render

### Prerequisitos
- Cuenta en [Render.com](https://render.com)
- MongoDB Atlas configurado

### Pasos

1. **Crear nuevo Web Service en Render**
   - Conecta tu repositorio de GitHub
   - Configuración:
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`
     - **Branch**: `desarrollo` o `main`

2. **Configurar Variables de Entorno**

   En el dashboard de Render, agrega:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/pizzeria_mamma_mia
   JWT_SECRET=tu_clave_secreta_super_segura_generada
   JWT_EXPIRE=7d
   FRONTEND_URL=https://multix20.github.io/MypizzaHito2
   ADMIN_EMAIL=admin@mammamia.com
   ADMIN_PASSWORD=Admin123!Change
   ADMIN_NAME=Administrador
   ```

3. **Deploy**
   - Render automáticamente hará deploy
   - Copia la URL generada (ej: `https://pizzeria-mamma-mia.onrender.com`)

4. **Actualizar Frontend**
   - Actualiza `.env` con la URL del backend
   - Re-deploy del frontend: `npm run deploy`

---

## 🚂 Backend en Railway

### Prerequisitos
- Cuenta en [Railway.app](https://railway.app)

### Pasos

1. **Crear nuevo proyecto**
   ```bash
   # Instalar Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Inicializar proyecto
   cd backend
   railway init
   ```

2. **Configurar variables de entorno**
   ```bash
   railway variables set MONGODB_URI="tu-mongodb-uri"
   railway variables set JWT_SECRET="tu-secret"
   railway variables set NODE_ENV="production"
   railway variables set PORT="5000"
   railway variables set FRONTEND_URL="https://multix20.github.io/MypizzaHito2"
   ```

3. **Deploy**
   ```bash
   railway up
   ```

---

## ▲ Backend en Vercel

### Prerequisitos
- Cuenta en [Vercel.com](https://vercel.com)

### Pasos

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd backend
   vercel
   ```

3. **Configurar Variables de Entorno**
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Agrega todas las variables necesarias

**Nota**: Vercel tiene limitaciones para aplicaciones que requieren conexiones persistentes.

---

## 🗄️ Base de Datos MongoDB Atlas

### Pasos

1. **Crear cuenta en MongoDB Atlas**
   - Visita [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Crea una cuenta gratuita

2. **Crear Cluster**
   - Crea un cluster gratuito (M0)
   - Selecciona región cercana (ej: AWS Oregon)

3. **Configurar Acceso**
   - **Database Access**: Crea un usuario con contraseña
   - **Network Access**: Agregar `0.0.0.0/0` (permitir desde cualquier IP)

4. **Obtener Connection String**
   - Click en "Connect" > "Connect your application"
   - Copia el string de conexión
   - Reemplaza `<password>` con tu contraseña

   Ejemplo:
   ```
   mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/pizzeria_mamma_mia?retryWrites=true&w=majority
   ```

5. **Migrar Datos**
   ```bash
   # Exportar datos locales
   mongodump --db pizzeria_mamma_mia --out backup

   # Importar a Atlas
   mongorestore --uri "tu-mongodb-atlas-uri" backup
   ```

---

## 🔐 Variables de Entorno

### Backend (.env)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pizzeria_mamma_mia
JWT_SECRET=clave_secreta_super_segura_generada_aleatoriamente
JWT_EXPIRE=7d
FRONTEND_URL=https://multix20.github.io/MypizzaHito2
ADMIN_EMAIL=admin@mammamia.com
ADMIN_PASSWORD=Admin123!Change
ADMIN_NAME=Administrador
```

### Frontend (.env)

```env
VITE_API_URL=https://tu-backend-url.render.com
VITE_APP_NAME=Pizzería Mamma Mia
VITE_NODE_ENV=production
```

---

## 📝 Checklist de Deployment

### Antes del Deploy

- [ ] MongoDB Atlas configurado y accesible
- [ ] Variables de entorno configuradas
- [ ] Tests pasando localmente
- [ ] Build del frontend exitoso
- [ ] Backend corriendo en producción

### Durante el Deploy

- [ ] Backend desplegado en Render/Railway/Vercel
- [ ] MongoDB conectado correctamente
- [ ] Variables de entorno configuradas en la plataforma
- [ ] Frontend actualizado con URL del backend
- [ ] Frontend desplegado en GitHub Pages

### Después del Deploy

- [ ] Verificar que el frontend carga correctamente
- [ ] Probar login/registro
- [ ] Verificar que las pizzas se cargan desde la API
- [ ] Probar flujo completo de checkout
- [ ] Revisar logs en la plataforma de backend

---

## 🐛 Troubleshooting

### Error: CORS blocked

**Problema**: El frontend no puede conectarse al backend

**Solución**:
1. Verifica que `FRONTEND_URL` esté configurada en las variables de entorno del backend
2. Asegúrate de que la URL sea exacta (sin / al final)

### Error: Can't connect to MongoDB

**Problema**: El backend no puede conectarse a MongoDB Atlas

**Solución**:
1. Verifica que la IP `0.0.0.0/0` esté en Network Access
2. Verifica el usuario y contraseña en Database Access
3. Verifica que el string de conexión sea correcto

### Error: 404 en rutas de React Router

**Problema**: Al recargar la página en una ruta específica, da 404

**Solución**: GitHub Pages no soporta SPA routing por defecto. Opciones:
1. Usar HashRouter en lugar de BrowserRouter
2. Implementar solución con 404.html

---

## 📚 Recursos Adicionales

- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ Comandos Rápidos

```bash
# Build frontend
npm run build

# Deploy frontend a GitHub Pages
npm run deploy

# Verificar build local
npm run preview

# Crear usuario admin en producción
npm run create-admin
```

---

**Última actualización**: Noviembre 2025
**Versión**: 2.0.0
