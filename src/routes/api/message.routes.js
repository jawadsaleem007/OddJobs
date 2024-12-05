const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { getMessages, sendMessage } = require('../../controllers/message/messageController');
const { validateMessage } = require('../../validators/message.validator');

/**
 * @swagger
 * /api/message:
 *   get:
 *     summary: Get messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', auth, getMessages);

/**
 * @swagger
 * /api/message:
 *   post:
 *     summary: Send message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', auth, validateMessage, sendMessage);

module.exports = router;