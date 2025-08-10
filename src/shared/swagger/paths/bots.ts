/**
 * @swagger
 * /api/user/{userId}/bots:
 *   post:
 *     tags:
 *       - Bots
 *     summary: Create a new bot
 *     description: Creates a new trading bot for the specified user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "firebase-user-id"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBotRequest'
 *           example:
 *             name: "My Trading Bot"
 *             status: "inactive"
 *             configuration:
 *               strategy: "momentum"
 *               parameters:
 *                 period: 14
 *                 threshold: 0.02
 *               riskSettings:
 *                 maxPositionSize: 1000
 *                 stopLoss: 0.05
 *                 takeProfit: 0.10
 *     responses:
 *       201:
 *         description: Bot created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bot'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     tags:
 *       - Bots
 *     summary: Get all bots for user
 *     description: Retrieves all trading bots for the specified user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "firebase-user-id"
 *     responses:
 *       200:
 *         description: Bots retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bot'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/user/{userId}/bots/{id}:
 *   get:
 *     tags:
 *       - Bots
 *     summary: Get bot by ID
 *     description: Retrieves a specific trading bot by its ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "firebase-user-id"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bot ID
 *         example: "bot-123"
 *     responses:
 *       200:
 *         description: Bot retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bot'
 *       404:
 *         description: Bot not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     tags:
 *       - Bots
 *     summary: Update bot
 *     description: Updates an existing trading bot
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "firebase-user-id"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bot ID
 *         example: "bot-123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBotRequest'
 *           example:
 *             name: "Updated Bot Name"
 *             status: "active"
 *             configuration:
 *               strategy: "momentum"
 *               parameters:
 *                 period: 20
 *                 threshold: 0.03
 *     responses:
 *       200:
 *         description: Bot updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bot'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Bot not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags:
 *       - Bots
 *     summary: Delete bot
 *     description: Deletes a trading bot
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "firebase-user-id"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bot ID
 *         example: "bot-123"
 *     responses:
 *       200:
 *         description: Bot deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bot deleted successfully"
 *       404:
 *         description: Bot not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
