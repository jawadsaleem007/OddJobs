// models/paymentMethodSchema.js
const mongoose = require('mongoose');

const PaymentMethodSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['credit_card', 'paypal'], required: true },
    details: {
        cardNumber: { type: String }, // For credit card
        expiryDate: { type: String }, // MM/YY format
        paypalEmail: { type: String }, // For PayPal
    },
    isDefault: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);