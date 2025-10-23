#!/bin/bash

# ============================================
# SCRIPT DE CONFIGURACIÓN INICIAL
# Pizzería Mamma Mía
# ============================================

echo "================================================"
echo "  🍕 PIZZERÍA MAMMA MÍA - SETUP"
echo "================================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Verificar Node.js
echo "1. Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js instalado: $NODE_VERSION"
else
    print_error "Node.js no está instalado"
    exit 1
fi

# 2. Verificar MongoDB
echo ""
echo "2. Verificando MongoDB..."
if systemctl is-active --quiet mongod; then
    print_success "MongoDB está corriendo"
else
    print_warning "MongoDB no está corriendo. Intentando iniciar..."
    sudo systemctl start mongod
    if systemctl is-active --quiet mongod; then
        print_success "MongoDB iniciado exitosamente"
    else
        print_error "No se pudo iniciar MongoDB"
        exit 1
    fi
fi

# 3. Instalar dependencias del backend
echo ""
echo "3. Instalando dependencias del backend..."
cd backend
if npm install; then
    print_success "Dependencias del backend instaladas"
else
    print_error "Error al instalar dependencias del backend"
    exit 1
fi

# Instalar dotenv si no está
if ! grep -q "dotenv" package.json; then
    echo "   Instalando dotenv..."
    npm install dotenv
fi

# 4. Configurar variables de entorno
echo ""
echo "4. Configurando variables de entorno..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        print_success "Archivo .env creado desde .env.example"
        print_warning "IMPORTANTE: Edita el archivo .env con tus configuraciones"
    else
        print_warning "No existe archivo .env.example"
        print_warning "Debes crear manualmente el archivo .env"
    fi
else
    print_warning "Archivo .env ya existe"
fi

# 5. Migrar datos de pizzas
echo ""
echo "5. Migrando datos de pizzas..."
if node scripts/seedPizzas.js; then
    print_success "Datos migrados exitosamente"
else
    print_warning "Error al migrar datos (puede que ya existan)"
fi

# 6. Crear usuario administrador
echo ""
echo "6. Creando usuario administrador..."
if node scripts/createAdmin.js; then
    print_success "Usuario administrador configurado"
else
    print_warning "Usuario administrador no se pudo crear (puede que ya exista)"
fi

# 7. Instalar dependencias del frontend
echo ""
echo "7. Instalando dependencias del frontend..."
cd ..
if npm install; then
    print_success "Dependencias del frontend instaladas"
else
    print_error "Error al instalar dependencias del frontend"
    exit 1
fi

# 8. Resumen final
echo ""
echo "================================================"
echo "  ✅ CONFIGURACIÓN COMPLETADA"
echo "================================================"
echo ""
echo "📝 PRÓXIMOS PASOS:"
echo ""
echo "1. Edita el archivo backend/.env con tus configuraciones"
echo "2. Inicia el backend:"
echo "   cd backend"
echo "   node index.js"
echo ""
echo "3. En otra terminal, inicia el frontend:"
echo "   npm run dev"
echo ""
echo "4. Accede a:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend: http://localhost:5000"
echo ""
echo "5. Credenciales de administrador:"
echo "   - Email: admin@pizzeria.com"
echo "   - Password: Admin123456!"
echo "   ⚠️  Cambia la contraseña después del primer login"
echo ""
echo "================================================"