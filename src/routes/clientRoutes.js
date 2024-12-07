const express = require('express');
const router = express.Router();
const { trackGigView, trackGigClick } = require('../controllers/clientController');
const userAuth = require('../middleware/auth');  // Assuming userAuth middleware is used to authenticate clients

// Route to track a gig view
router.post('/gigs/:id/view', userAuth, trackGigView);

// Route to track a gig click
router.post('/gigs/:id/click', userAuth, trackGigClick);

module.exports = router;
