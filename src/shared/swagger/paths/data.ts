/**
 * @swagger
 * /api/data/klines:
 *   post:
 *     tags:
 *       - Data
 *     summary: Get klines data
 *     description: Retrieves klines (candlestick) data for specified base assets and interval
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               baseAssets:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of base asset symbols
 *                 example: ["BTC", "ETH", "ADA"]
 *               interval:
 *                 type: string
 *                 description: Time interval for klines data
 *                 example: "1h"
 *                 enum: ["1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M"]
 *             required:
 *               - baseAssets
 *               - interval
 *           example:
 *             baseAssets: ["BTC", "ETH"]
 *             interval: "1h"
 *     responses:
 *       200:
 *         description: Klines data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Klines data response
 *                   additionalProperties: true
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Missing or invalid required parameter: baseAssets (must be an array)"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to get klines data"
 */
