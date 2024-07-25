const { body } = require('express-validator');

const loginValidators = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password cannot be empty'),
];

module.exports = { loginValidators };
