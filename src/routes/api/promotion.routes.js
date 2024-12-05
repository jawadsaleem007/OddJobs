const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { createPromotion } = require('../../controllers/promotion/create');
const { validatePromotion } = require('../../validators/promotion.validator');

/**
 * @swagger
 * /api/promotion:
 *   post:
 *     summary: Create a promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', auth, validatePromotion, createPromotion);

module.exports = router;