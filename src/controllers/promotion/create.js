const Promotion = require('../../models/Promotion');
const Gig = require('../../models/Gig');
const { handleError } = require('../../utils/errorHandler');

const createPromotion = async (req, res) => {
  try {
    const { gigId, discountPercentage, startDate, endDate, code, maxUses } = req.body;

    // Verify gig ownership
    const gig = await Gig.findOne({ _id: gigId, createdBy: req.user.id });
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found or unauthorized' });
    }

    // Check for existing promotion with same code
    const existingPromotion = await Promotion.findOne({ code });
    if (existingPromotion) {
      return res.status(400).json({ error: 'Promotion code already exists' });
    }

    const promotion = new Promotion({
      gig: gigId,
      discountPercentage,
      startDate,
      endDate,
      code,
      maxUses,
      active: true
    });

    await promotion.save();
    res.status(201).json(promotion);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { createPromotion };