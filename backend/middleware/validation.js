const { body, validationResult } = require('express-validator');

// Validation middleware for user registration
const validateUserRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for user login
const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for movie ID
const validateMovieId = [
  body('movieId')
    .isMongoId()
    .withMessage('Invalid movie ID format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for booking
const validateBooking = [
  body('movieId')
    .isMongoId()
    .withMessage('Invalid movie ID format'),
  body('screenId')
    .isMongoId()
    .withMessage('Invalid screen ID format'),
  body('seats')
    .isArray({ min: 1 })
    .withMessage('At least one seat must be selected'),
  body('seats.*')
    .isString()
    .withMessage('Each seat must be a valid string'),
  body('showTime')
    .isISO8601()
    .withMessage('Invalid show time format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for coupon creation
const validateCouponCreation = [
  body('code')
    .isLength({ min: 3, max: 20 })
    .withMessage('Coupon code must be between 3 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Coupon code can only contain uppercase letters and numbers'),
  body('description')
    .isLength({ min: 5, max: 200 })
    .withMessage('Description must be between 5 and 200 characters'),
  body('discountType')
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be either percentage or fixed'),
  body('discountValue')
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number'),
  body('minimumPurchase')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum purchase must be a positive number'),
  body('maximumDiscount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum discount must be a positive number'),
  body('validFrom')
    .isISO8601()
    .withMessage('Valid from must be a valid date'),
  body('validUntil')
    .isISO8601()
    .withMessage('Valid until must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.validFrom)) {
        throw new Error('Valid until must be after valid from');
      }
      return true;
    }),
  body('usageLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Usage limit must be a positive integer'),
  body('applicableMovies')
    .optional()
    .isArray()
    .withMessage('Applicable movies must be an array'),
  body('applicableMovies.*')
    .optional()
    .isMongoId()
    .withMessage('Each applicable movie must be a valid ID'),
  body('applicableUsers')
    .optional()
    .isArray()
    .withMessage('Applicable users must be an array'),
  body('applicableUsers.*')
    .optional()
    .isMongoId()
    .withMessage('Each applicable user must be a valid ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for coupon update
const validateCouponUpdate = [
  body('description')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Description must be between 5 and 200 characters'),
  body('discountType')
    .optional()
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be either percentage or fixed'),
  body('discountValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number'),
  body('minimumPurchase')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum purchase must be a positive number'),
  body('maximumDiscount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum discount must be a positive number'),
  body('validFrom')
    .optional()
    .isISO8601()
    .withMessage('Valid from must be a valid date'),
  body('validUntil')
    .optional()
    .isISO8601()
    .withMessage('Valid until must be a valid date')
    .custom((value, { req }) => {
      if (req.body.validFrom && new Date(value) <= new Date(req.body.validFrom)) {
        throw new Error('Valid until must be after valid from');
      }
      return true;
    }),
  body('usageLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Usage limit must be a positive integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Is active must be a boolean'),
  body('applicableMovies')
    .optional()
    .isArray()
    .withMessage('Applicable movies must be an array'),
  body('applicableMovies.*')
    .optional()
    .isMongoId()
    .withMessage('Each applicable movie must be a valid ID'),
  body('applicableUsers')
    .optional()
    .isArray()
    .withMessage('Applicable users must be an array'),
  body('applicableUsers.*')
    .optional()
    .isMongoId()
    .withMessage('Each applicable user must be a valid ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateMovieId,
  validateBooking,
  validateCouponCreation,
  validateCouponUpdate
};
