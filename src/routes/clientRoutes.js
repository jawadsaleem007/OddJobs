const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const clientController = require('../controllers/clientController');
const userAuth = require('../middleware/userAuth');



// Profile Routes
router.get('/profile', userAuth, clientController.getProfile);
router.put('/profile', userAuth, clientController.updateProfile);

// Saved Gigs Routes
router.get('/saved-gigs', userAuth, clientController.getSavedGigs);
router.post('/saved-gigs', userAuth, clientController.saveGig);
router.delete('/saved-gigs/:gigId', userAuth, clientController.removeSavedGig);

// Order Routes
router.post(
  '/orders',
  [
    userAuth,
    check('gigId', 'Gig ID is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('paymentMethod', 'Payment method is required').not().isEmpty()
  ],
  clientController.createOrder
);
router.get('/orders', userAuth, clientController.getOrders);
router.get('/orders/:id', userAuth, clientController.getOrderById);
router.put('/orders/:id', userAuth, clientController.updateOrder);

// Review Routes
router.post(
  '/reviews',
  [
    userAuth,
    check('gigId', 'Gig ID is required').not().isEmpty(),
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
    check('comment', 'Comment is required').not().isEmpty()
  ],
  clientController.createReview
);
router.put(
  '/reviews/:id',
  [
    userAuth,
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
    check('comment', 'Comment is required').not().isEmpty()
  ],
  clientController.updateReview
);

// Payment Method Routes
router.post(
  '/payment-methods',
  [
    userAuth,
    check('type', 'Payment method type is required').isIn(['credit_card', 'paypal']),
    check('details', 'Payment details are required').not().isEmpty()
  ],
  clientController.addPaymentMethod
);
router.get('/payment-methods', userAuth, clientController.getPaymentMethods);

module.exports = router;