const PaymentMethod = require('../models/PaymentMethod');
const mongoose = require('mongoose');

// Create a new payment method
exports.createPaymentMethod = async (req, res) => {
  try {
    const { type, details } = req.body;
    const userId = req.user._id; // Assuming authentication middleware adds user to req

    // Validate input
    if (!type || !['credit_card', 'paypal'].includes(type)) {
      return res.status(400).json({ message: 'Invalid payment method type' });
    }

    // Validate card details or PayPal email
    const validationErrors = validatePaymentDetails(type, details);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Invalid payment details', 
        errors: validationErrors 
      });
    }

    // Check for existing payment methods
    const existingPaymentMethods = await PaymentMethod.find({ 
      user: userId 
    });

    // If this is the first payment method, set as default
    const isDefault = existingPaymentMethods.length === 0;

    // Create new payment method
    const newPaymentMethod = new PaymentMethod({
      user: userId,
      type,
      details,
      isDefault
    });

    await newPaymentMethod.save();

    res.status(201).json({
      message: 'Payment method added successfully',
      paymentMethod: newPaymentMethod
    });
  } catch (error) {
    console.error('Error creating payment method:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get all payment methods for a user
exports.getPaymentMethods = async (req, res) => {
  try {
    const userId = req.user._id;

    const paymentMethods = await PaymentMethod.find({ 
      user: userId 
    }).select('-details.cardNumber -details.paypalEmail');

    res.status(200).json({
      message: 'Payment methods retrieved successfully',
      paymentMethods
    });
  } catch (error) {
    console.error('Error retrieving payment methods:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Validation helper function
function validatePaymentDetails(type, details) {
  const errors = [];

  if (type === 'credit_card') {
    // Basic credit card validation
    if (!details.cardNumber || !/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(details.cardNumber)) {
      errors.push('Invalid card number format');
    }

    if (!details.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(details.expiryDate)) {
      errors.push('Invalid expiry date format (MM/YY)');
    }
  } else if (type === 'paypal') {
    // Basic PayPal email validation
    if (!details.paypalEmail || !/^\S+@\S+\.\S+$/.test(details.paypalEmail)) {
      errors.push('Invalid PayPal email');
    }
  }

  return errors;
}