const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Create a new review
router.post('/', 
  reviewController.createReview
);

// Update an existing review
router.put('/:id', 
  reviewController.updateReview
);

module.exports = router;