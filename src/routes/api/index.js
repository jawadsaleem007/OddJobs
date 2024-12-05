const express = require('express');
const router = express.Router();

const portfolioRoutes = require('./portfolio.routes');
const analyticsRoutes = require('./analytics.routes');
const promotionRoutes = require('./promotion.routes');
const certificationRoutes = require('./certification.routes');
const messageRoutes = require('./message.routes');
const disputeRoutes = require('./dispute.routes');

router.use('/portfolio', portfolioRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/promotion', promotionRoutes);
router.use('/certification', certificationRoutes);
router.use('/message', messageRoutes);
router.use('/dispute', disputeRoutes);

module.exports = router;