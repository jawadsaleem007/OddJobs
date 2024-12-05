const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  discountPercentage: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  code: { type: String, required: true, unique: true },
  maxUses: { type: Number },
  currentUses: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Promotion', PromotionSchema);