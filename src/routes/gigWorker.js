const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createPortfolio,
  getAnalytics,
  createPromotion,
  uploadCertification,
  updateProfile,
  getMessages,
  sendMessage,
  raiseDispute
} = require('../controllers/gigWorkerController');

/**
 * @swagger
 * /api/gig-worker/portfolio:
 *   post:
 *     summary: Create a portfolio item
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
router.post('/portfolio', auth, upload.array('images'), createPortfolio);

/**
 * @swagger
 * /api/gig-worker/analytics:
 *   get:
 *     summary: Get gig performance analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/analytics', auth, getAnalytics);

/**
 * @swagger
 * /api/gig-worker/promotion:
 *   post:
 *     summary: Create a promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 */
router.post('/promotion', auth, createPromotion);

/**
 * @swagger
 * /api/gig-worker/certification:
 *   post:
 *     summary: Upload certification
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 */
router.post('/certification', auth, upload.single('certificate'), uploadCertification);

/**
 * @swagger
 * /api/gig-worker/profile:
 *   put:
 *     summary: Update profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 */
router.put('/profile', auth, upload.single('profilePicture'), updateProfile);

/**
 * @swagger
 * /api/gig-worker/messages:
 *   get:
 *     summary: Get messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 */
router.get('/messages', auth, getMessages);

/**
 * @swagger
 * /api/gig-worker/messages:
 *   post:
 *     summary: Send message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 */
router.post('/messages', auth, sendMessage);

/**
 * @swagger
 * /api/gig-worker/dispute:
 *   post:
 *     summary: Raise dispute
 *     tags: [Disputes]
 *     security:
 *       - bearerAuth: []
 */
router.post('/dispute', auth, upload.array('evidence'), raiseDispute);

module.exports = router;