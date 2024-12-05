const { body, query, param } = require('express-validator');

const categoryValidators = {
  create: [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    body('subcategories').isArray().optional()
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid category ID'),
    body('name').trim().notEmpty().optional(),
    body('subcategories').isArray().optional()
  ]
};

const transactionValidators = {
  withdrawal: [
    param('id').isMongoId().withMessage('Invalid transaction ID'),
    body('status').isIn(['pending', 'completed', 'failed']).withMessage('Invalid status')
  ],
  dateRange: [
    query('startDate').isISO8601().withMessage('Invalid start date'),
    query('endDate').isISO8601().withMessage('Invalid end date')
  ]
};

module.exports = {
  categoryValidators,
  transactionValidators
};