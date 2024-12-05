const mongoose = require('mongoose');

const PlatformSettingsSchema = new mongoose.Schema({
  commissionPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 10
  },
  defaultDeliveryTime: {
    type: Number,
    required: true,
    default: 7
  },
  termsOfService: {
    type: String,
    required: true,
    default: 'Default Terms of Service'
  },
  minimumWithdrawalAmount: {
    type: Number,
    required: true,
    default: 50
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PlatformSettings', PlatformSettingsSchema);