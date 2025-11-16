# 🎨 Deploy del Frontend en GitHub Pages - Paso a Paso

Esta guía te ayudará a hacer el deploy final del frontend en GitHub Pages.

---

## 📋 Prerequisitos

Antes de comenzar, necesitas:

- ✅ Código pusheado a GitHub
- ✅ Backend desplegado en Render
- ✅ URL del backend de Render (ej: `https://tu-app.onrender.com`)

---

## ⚙️ Paso 1: Actualizar Variables de Entorno

1. **Editar el archivo `.env` en la raíz del proyecto:**

```bash
# Abrir .env con tu editor
nano .env
# o
code .env
```

2. **Actualizar con la URL de producción:**

```env
# URL del backend API (SIN /api al final)
VITE_API_URL=https://tu-app.onrender.com

# Configuración
VITE_APP_NAME=Pizzería Mamma Mia
VITE_NODE_ENV=production
```

⚠️ **IMPORTANTE:**
- Reemplaza `https://tu-app.onrender.com` con tu URL real de Render
- NO agregues `/api` al final
- Guarda el archivo

---

## 🔨 Paso 2: Build del Frontend

1. **Limpiar build anterior (opcional):**

```bash
rm -rf dist
```

2. **Hacer build de producción:**

```bash
npm run build
```

3. **Verificar el build:**

Deberías ver:
```
✓ built in X.XXs
dist/index.html                 XXX kB
dist/assets/index-XXXXX.css     XXX kB
dist/assets/index-XXXXX.js      XXX kB
```

4. **Probar localmente (opcional):**

```bash
npm run preview
```

Abre http://localhost:4173 y verifica que:
- La app carga correctamente
- NO intenta conectarse a localhost:5000
- Usa la URL de Render

---

## 🚀 Paso 3: Deploy a GitHub Pages

### Opción A: Usando npm script (Recomendado)

```bash
npm run deploy
```

Si pide autenticación de GitHub:
- **Username:** tu-usuario-github
- **Password:** tu Personal Access Token (NO tu password normal)

### Opción B: Si no tienes gh-pages instalado

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

### Opción C: Deploy manual

```bash
# Build
npm run build

# Crear rama gh-pages si no existe
git checkout -b gh-pages

# Copiar archivos
cp -r dist/* .

# Commit y push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force

# Volver a desarrollo
git checkout desarrollo
```

---

## ⏳ Paso 4: Esperar el Deploy

1. **GitHub Actions:**
   - Ve a tu repositorio en GitHub
   - Click en la pestaña "Actions"
   - Verás el workflow corriendo (si está habilitado)

2. **Tiempo de espera:**
   - El deploy toma 1-3 minutos
   - Espera a que aparezca el ✅ verde

---

## 🔧 Paso 5: Configurar GitHub Pages

1. **Ir a Settings:**
   - En tu repositorio de GitHub
   - Click en "Settings"

2. **Pages:**
   - En el menú lateral, click en "Pages"

3. **Configuración:**
   ```
   Source: Deploy from a branch
   Branch: gh-pages
   Folder: / (root)
   ```

4. **Save:**
   - Click en "Save"
   - Espera 1-2 minutos

5. **Verificar URL:**
   - Deberías ver: "Your site is live at https://multix20.github.io/MypizzaHito2/"

---

## ✅ Paso 6: Verificar el Deploy

### 6.1 Abrir la Aplicación

1. **URL:**
   ```
   https://multix20.github.io/MypizzaHito2/
   ```

2. **Verificar que carga:**
   - La página debe cargar sin errores
   - El navbar debe aparecer
   - Las pizzas deben cargarse (puede tardar ~30seg si Render estaba dormido)

### 6.2 Verificar la Conexión con el Backend

1. **Abrir DevTools (F12)**
   - Ve a la pestaña "Network"
   - Filtra por "Fetch/XHR"

2. **Verificar peticiones:**
   - Deberías ver peticiones a: `https://tu-app.onrender.com/api/pizzas`
   - Estado: 200 OK
   - Si ves 404 o errores, verifica la URL en `.env`

3. **Verificar CORS:**
   - NO debe haber errores de CORS
   - Si hay error CORS, verifica `FRONTEND_URL` en Render

### 6.3 Probar Funcionalidades

- [ ] Página principal carga las pizzas
- [ ] Click en una pizza muestra el detalle
- [ ] Carrito funciona
- [ ] Login/Registro funciona
- [ ] Perfil de usuario funciona
- [ ] Checkout funciona

---

## 🐛 Troubleshooting

### Error: "Failed to load resource: 404"

**Problema:** Assets no se encuentran

**Solución:**
1. Verifica que `vite.config.js` tiene `base: '/MypizzaHito2/'`
2. Rebuild: `npm run build`
3. Redeploy: `npm run deploy`

### Error: "CORS blocked"

**Problema:** El backend bloquea las peticiones

**Solución:**
1. Ve a Render Dashboard
2. Verifica que `FRONTEND_URL` es exactamente:
   ```
   https://multix20.github.io/MypizzaHito2
   ```
   (sin / al final)
3. Re-deploy el backend si cambiaste la variable

### Error: "Cannot GET /cart" al refrescar

**Problema:** GitHub Pages no soporta SPA routing

**Solución A:** Usar HashRouter
1. Editar `src/App.jsx`
2. Cambiar `BrowserRouter` por `HashRouter`
3. Las URLs serán: `/#/cart` en lugar de `/cart`

**Solución B:** Agregar 404.html redirect
1. Crear `public/404.html` con redirect
2. Rebuild y deploy

### Backend tarda en responder

**Problema:** Render Free se duerme después de 15 min

**Solución:**
- Esto es normal en el plan Free
- Primera petición toma ~30 segundos
- Agrega un loading state en el frontend
- O considera upgrade a Render Starter plan

---

## 🔄 Actualizar el Deploy

Cada vez que hagas cambios:

```bash
# 1. Hacer cambios en el código
# 2. Commit
git add .
git commit -m "feat: mi cambio"
git push origin desarrollo

# 3. Build y deploy
npm run build
npm run deploy
```

---

## 📝 Checklist Final

- [ ] `.env` actualizado con URL de Render
- [ ] Build exitoso
- [ ] Deploy a GitHub Pages exitoso
- [ ] Aplicación accesible en https://multix20.github.io/MypizzaHito2/
- [ ] Pizzas se cargan correctamente
- [ ] No hay errores de CORS
- [ ] Login/Registro funciona
- [ ] Carrito funciona
- [ ] Checkout funciona
- [ ] Perfil funciona

---

## 🎯 URLs Finales

### Frontend (GitHub Pages)
```
https://multix20.github.io/MypizzaHito2/
```

### Backend (Render)
```
https://tu-app.onrender.com
```

### API Documentation
```
https://tu-app.onrender.com/api-docs
```

---

## 💡 Tips Pro

### 1. Custom Domain

Si tienes un dominio propio:
1. Settings > Pages > Custom domain
2. Agrega tu dominio (ej: `pizzeria.tudominio.com`)
3. Configura DNS:
   ```
   Type: CNAME
   Name: pizzeria
   Value: multix20.github.io
   ```

### 2. HTTPS

GitHub Pages incluye HTTPS gratis:
- Automático para subdominios de github.io
- Para custom domains, marca "Enforce HTTPS"

### 3. Analytics

Agrega Google Analytics:
1. Crear cuenta en Google Analytics
2. Agregar el código en `index.html`
3. Rebuild y deploy

### 4. SEO

Optimiza para SEO:
1. Edita `index.html` con:
   - `<title>` descriptivo
   - Meta tags (description, keywords)
   - Open Graph tags para redes sociales

---

## 🎉 ¡Felicidades!

Tu aplicación está ahora completamente desplegada:

✅ **Frontend:** GitHub Pages (Gratis, Rápido, Confiable)
✅ **Backend:** Render (Gratis, Auto-deploy, Escalable)
✅ **Database:** MongoDB Atlas (Gratis, Gestionado, Seguro)

---

## 📚 Próximos Pasos

1. **Compartir:**
   - Comparte la URL con amigos/empleadores
   - Agrégala a tu portfolio

2. **Monitorear:**
   - Revisa logs en Render
   - Monitorea errores

3. **Mejorar:**
   - Agrega features
   - Optimiza performance
   - Mejora UX

4. **Documentar:**
   - Actualiza el README con las URLs
   - Agrega screenshots

---

**¡Tu Pizzería Mamma Mia está en vivo!** 🍕🎉
