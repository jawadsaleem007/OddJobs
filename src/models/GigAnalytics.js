const mongoose = require('mongoose');

const GigAnalyticsSchema = new mongoose.Schema({
  gig: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Gig', 
    required: true
  },
  views: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  orders: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GigAnalytics', GigAnalyticsSchema);
