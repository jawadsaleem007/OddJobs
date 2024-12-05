const Review = require('../models/Review');
const { AppError } = require('../utils/errorHandler');
const NotificationService = require('../services/notificationService');

exports.getFlaggedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isFlagged: true })
      .populate('client', 'name email')
      .populate('gig', 'title');
    res.json(reviews);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.handleFlaggedReview = async (req, res, next) => {
  try {
    const { action } = req.body;
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    if (action === 'remove') {
      await review.remove();
      await NotificationService.sendAdminAlert(`Review ${review._id} has been removed`);
      return res.json({ message: 'Review removed successfully' });
    }

    review.isFlagged = false;
    await review.save();
    res.json(review);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};