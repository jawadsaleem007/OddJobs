const Review = require('../models/Review');
const Gig = require('../models/Gig');
const mongoose = require('mongoose');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { gigId, rating, comment } = req.body;
    const clientId = req.user._id; // Assuming authentication middleware adds user to req

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(gigId)) {
      return res.status(400).json({ message: 'Invalid Gig ID' });
    }

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if client has already reviewed this gig
    const existingReview = await Review.findOne({ 
      gig: gigId, 
      client: clientId 
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this gig' });
    }

    // Create new review
    const newReview = new Review({
      gig: gigId,
      client: clientId,
      rating,
      comment
    });

    await newReview.save();

    // Update gig's average rating
    const reviews = await Review.find({ gig: gigId });
    const averageRating = reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length;
    
    await Gig.findByIdAndUpdate(gigId, { 
      rating: averageRating.toFixed(1) 
    });

    res.status(201).json({
      message: 'Review created successfully',
      review: newReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update an existing review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const clientId = req.user._id;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Review ID' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure only the review owner can update
    if (review.client.toString() !== clientId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this review' });
    }

    // Update review
    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Recalculate gig's average rating
    const gigReviews = await Review.find({ gig: review.gig });
    const averageRating = gigReviews.reduce((sum, rev) => sum + rev.rating, 0) / gigReviews.length;
    
    await Gig.findByIdAndUpdate(review.gig, { 
      rating: averageRating.toFixed(1) 
    });

    res.status(200).json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};