/**
 * @swagger
 * /api/user/{userId}/backtest/{botId}:
 *   get:
 *     tags:
 *       - Backtest
 *     summary: Run backtest for a bot
 *     description: Starts a backtest for the specified bot using Server-Sent Events (SSE)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "firebase-user-id"
 *       - in: path
 *         name: botId
 *         required: true
 *         schema:
 *           type: string
 *         description: Bot ID to run backtest for
 *         example: "bot-123"
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for backtest
 *         example: "2023-01-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for backtest
 *         example: "2023-12-31"
 *     responses:
 *       200:
 *         description: Backtest stream started successfully
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               description: Server-Sent Events stream with backtest progress and results
 *             example: |
 *               data: {"type": "progress", "message": "Starting backtest...", "progress": 0}
 *               
 *               data: {"type": "progress", "message": "Processing historical data...", "progress": 25}
 *               
 *               data: {"type": "result", "message": "Backtest completed", "results": {...}}
 *               
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Invalid date range"
 *       404:
 *         description: Bot not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Bot not found"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized access"
 */
