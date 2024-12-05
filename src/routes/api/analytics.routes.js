const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const getAnalytics = require('../../controllers/analytics/getAnalytics');

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get gig analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', auth, getAnalytics);

module.exports = router;