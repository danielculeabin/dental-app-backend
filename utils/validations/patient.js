const { check } = require('express-validator');

const baseValidation = [
  check('fullname').isLength({ min: 6 }),
  check('phone')
    .customSanitizer(value => value.replace(/\D/g, ''))
    .isMobilePhone('any')
    .withMessage('Please enter a valid mobile phone number'),
];

const validation = {
  create: [...baseValidation],
  update: baseValidation.map(rule => rule.optional())
};

module.exports = validation;