#!/bin/bash

# ============================================
# Script de Pruebas Automatizadas
# API Pizzería Mamma Mia
# ============================================

API_URL="http://localhost:5000"
TOKEN=""
ADMIN_TOKEN=""
ORDER_ID=""
PIZZA_ID=""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Contador de pruebas
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Función para imprimir headers
print_header() {
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}========================================${NC}"
}

# Función para imprimir resultado
print_result() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASSED${NC}: $2"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAILED${NC}: $2"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Función para verificar respuesta
check_response() {
    local response=$1
    local expected_field=$2
    local test_name=$3
    
    if echo "$response" | jq -e ".$expected_field" > /dev/null 2>&1; then
        print_result 0 "$test_name"
        return 0
    else
        print_result 1 "$test_name"
        echo -e "${RED}Response: $response${NC}"
        return 1
    fi
}

# Función para pausa
pause() {
    sleep 0.5
}

echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🧪 PRUEBAS AUTOMATIZADAS DE API      ║${NC}"
echo -e "${BLUE}║     Pizzería Mamma Mia                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# ============================================
# VERIFICAR QUE EL SERVIDOR ESTÉ CORRIENDO
# ============================================
print_header "0️⃣  VERIFICACIÓN PRELIMINAR"

echo "Verificando conexión al servidor..."
if curl -s --max-time 5 "$API_URL" > /dev/null; then
    echo -e "${GREEN}✅ Servidor respondiendo en $API_URL${NC}"
else
    echo -e "${RED}❌ Error: El servidor no está respondiendo${NC}"
    echo "Por favor, inicia el servidor con: node index.js"
    exit 1
fi

pause

# ============================================
# 1. PRUEBAS DE RUTA RAÍZ
# ============================================
print_header "1️⃣  PRUEBAS DE INFORMACIÓN GENERAL"

echo "TEST: GET / (Información de API)"
RESPONSE=$(curl -s -X GET "$API_URL/")
check_response "$RESPONSE" "message" "Obtener información de API"
echo "$RESPONSE" | jq '.'

pause

# ============================================
# 2. PRUEBAS DE PIZZAS (PÚBLICAS)
# ============================================
print_header "2️⃣  PRUEBAS DE PIZZAS (ENDPOINTS PÚBLICOS)"

# 2.1 Listar todas las pizzas
echo ""
echo -e "${YELLOW}TEST: GET /api/pizzas${NC}"
RESPONSE=$(curl -s -X GET "$API_URL/api/pizzas")
if echo "$RESPONSE" | jq -e '.[0].name' > /dev/null 2>&1; then
    PIZZA_COUNT=$(echo "$RESPONSE" | jq '. | length')
    print_result 0 "Listar pizzas (Total: $PIZZA_COUNT)"
    echo "$RESPONSE" | jq '.[] | {id, name, price}'
else
    print_result 1 "Listar pizzas"
fi

pause

# 2.2 Obtener pizza específica
echo ""
echo -e "${YELLOW}TEST: GET /api/pizzas/p001${NC}"
RESPONSE=$(curl -s -X GET "$API_URL/api/pizzas/p001")
check_response "$RESPONSE" "name" "Obtener pizza específica (p001)"
echo "$RESPONSE" | jq '{id, name, price, ingredients}'

pause

# 2.3 Pizza no encontrada
echo ""
echo -e "${YELLOW}TEST: GET /api/pizzas/p999 (no existe)${NC}"
RESPONSE=$(curl -s -X GET "$API_URL/api/pizzas/p999")
check_response "$RESPONSE" "error" "Manejo de pizza no encontrada"
echo "$RESPONSE" | jq '.'

pause

# ============================================
# 3. PRUEBAS DE AUTENTICACIÓN
# ============================================
print_header "3️⃣  PRUEBAS DE AUTENTICACIÓN"

# 3.1 Registrar usuario normal
echo ""
echo -e "${YELLOW}TEST: POST /api/auth/register (Usuario Normal)${NC}"
TIMESTAMP=$(date +%s)
RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"user${TIMESTAMP}@test.com\",
    \"password\": \"123456\",
    \"name\": \"Usuario Test ${TIMESTAMP}\"
  }")

if check_response "$RESPONSE" "token" "Registrar usuario normal"; then
    TOKEN=$(echo "$RESPONSE" | jq -r '.token')
    USER_EMAIL=$(echo "$RESPONSE" | jq -r '.user.email')
    echo -e "${GREEN}Token guardado: ${TOKEN:0:30}...${NC}"
    echo -e "${GREEN}Email: $USER_EMAIL${NC}"
    echo "$RESPONSE" | jq '{message, user: {email, name, role}}'
fi

pause

# 3.2 Intentar registrar el mismo email
echo ""
echo -e "${YELLOW}TEST: POST /api/auth/register (Email duplicado)${NC}"
RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$USER_EMAIL\",
    \"password\": \"123456\",
    \"name\": \"Usuario Duplicado\"
  }")
check_response "$RESPONSE" "error" "Manejo de email duplicado"
echo "$RESPONSE" | jq '.'

pause

# 3.3 Login con credenciales correctas
echo ""
echo -e "${YELLOW}TEST: POST /api/auth/login (Credenciales correctas)${NC}"
RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$USER_EMAIL\",
    \"password\": \"123456\"
  }")

if check_response "$RESPONSE" "token" "Login con credenciales correctas"; then
    TOKEN=$(echo "$RESPONSE" | jq -r '.token')
    echo -e "${GREEN}Token actualizado${NC}"
    echo "$RESPONSE" | jq '{message, user: {email, name, role}}'
fi

pause

# 3.4 Login con credenciales incorrectas
echo ""
echo -e "${YELLOW}TEST: POST /api/auth/login (Credenciales incorrectas)${NC}"
RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$USER_EMAIL\",
    \"password\": \"wrong_password\"
  }")
check_response "$RESPONSE" "error" "Manejo de credenciales incorrectas"
echo "$RESPONSE" | jq '.'

pause

# 3.5 Obtener perfil sin token
echo ""
echo -e "${YELLOW}TEST: GET /api/auth/profile (Sin token)${NC}"
RESPONSE=$(curl -s -X GET "$API_URL/api/auth/profile")
check_response "$RESPONSE" "error" "Manejo de petición sin token"
echo "$RESPONSE" | jq '.'

pause

# 3.6 Obtener perfil con token válido
echo ""
echo -e "${YELLOW}TEST: GET /api/auth/profile (Con token válido)${NC}"
RESPONSE=$(curl -s -X GET "$API_URL/api/auth/profile" \
  -H "Authorization: Bearer $TOKEN")
check_response "$RESPONSE" "user" "Obtener perfil con token válido"
echo "$RESPONSE" | jq '.'

pause

# 3.7 Actualizar perfil
echo ""
echo -e "${YELLOW}TEST: PUT /api/auth/profile (Actualizar nombre)${NC}"
RESPONSE=$(curl -s -X PUT "$API_URL/api/auth/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"Nombre Actualizado ${TIMESTAMP}\"
  }")
check_response "$RESPONSE" "message" "Actualizar perfil"
echo "$RESPONSE" | jq '.'

pause

# ============================================
# 4. PRUEBAS DE CHECKOUT
# ============================================
print_header "4️⃣  PRUEBAS DE CHECKOUT (ÓRDENES)"

# 4.1 Crear orden como guest (sin autenticación)
echo ""
echo -e "${YELLOW}TEST: POST /api/checkouts (Como guest)${NC}"
RESPONSE=$(curl -s -X POST "$API_URL/api/checkouts" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "id": "p001", "quantity": 2 },
      { "id": "p003", "quantity": 1 }
    ],
    "email": "guest@test.com",
    "deliveryAddress": {
      "street": "Calle Test 123",
      "city": "Santiago",
      "postalCode": "12345",
      "phone": "+56912345678"
    },
    "paymentMethod": "cash",
    "notes": "Orden de prueba como guest"
  }')

if check_response "$RESPONSE" "order" "Crear orden como guest"; then
    echo "$RESPONSE" | jq '{message, order: {id, email, total, status, items: .order.items | length}}'
fi

pause

# 4.2 Crear orden autenticado
echo ""
echo -e "${YELLOW}TEST: POST /api/checkouts (Usuario autenticado)${NC}"
RESPONSE=$(curl -s -X POST "$API_URL/api/checkouts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"items\": [
      { \"id\": \"p002\", \"quantity\": 1 },
      { \"id\": \"p005\", \"quantity\": 2 }
    ],
    \"email\": \"$USER_EMAIL\",
    \"paymentMethod\": \"card\",
    \"notes\": \"Orden de prueba autenticada\"
  }")

if check_response "$RESPONSE" "order" "Crear orden autenticado"; then
    ORDER_ID=$(echo "$RESPONSE" | jq -r '.order.id')
    ORDER_TOTAL=$(echo "$RESPONSE" | jq -r '.order.total')
    echo -e "${GREEN}Order ID guardado: $ORDER_ID${NC}"
    echo -e "${GREEN}Total: \$$ORDER_TOTAL${NC}"
    echo "$RESPONSE" | jq '{message, order: {id, email, total, status}}'
fi

pause

# 4.3 Crear orden con pizza inexistente
echo ""
echo -e "${YELLOW}TEST: POST /api/checkouts (Pizza inexistente)${NC}"
RESPONSE=$(curl -s -X POST "$API_URL/api/checkouts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [
      { "id": "p999", "quantity": 1 }
    ],
    "email": "test@test.com"
  }')
check_response "$RESPONSE" "error" "Manejo de pizza inexistente"
echo "$RESPONSE" | jq '.'

pause

# 4.4 Crear orden sin items
echo ""
echo -e "${YELLOW}TEST: POST /api/checkouts (Sin items)${NC}"
RESPONSE=$(curl -s -X POST "$API_URL/api/checkouts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [],
    "email": "test@test.com"
  }')
check_response "$RESPONSE" "error" "Manejo de carrito vacío"
echo "$RESPONSE" | jq '.'

pause

# 4.5 Listar órdenes sin autenticación
echo ""
echo -e "${YELLOW}TEST: GET /api/checkouts (Sin autenticación)${NC}"
RESPONSE=$(curl -s -X GET "$API_URL/api/checkouts")
check_response "$RESPONSE" "error" "Manejo de listado sin auth"
echo "$RESPONSE" | jq '.'

pause

# 4.6 Listar órdenes autenticado
echo ""
echo -e "${YELLOW}TEST: GET /api/checkouts (Usuario autenticado)${NC}"
RESPONSE=$(curl -s -X GET "$API_URL/api/checkouts" \
  -H "Authorization: Bearer $TOKEN")

if check_response "$RESPONSE" "orders" "Listar órdenes del usuario"; then
    ORDER_COUNT=$(echo "$RESPONSE" | jq '.count')
    echo -e "${GREEN}Total de órdenes: $ORDER_COUNT${NC}"
    echo "$RESPONSE" | jq '{count, orders: .orders | map({id, email, total, status})}'
fi

pause

# 4.7 Obtener orden específica
if [ ! -z "$ORDER_ID" ] && [ "$ORDER_ID" != "null" ]; then
    echo ""
    echo -e "${YELLOW}TEST: GET /api/checkouts/$ORDER_ID${NC}"
    RESPONSE=$(curl -s -X GET "$API_URL/api/checkouts/$ORDER_ID" \
      -H "Authorization: Bearer $TOKEN")
    check_response "$RESPONSE" "items" "Obtener orden específica"
    echo "$RESPONSE" | jq '{_id, email, total, status, items: .items | length}'
fi

pause

# ============================================
# 5. PRUEBAS DE ERRORES 404
# ============================================
print_header "5️⃣  PRUEBAS DE MANEJO DE ERRORES"

# 5.1 Ruta no encontrada
echo ""
echo -e "${YELLOW}TEST: GET /api/noexiste${NC}"
RESPONSE=$(curl -s -X GET "$API_URL/api/noexiste")
check_response "$RESPONSE" "error" "Manejo de ruta no encontrada (404)"
echo "$RESPONSE" | jq '.'

pause

# 5.2 Orden con ID inválido
echo ""
echo -e "${YELLOW}TEST: GET /api/checkouts/invalid-id${NC}"
RESPONSE=$(curl -s -X GET "$API_URL/api/checkouts/invalid-id" \
  -H "Authorization: Bearer $TOKEN")
check_response "$RESPONSE" "error" "Manejo de ID inválido"
echo "$RESPONSE" | jq '.'

pause

# ============================================
# RESUMEN FINAL
# ============================================
print_header "📊 RESUMEN DE PRUEBAS"

echo ""
echo -e "${CYAN}Total de pruebas ejecutadas: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "${GREEN}✅ Pruebas exitosas: $PASSED_TESTS${NC}"
echo -e "${RED}❌ Pruebas fallidas: $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  🎉 TODAS LAS PRUEBAS PASARON         ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    EXIT_CODE=0
else
    echo -e "${RED}╔════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ⚠️  ALGUNAS PRUEBAS FALLARON          ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════╝${NC}"
    EXIT_CODE=1
fi

echo ""
echo -e "${CYAN}Endpoints probados:${NC}"
echo "  ✓ GET  /"
echo "  ✓ GET  /api/pizzas"
echo "  ✓ GET  /api/pizzas/:id"
echo "  ✓ POST /api/auth/register"
echo "  ✓ POST /api/auth/login"
echo "  ✓ GET  /api/auth/profile"
echo "  ✓ PUT  /api/auth/profile"
echo "  ✓ POST /api/checkouts"
echo "  ✓ GET  /api/checkouts"
echo "  ✓ GET  /api/checkouts/:id"
echo "  ✓ Manejo de errores 404"
echo ""

echo -e "${YELLOW}Variables guardadas:${NC}"
echo "  TOKEN: ${TOKEN:0:30}..."
echo "  ORDER_ID: $ORDER_ID"
echo "  USER_EMAIL: $USER_EMAIL"
echo ""

exit $EXIT_CODE
