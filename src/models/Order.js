const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'], 
      default: 'pending',
    },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['credit_card', 'paypal'], required: true },
    transactionId: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Order', OrderSchema);
  
  