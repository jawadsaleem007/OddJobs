const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: [
      'pending', 
      'in_progress', 
      'completed', 
      'cancelled', 
      'disputed'
    ],
    default: 'pending'
  },
  deliveryDate: {
    type: Date
  },
  milestones: [{
    description: String,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    }
  }],
  reviews: {
    clientReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      createdAt: Date
    },
    freelancerReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      createdAt: Date
    }
  }
}, {
  timestamps: true
});

// Indexes to improve query performance
OrderSchema.index({ freelancer: 1, status: 1 });
OrderSchema.index({ client: 1, status: 1 });

module.exports = mongoose.model('Order', OrderSchema);