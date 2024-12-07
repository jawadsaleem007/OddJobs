const express = require('express');
const router = express.Router();
const gigController = require('../controllers/gigController');
const userAuth = require('../middleware/userAuth');  // Import the userAuth middleware
const Review = require('../models/Review');  // Correct path to the Review model

// Route to create a new gig
router.post('/gigs', userAuth, gigController.createGig);

// Route to get all gigs for the logged-in Gig Worker
router.get('/gigs', userAuth, gigController.getAllGigs);

// Route to get a specific gig by ID
router.get('/gigs/:id', userAuth, gigController.getGigById);

// Route to update a gig
router.put('/gigs/:id', userAuth, gigController.updateGig);

// Route to delete a gig
router.delete('/gigs/:id', userAuth, gigController.deleteGig);

// Route to get all orders assigned to the Gig Worker
router.get('/orders', userAuth, gigController.getAllOrdersForWorker);

// Route to update the status of an order (e.g., "in_progress", "completed")
router.put('/orders/:id/status', userAuth, gigController.updateOrderStatus);


// Route to get all reviews for the Gig Worker
router.get('/reviews', userAuth, gigController.getReviewsForGigWorker);


// Route to get all reviews for a specific gig (GET /gigs/:id/reviews)
router.get('/:id/reviews', gigController.getAllReviewsForGig);

// Route to get all reviews for all gigs of the logged-in Gig Worker (GET /gigs/reviews)
router.get('/reviews', userAuth, gigController.getAllReviewsForAllGigs);

// Route to get analytics for a specific gig
router.get('/gigs/:id/analytics', userAuth, gigController.getGigAnalytics);

// Route to get all gig analytics for the logged-in Gig Worker
router.get('/gigs/analytics', userAuth, gigController.getAllGigAnalytics);



module.exports = router;
