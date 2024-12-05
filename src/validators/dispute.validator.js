const { body, validationResult } = require('express-validator');

const validateDispute = [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('reason').trim().notEmpty().withMessage('Dispute reason is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateDispute };