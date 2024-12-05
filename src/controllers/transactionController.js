const Transaction = require('../models/Transaction');
const NotificationService = require('../services/notificationService');
const { AppError } = require('../utils/errorHandler');
const { validationResult } = require('express-validator');

exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.handleWithdrawalRequest = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation error', 400));
  }

  try {
    const { status } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');
    
    if (!transaction) {
      return next(new AppError('Transaction not found', 404));
    }
    
    await NotificationService.sendWithdrawalNotification(
      transaction.user,
      transaction
    );
    
    res.json(transaction);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};