const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
const userAuth = require('../middleware/userAuth');

// Route to create a new discount offer for a gig
router.post('/discounts', userAuth, discountController.createDiscountOffer);

// Route to get all discount offers for the logged-in freelancer
router.get('/discounts', userAuth, discountController.getDiscountOffersForFreelancer);

// Route to get all discount offers for a specific gig
router.get('/discounts/:gigId', discountController.getDiscountOffersForGig);

module.exports = router;
