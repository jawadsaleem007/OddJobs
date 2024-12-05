const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const { raiseDispute } = require('../../controllers/dispute/create');
const { validateDispute } = require('../../validators/dispute.validator');

/**
 * @swagger
 * /api/dispute:
 *   post:
 *     summary: Raise dispute
 *     tags: [Disputes]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', auth, upload.array('evidence'), validateDispute, raiseDispute);

module.exports = router;