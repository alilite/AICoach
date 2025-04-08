const { body } = require('express-validator');

const userValidationRules = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('height').isNumeric().withMessage('Height must be a number'),
  body('weight').isNumeric().withMessage('Weight must be a number'),
  body('dob').isISO8601().toDate().withMessage('Date of birth must be a valid date'),
  body('goal').notEmpty().withMessage('Fitness goal is required'),
];

module.exports = {
  userValidationRules,
};
