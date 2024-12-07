const mongoose = require('mongoose');

const DiscountOfferSchema = new mongoose.Schema({
  gig: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Gig', 
    required: true 
  },
  freelancer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  discountPercentage: { 
    type: Number, 
    required: true, 
    min: 0,
    max: 100 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  conditions: { 
    type: String, 
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('DiscountOffer', DiscountOfferSchema);
