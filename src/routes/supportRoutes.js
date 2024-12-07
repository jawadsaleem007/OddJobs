const express = require('express');
const router = express.Router();
const supportTicketController = require('../controllers/supportController');
const userAuth = require('../middleware/userAuth'); // Assuming userAuth is middleware for authentication

// Route for both gig worker and client to create a support ticket
router.post('/support-tickets', userAuth, supportTicketController.addTicket);

module.exports = router;
