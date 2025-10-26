// backend/routes/auth.js - Ejemplo de documentación

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar nuevo usuario
 *     description: Crea una nueva cuenta de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos o usuario ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     description: Autenticar usuario y obtener token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jp.devtravel@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Obtener perfil del usuario
 *     description: Retorna la información del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado - Token inválido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// ============================================
// backend/routes/pizzas.js - Ejemplo
// ============================================

/**
 * @swagger
 * /api/pizzas:
 *   get:
 *     tags: [Pizzas]
 *     summary: Obtener todas las pizzas
 *     description: Retorna el listado completo de pizzas disponibles
 *     responses:
 *       200:
 *         description: Lista de pizzas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 6
 *                 pizzas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pizza'
 */

/**
 * @swagger
 * /api/pizzas/{id}:
 *   get:
 *     tags: [Pizzas]
 *     summary: Obtener una pizza por ID
 *     description: Retorna los detalles de una pizza específica
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la pizza
 *     responses:
 *       200:
 *         description: Pizza encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 pizza:
 *                   $ref: '#/components/schemas/Pizza'
 *       404:
 *         description: Pizza no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/pizzas:
 *   post:
 *     tags: [Pizzas]
 *     summary: Crear nueva pizza
 *     description: Solo administradores pueden crear pizzas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - ingredients
 *             properties:
 *               name:
 *                 type: string
 *                 example: Margherita
 *               description:
 *                 type: string
 *                 example: Pizza clásica italiana
 *               price:
 *                 type: number
 *                 example: 5950
 *               img:
 *                 type: string
 *                 example: https://example.com/pizza.jpg
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["mozzarella", "tomate", "albahaca"]
 *     responses:
 *       201:
 *         description: Pizza creada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos de administrador
 */

// ============================================
// backend/routes/checkouts.js - Ejemplo
// ============================================

/**
 * @swagger
 * /api/checkouts:
 *   post:
 *     tags: [Checkouts]
 *     summary: Realizar un pedido
 *     description: Crea un nuevo pedido con las pizzas seleccionadas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     pizza:
 *                       type: string
 *                       description: ID de la pizza
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *                 example:
 *                   - pizza: "507f1f77bcf86cd799439011"
 *                     quantity: 2
 *                   - pizza: "507f1f77bcf86cd799439012"
 *                     quantity: 1
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 checkout:
 *                   $ref: '#/components/schemas/Checkout'
 *       401:
 *         description: No autorizado
 */