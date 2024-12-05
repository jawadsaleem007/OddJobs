const { body, validationResult } = require('express-validator');

const validatePromotion = [
  body('gigId').notEmpty().withMessage('Gig ID is required'),
  body('discountPercentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount percentage must be between 0 and 100'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('code').notEmpty().withMessage('Promotion code is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validatePromotion };