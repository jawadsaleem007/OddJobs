const DiscountOffer = require('../models/DiscountOffer');
const Gig = require('../models/Gig');
const { AppError } = require('../utils/errorHandler');

// Create a new discount offer for a gig
exports.createDiscountOffer = async (req, res, next) => {
  try {
    const { gigId, discountPercentage, startDate, endDate, conditions } = req.body;

    // Find the gig to make sure it belongs to the logged-in freelancer
    const gig = await Gig.findById(gigId);
    if (!gig || gig.freelancer.toString() !== req.user._id.toString()) {
      return next(new AppError('Gig not found or unauthorized', 403));
    }

    // Create a new discount offer
    const discountOffer = new DiscountOffer({
      gig: gigId,
      freelancer: req.user._id,
      discountPercentage,
      startDate,
      endDate,
      conditions
    });

    // Save the discount offer
    await discountOffer.save();
    res.status(201).json(discountOffer);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// Get all discount offers for the logged-in freelancer
exports.getDiscountOffersForFreelancer = async (req, res, next) => {
  try {
    const discountOffers = await DiscountOffer.find({ freelancer: req.user._id }).populate('gig');
    res.status(200).json(discountOffers);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// Get all discount offers for a specific gig
exports.getDiscountOffersForGig = async (req, res, next) => {
  try {
    const gigId = req.params.gigId;
    const discountOffers = await DiscountOffer.find({ gig: gigId });
    if (!discountOffers || discountOffers.length === 0) {
      return next(new AppError('No discount offers found for this gig', 404));
    }
    res.status(200).json(discountOffers);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
