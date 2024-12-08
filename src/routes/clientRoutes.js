const express = require('express');
const router = express.Router();
const { getSavedGigs, saveGig, removeSavedGig ,getClientOrders,placeCustomOrder} = require('../controllers/clientController');// Assuming protect middleware exists for authentication
const userAuth = require('../middleware/userAuth');

// Get all saved gigs
router.get('/saved-gigs',userAuth, getSavedGigs);

// Save a new gig to the wishlist
router.post('/saved-gigs',userAuth, saveGig);

// Remove a gig from the saved list
router.delete('/saved-gigs/:id',userAuth, removeSavedGig);



module.exports = router;
