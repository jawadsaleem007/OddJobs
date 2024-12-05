const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const { uploadCertification } = require('../../controllers/certification/upload');
const { validateCertification } = require('../../validators/certification.validator');

/**
 * @swagger
 * /api/certification:
 *   post:
 *     summary: Upload certification
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', auth, upload.single('certificate'), validateCertification, uploadCertification);

module.exports = router;