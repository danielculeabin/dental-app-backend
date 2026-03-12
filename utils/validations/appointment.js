const { check } = require('express-validator');

const baseValidation = [
  check('dentNumber').isInt({ min: 1, max: 48 }),
  check('price').isInt({ min: 0, max: 2500 }),
  check('diagnosis').isLength({ min: 3, max: 50 }),
  check('date').isLength({ min: 3, max: 50 }),
  check('time').isLength({ min: 3, max: 50 }),
];

const validation = {
  create: [
    ...baseValidation,
    check('patient').isMongoId(),
  ],
  update: baseValidation.map(rule => rule.optional()) // Logic: "Same rules, but you don't HAVE to send all of them"
};

module.exports = validation;
