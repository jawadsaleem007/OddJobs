const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');

// Create a new payment method
router.post('/', 
  paymentMethodController.createPaymentMethod
);

// Get all payment methods
router.get('/', 
  paymentMethodController.getPaymentMethods
);

module.exports = router;