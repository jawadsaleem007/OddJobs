const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const createPortfolio = require('../../controllers/portfolio/create');
const { validatePortfolio } = require('../../validators/portfolio.validator');

/**
 * @swagger
 * /api/portfolio:
 *   post:
 *     summary: Create a portfolio item
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', auth, upload.array('images'), validatePortfolio, createPortfolio);

module.exports = router;