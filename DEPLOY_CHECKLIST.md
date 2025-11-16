# ✅ Checklist de Deployment Completo

Sigue estos pasos EN ORDEN para hacer el deployment completo de tu aplicación.

---

## 📋 Orden de los Pasos

### 1️⃣ Push a GitHub
- **Estado:** ⏳ Pendiente
- **Guía:** Instrucciones abajo
- **Tiempo:** 2 minutos

### 2️⃣ MongoDB Atlas
- **Estado:** ⏳ Pendiente
- **Guía:** [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)
- **Tiempo:** 10-15 minutos

### 3️⃣ Deploy Backend (Render)
- **Estado:** ⏳ Pendiente
- **Guía:** [RENDER_DEPLOY.md](RENDER_DEPLOY.md)
- **Tiempo:** 10-15 minutos

### 4️⃣ Actualizar Frontend
- **Estado:** ⏳ Pendiente
- **Guía:** [GITHUB_PAGES_DEPLOY.md](GITHUB_PAGES_DEPLOY.md)
- **Tiempo:** 5 minutos

### 5️⃣ Deploy Frontend (GitHub Pages)
- **Estado:** ⏳ Pendiente
- **Guía:** [GITHUB_PAGES_DEPLOY.md](GITHUB_PAGES_DEPLOY.md)
- **Tiempo:** 5 minutos

---

## 🚀 Paso 1: Push a GitHub

### Situación Actual
- Tienes 2 commits locales que no están en GitHub
- El commit remoto tiene archivos basura que ya eliminaste

### Acción Requerida

**Opción A - Terminal (Recomendado):**
```bash
git push origin desarrollo --force-with-lease
```

**Opción B - VS Code:**
1. Abre el Source Control panel
2. Click en "..." (más opciones)
3. Selecciona "Push"
4. Si pide confirmación, acepta "Force Push"

**Opción C - GitHub Desktop:**
1. Abre GitHub Desktop
2. Verás los commits pendientes
3. Click en "Push origin"
4. Si pide confirmación, acepta

### Verificar
- [ ] Push exitoso
- [ ] No hay errores en la terminal
- [ ] Ve a GitHub y verifica que los commits están ahí

---

## 📊 Paso 2: MongoDB Atlas

### Objetivo
Crear una base de datos en la nube para producción.

### Pasos Resumidos
1. Crear cuenta en MongoDB Atlas
2. Crear cluster gratuito (M0)
3. Crear usuario de base de datos
4. Configurar acceso de red (0.0.0.0/0)
5. Copiar connection string
6. Guardar el connection string (lo necesitarás en Render)

### Guía Detallada
📖 **Lee:** [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)

### Verificar
- [ ] Cluster creado y activo
- [ ] Usuario creado
- [ ] Connection string copiado
- [ ] Connection string tiene formato:
  ```
  mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/pizzeria_mamma_mia?retryWrites=true&w=majority
  ```

---

## 🖥️ Paso 3: Deploy Backend en Render

### Objetivo
Poner el backend en producción con acceso público.

### Pasos Resumidos
1. Crear cuenta en Render (con GitHub)
2. Crear nuevo Web Service
3. Conectar repositorio
4. Configurar:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
5. Agregar variables de entorno
6. Deploy y esperar
7. Copiar URL generada

### Guía Detallada
📖 **Lee:** [RENDER_DEPLOY.md](RENDER_DEPLOY.md)

### Variables de Entorno Requeridas
```
NODE_ENV=production
PORT=5000
MONGODB_URI=tu-connection-string-de-atlas
JWT_SECRET=[generar automáticamente]
JWT_EXPIRE=7d
FRONTEND_URL=https://multix20.github.io/MypizzaHito2
ADMIN_EMAIL=admin@mammamia.com
ADMIN_PASSWORD=Admin123!Change
ADMIN_NAME=Administrador
```

### Verificar
- [ ] Deploy exitoso (status: Live 🟢)
- [ ] URL copiada (ej: `https://pizzeria-mamma-mia-backend.onrender.com`)
- [ ] API responde: abre `https://tu-url.onrender.com`
- [ ] Pizzas endpoint funciona: `https://tu-url.onrender.com/api/pizzas`
- [ ] MongoDB conectado (ver logs)
- [ ] (Opcional) Datos poblados con seed scripts

---

## 🎨 Paso 4: Actualizar Frontend

### Objetivo
Configurar el frontend para usar el backend de producción.

### Acción Requerida

1. **Editar `.env`:**
```bash
nano .env
# o
code .env
```

2. **Cambiar la URL:**
```env
VITE_API_URL=https://tu-app.onrender.com
VITE_APP_NAME=Pizzería Mamma Mia
VITE_NODE_ENV=production
```

⚠️ Reemplaza `https://tu-app.onrender.com` con tu URL real de Render

3. **Guardar el archivo**

### Verificar
- [ ] `.env` actualizado
- [ ] URL es la de Render (no localhost)
- [ ] Sin `/api` al final

---

## 📤 Paso 5: Deploy Frontend a GitHub Pages

### Objetivo
Poner el frontend en GitHub Pages con la configuración de producción.

### Acción Requerida

```bash
# Build
npm run build

# Deploy
npm run deploy
```

### Guía Detallada
📖 **Lee:** [GITHUB_PAGES_DEPLOY.md](GITHUB_PAGES_DEPLOY.md)

### Verificar
- [ ] Build exitoso
- [ ] Deploy exitoso
- [ ] Aplicación accesible en: https://multix20.github.io/MypizzaHito2/
- [ ] Pizzas se cargan
- [ ] No hay errores de CORS
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Carrito funciona
- [ ] Checkout funciona

---

## 🎯 URLs Finales

Una vez completado todo:

### Frontend
```
https://multix20.github.io/MypizzaHito2/
```

### Backend API
```
https://tu-app.onrender.com
```

### Documentación API
```
https://tu-app.onrender.com/api-docs
```

---

## 🐛 Problemas Comunes

### 1. Push a GitHub falla

**Error:** "could not read Username"

**Solución:**
- Usa GitHub Desktop o VS Code
- O configura credenciales: `git config credential.helper store`

### 2. MongoDB no conecta

**Error:** "Authentication failed"

**Solución:**
- Verifica usuario y password en connection string
- Verifica que 0.0.0.0/0 está en Network Access de Atlas

### 3. CORS Error

**Error:** "CORS blocked"

**Solución:**
- Verifica `FRONTEND_URL` en Render
- Debe ser exactamente: `https://multix20.github.io/MypizzaHito2` (sin / al final)

### 4. 404 en assets

**Error:** Assets no cargan en GitHub Pages

**Solución:**
- Verifica `base: '/MypizzaHito2/'` en vite.config.js
- Rebuild: `npm run build`
- Redeploy: `npm run deploy`

### 5. Backend tarda en responder

**Problema:** Primera petición muy lenta

**Solución:**
- Normal en Render Free (se duerme después de 15 min)
- Espera ~30 segundos en la primera petición
- Agrega loading state en el frontend

---

## 📞 Ayuda Adicional

### Documentación Completa
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guía general
- [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md) - MongoDB paso a paso
- [RENDER_DEPLOY.md](RENDER_DEPLOY.md) - Render paso a paso
- [GITHUB_PAGES_DEPLOY.md](GITHUB_PAGES_DEPLOY.md) - GitHub Pages paso a paso

### Recursos Oficiales
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ Checklist Final

Al terminar todos los pasos, deberías tener:

- [ ] Código en GitHub actualizado
- [ ] MongoDB Atlas configurado y funcionando
- [ ] Backend en Render (Live 🟢)
- [ ] Frontend en GitHub Pages
- [ ] Aplicación completamente funcional
- [ ] Todas las features funcionando:
  - [ ] Home con pizzas
  - [ ] Detalle de pizza
  - [ ] Registro de usuarios
  - [ ] Login
  - [ ] Perfil
  - [ ] Carrito
  - [ ] Checkout

---

## 🎉 ¡Éxito!

Una vez completado:

1. **Prueba la aplicación completa**
2. **Comparte la URL con amigos/familia**
3. **Agrégala a tu portfolio**
4. **Actualiza tu CV/LinkedIn**

**Tu aplicación full-stack está en producción!** 🚀

---

**Tiempo total estimado:** 45-60 minutos

**Costo:** $0 (todo en planes gratuitos)

**Stack completo:**
- Frontend: React + Vite en GitHub Pages
- Backend: Node.js + Express en Render
- Database: MongoDB Atlas
- Autenticación: JWT
- Documentación: Swagger/OpenAPI
