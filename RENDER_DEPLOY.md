# 🚀 Deploy del Backend en Render - Paso a Paso

Esta guía te llevará a través del proceso completo de deploy del backend en Render.

---

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener:

- ✅ Código pusheado a GitHub
- ✅ MongoDB Atlas configurado
- ✅ Connection string de MongoDB guardado

---

## 🎯 Paso 1: Crear Cuenta en Render

1. **Ir a Render**
   - URL: https://render.com/
   - Click en "Get Started"

2. **Sign Up**
   - Opción recomendada: **"Sign up with GitHub"**
   - Esto facilita la conexión con tu repositorio
   - Autoriza a Render para acceder a tus repositorios

---

## 🔗 Paso 2: Conectar Repositorio

1. **Dashboard de Render**
   - Click en "New +" (arriba a la derecha)
   - Selecciona **"Web Service"**

2. **Connect a Repository**
   - Busca: `Frontend-Backend` (tu repositorio)
   - Si no aparece, click en "Configure account" y autoriza el repositorio
   - Click en "Connect" junto al repositorio

---

## ⚙️ Paso 3: Configurar el Web Service

### 3.1 Información Básica

```
Name: pizzeria-mamma-mia-backend
Region: Oregon (US West) - o la más cercana
Branch: desarrollo
Root Directory: backend
```

### 3.2 Build & Deploy Settings

```
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### 3.3 Plan

```
Instance Type: Free
```

⚠️ **Nota:** El plan Free tiene limitaciones:
- Se duerme después de 15 minutos de inactividad
- 750 horas gratis al mes
- Suficiente para testing y desarrollo

---

## 🔐 Paso 4: Configurar Variables de Entorno

Scroll hasta **"Environment Variables"** y agrega:

### Variables Requeridas

```env
NODE_ENV
production

PORT
5000

MONGODB_URI
mongodb+srv://pizzeria_admin:TuPassword@cluster0.xxxxx.mongodb.net/pizzeria_mamma_mia?retryWrites=true&w=majority

JWT_SECRET
[Click en "Generate" para generar una clave segura automáticamente]

JWT_EXPIRE
7d

FRONTEND_URL
https://multix20.github.io/MypizzaHito2

ADMIN_EMAIL
admin@mammamia.com

ADMIN_PASSWORD
Admin123!Change

ADMIN_NAME
Administrador
```

### ⚠️ Importante

1. **MONGODB_URI**: Usa tu connection string de MongoDB Atlas (del paso anterior)
2. **JWT_SECRET**: Click en "Generate" para crear una clave segura
3. **FRONTEND_URL**: Esta es la URL de tu frontend en GitHub Pages
4. **ADMIN_PASSWORD**: Cámbiala después del primer deploy

---

## 🚀 Paso 5: Deploy

1. **Scroll hasta el final**
   - Click en **"Create Web Service"**

2. **Esperar el Deploy** ⏳
   - Verás los logs en tiempo real
   - El primer deploy toma 2-5 minutos
   - Busca el mensaje: `✅ Servidor backend corriendo`

3. **Verificar Estado**
   - Estado debe cambiar a: **"Live"** 🟢

---

## 🔍 Paso 6: Verificar el Deploy

1. **Obtener URL**
   - En el dashboard verás tu URL: `https://pizzeria-mamma-mia-backend.onrender.com`
   - Copia esta URL

2. **Probar el API**

   Abre en el navegador o usa curl:

   ```bash
   # Verificar que el API responde
   curl https://tu-app.onrender.com

   # Verificar pizzas
   curl https://tu-app.onrender.com/api/pizzas

   # Verificar documentación Swagger
   # Abre en navegador: https://tu-app.onrender.com/api-docs
   ```

3. **Verificar MongoDB**
   - En los logs de Render deberías ver:
   ```
   ✅ MongoDB Conectado: cluster0.xxxxx.mongodb.net
   📊 Base de datos: pizzeria_mamma_mia
   ```

---

## 📊 Paso 7: Poblar la Base de Datos (Opcional)

Si tu base de datos está vacía, puedes poblarla de dos formas:

### Opción A: Desde Render Shell

1. En Render Dashboard, click en tu servicio
2. Click en la pestaña "Shell" (parte superior)
3. Ejecuta:

```bash
node scripts/seedPizzas.js
node scripts/createAdmin.js
```

### Opción B: Desde Local con Connection String de Atlas

```bash
# Editar temporalmente backend/.env
MONGODB_URI=tu-atlas-connection-string

# Ejecutar seeds
cd backend
node scripts/seedPizzas.js
node scripts/createAdmin.js
```

---

## 🎨 Paso 8: Actualizar Frontend

Ahora que tienes la URL del backend, actualiza el frontend:

1. **Editar `.env` en la raíz del proyecto:**

```env
VITE_API_URL=https://tu-app.onrender.com
VITE_APP_NAME=Pizzería Mamma Mia
VITE_NODE_ENV=production
```

2. **Rebuild y Deploy:**

```bash
# Build
npm run build

# Deploy a GitHub Pages
npm run deploy
```

---

## 📝 Checklist de Render Deploy

- [ ] Cuenta en Render creada
- [ ] Repositorio conectado
- [ ] Web Service configurado
- [ ] Variables de entorno agregadas
- [ ] Deploy completado exitosamente
- [ ] API responde correctamente
- [ ] MongoDB conectado
- [ ] Base de datos poblada
- [ ] URL del backend copiada
- [ ] Frontend actualizado con nueva URL

---

## 🔧 Configuración Post-Deploy

### Logs y Monitoreo

1. **Ver Logs en Tiempo Real:**
   - Dashboard > Tu servicio > "Logs"
   - Aquí verás todas las peticiones y errores

2. **Eventos:**
   - Dashboard > Tu servicio > "Events"
   - Historial de deploys y cambios

### Auto-Deploy

Render está configurado para auto-deploy cuando hagas push a la rama `desarrollo`:

```bash
# Cualquier cambio que hagas y pushees se desplegará automáticamente
git add .
git commit -m "feat: algún cambio"
git push origin desarrollo
```

### Custom Domain (Opcional)

Si quieres usar tu propio dominio:
1. Settings > Custom Domains
2. Agrega tu dominio
3. Configura los DNS records

---

## 🐛 Troubleshooting

### Error: "Build failed"

**Problema:** npm install falla

**Solución:**
- Verifica que `backend/package.json` existe
- Verifica que "Root Directory" está en "backend"
- Revisa los logs para ver el error específico

### Error: "Application failed to respond"

**Problema:** El servidor no inicia

**Solución:**
- Verifica que PORT=5000 está en las variables de entorno
- Verifica que `npm start` funciona localmente
- Revisa los logs para ver el error

### Error: "Cannot connect to MongoDB"

**Problema:** No puede conectarse a Atlas

**Solución:**
- Verifica el MONGODB_URI
- Verifica que 0.0.0.0/0 está en MongoDB Atlas Network Access
- Verifica usuario y contraseña

### Servicio se duerme

**Problema:** El servicio tarda en responder la primera vez

**Solución:**
- Esto es normal en el plan Free
- El servicio se despierta automáticamente al recibir una petición
- Toma ~30 segundos en despertar
- Considera upgrade a plan Starter ($7/mes) para servicio 24/7

---

## 💡 Tips Pro

1. **Variables de Entorno:**
   - Puedes editar las variables en cualquier momento en Settings
   - Cambios en variables requieren re-deploy manual

2. **Logs:**
   - Los logs se mantienen por 7 días en el plan Free
   - Usa console.log() para debug

3. **Performance:**
   - El plan Free es suficiente para 100-200 usuarios simultáneos
   - Si necesitas más, considera Starter plan

4. **Seguridad:**
   - Cambia ADMIN_PASSWORD después del primer deploy
   - Nunca compartas tus variables de entorno
   - Usa JWT_SECRET generado por Render

---

## 🎯 URL Final

Tu backend estará disponible en:

```
https://pizzeria-mamma-mia-backend.onrender.com
```

Documentación API:
```
https://pizzeria-mamma-mia-backend.onrender.com/api-docs
```

---

## 📚 Recursos Útiles

- [Render Docs](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [Environment Variables](https://render.com/docs/environment-variables)
- [Render Status](https://status.render.com/)

---

**¡Felicidades!** 🎉 Tu backend está ahora en producción.

**Próximo paso:** Deploy del frontend a GitHub Pages con la nueva URL del backend.
