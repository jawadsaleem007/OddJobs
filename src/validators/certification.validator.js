const { body, validationResult } = require('express-validator');

const validateCertification = [
  body('name').trim().notEmpty().withMessage('Certification name is required'),
  body('issuingOrganization').trim().notEmpty().withMessage('Issuing organization is required'),
  body('issueDate').isISO8601().withMessage('Valid issue date is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateCertification };