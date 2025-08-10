/**
 * @swagger
 * /api/auth/verify-token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify Firebase ID token
 *     description: Verifies a Firebase ID token and returns user information
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyTokenRequest'
 *           example:
 *             idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2NzAyN..."
 *     responses:
 *       200:
 *         description: Token verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyTokenResponse'
 *             example:
 *               user:
 *                 uid: "firebase-user-id"
 *                 email: "user@example.com"
 *                 emailVerified: true
 *                 displayName: "John Doe"
 *                 photoURL: null
 *                 disabled: false
 *       400:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Invalid token"
 *       401:
 *         description: Token verification failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Token verification failed"
 */

/**
 * @swagger
 * /api/auth/user/{uid}:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current user information
 *     description: Retrieves user information by Firebase UID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: Firebase user UID
 *         example: "firebase-user-id"
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/VerifyTokenResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 404
 *                 error:
 *                   type: string
 *                   example: "User not found"
 */
