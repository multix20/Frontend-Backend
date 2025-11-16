# 🗄️ Configuración de MongoDB Atlas - Paso a Paso

Esta guía te ayudará a configurar MongoDB Atlas para tu aplicación en producción.

---

## 📋 Paso 1: Crear Cuenta en MongoDB Atlas

1. **Ir a MongoDB Atlas**
   - URL: https://www.mongodb.com/cloud/atlas/register
   - Crear cuenta gratuita (puedes usar tu email o Google/GitHub)

2. **Verificar Email**
   - Revisa tu correo y verifica la cuenta

---

## 🏗️ Paso 2: Crear un Cluster Gratuito

1. **Crear Nuevo Proyecto**
   - Click en "New Project"
   - Nombre: `Pizzeria-Mamma-Mia`
   - Click en "Create Project"

2. **Build a Database**
   - Click en "Build a Database"
   - Selecciona **M0 FREE** (Tier gratuito)
   - Provider: **AWS** (recomendado)
   - Region: **us-east-1 (N. Virginia)** o la más cercana
   - Cluster Name: `Cluster0` (o el nombre que prefieras)
   - Click en "Create"

⏳ **Espera 1-3 minutos** mientras se crea el cluster.

---

## 🔐 Paso 3: Configurar Seguridad

### 3.1 Crear Usuario de Base de Datos

1. **Security Quickstart** aparecerá automáticamente
2. **Autenticación:**
   - Username: `pizzeria_admin` (o el que prefieras)
   - Password: **Genera una contraseña segura y guárdala**
   - ⚠️ **IMPORTANTE:** Guarda esta contraseña, la necesitarás después
   - Click en "Create User"

### 3.2 Configurar Acceso de Red

1. **IP Access List:**
   - Click en "Add IP Address"
   - Selecciona: **"Allow Access from Anywhere"**
   - Esto agrega: `0.0.0.0/0`
   - ⚠️ **Nota:** En producción real, usa IPs específicas
   - Click en "Add Entry"

2. **Finish and Close**
   - Click en "Finish and Close"
   - Click en "Go to Databases"

---

## 🔗 Paso 4: Obtener Connection String

1. **Click en "Connect"** (botón en tu cluster)

2. **Selecciona "Drivers"**
   - Driver: **Node.js**
   - Version: **5.5 or later**

3. **Copiar Connection String**

   Verás algo como:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

4. **Personalizar el String**

   Reemplaza:
   - `<username>` → tu usuario (ej: `pizzeria_admin`)
   - `<password>` → tu contraseña
   - Agrega el nombre de la base de datos antes de `?`

   **Ejemplo final:**
   ```
   mongodb+srv://pizzeria_admin:TuPassword123@cluster0.xxxxx.mongodb.net/pizzeria_mamma_mia?retryWrites=true&w=majority
   ```

5. **⚠️ GUARDAR este string** - Lo necesitarás para Render

---

## 📊 Paso 5: Migrar Datos (Opcional)

Si quieres migrar tus datos locales a Atlas:

### Opción A: Export/Import Manual

```bash
# 1. Exportar datos locales
mongodump --db pizzeria_mamma_mia --out backup

# 2. Importar a Atlas
mongorestore --uri "tu-connection-string-completo" backup/pizzeria_mamma_mia
```

### Opción B: Usar MongoDB Compass

1. Descargar [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Conectar a tu MongoDB local
3. Exportar colecciones (pizzas, users, orders)
4. Conectar a MongoDB Atlas con el connection string
5. Importar las colecciones

### Opción C: Seed Script en Producción

Puedes ejecutar tu script de seed directamente en producción:

```bash
# Una vez que el backend esté en Render, ejecuta:
node backend/scripts/seedPizzas.js
node backend/scripts/createAdmin.js
```

---

## ✅ Paso 6: Verificar Conexión

1. **En MongoDB Atlas Dashboard:**
   - Ve a "Database" > "Browse Collections"
   - Deberías ver tus colecciones (si las migraste)

2. **Probar localmente (opcional):**

```bash
# Editar backend/.env temporalmente
MONGODB_URI=tu-connection-string-de-atlas

# Reiniciar el backend
cd backend
npm run dev

# Verificar en los logs que conectó a Atlas
```

---

## 📝 Checklist de MongoDB Atlas

- [ ] Cuenta creada y verificada
- [ ] Proyecto "Pizzeria-Mamma-Mia" creado
- [ ] Cluster M0 Free creado
- [ ] Usuario de base de datos creado
- [ ] Contraseña guardada de forma segura
- [ ] IP 0.0.0.0/0 agregada a whitelist
- [ ] Connection string copiado y personalizado
- [ ] (Opcional) Datos migrados

---

## 🎯 Próximo Paso

Una vez completado esto, tendrás:

✅ **Connection String para Render:**
```
mongodb+srv://pizzeria_admin:TuPassword123@cluster0.xxxxx.mongodb.net/pizzeria_mamma_mia?retryWrites=true&w=majority
```

**Guardar como variable de entorno:**
- Nombre: `MONGODB_URI`
- Valor: Tu connection string completo

---

## 🐛 Troubleshooting

### Error: "Authentication failed"
- ✅ Verifica usuario y contraseña en el connection string
- ✅ Verifica que el usuario existe en Database Access

### Error: "IP not whitelisted"
- ✅ Ve a Network Access
- ✅ Verifica que 0.0.0.0/0 está en la lista
- ✅ Espera 1-2 minutos para que se aplique

### Error: "Timeout"
- ✅ Verifica tu conexión a internet
- ✅ Intenta cambiar de región del cluster

---

## 📚 Recursos

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Connection String Format](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [MongoDB Compass](https://www.mongodb.com/products/compass)

---

**¡Listo!** Una vez que tengas tu connection string, continúa con el deploy del backend a Render.
