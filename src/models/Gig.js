const mongoose = require('mongoose');

const GigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {       
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',  // Reference to the Category model
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,  // Ensures that the amount can't be negative
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model (GigWorker)
    required: true,
  },
  skills: [String],  // Array of skills the gig requires
  deliveryTime: {
    type: Number,  // In days
    required: true,
  },
  images: [String],  // Array to store URLs of images related to the gig
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',  // The default status is 'active'
  },

  rating: {
    type : Number,
    default: 0
  }
}, {
  timestamps: true,  // Automatically adds 'createdAt' and 'updatedAt'
});

module.exports = mongoose.model('Gig', GigSchema);
