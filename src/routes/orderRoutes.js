const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const userAuth = require('../middleware/userAuth');

// Route to create a new order for a gig (client can only order a gig)
router.post('/orders', userAuth, orderController.createOrder);

// Route to get all orders placed by the logged-in client
router.get('/orders', userAuth, orderController.getClientOrders);

// Route to get order details by order ID
router.get('/orders/:orderId', userAuth, orderController.getOrderById);

module.exports = router;
