const { validationResult } = require('express-validator');
const { Patient } = require('../models');

function PatientController() {}

// 1. Get all patients
const all = async function (req, res) {
  try {
    const docs = await Patient.find({}); 
    res.json({
      success: true,
      data: docs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// 2. Create a new patient 
const create = async function (req, res) {
  // CHECK FOR VALIDATION ERRORS FIRST
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array(),
    });
  }

  const data = {
    fullname: req.body.fullname,
    phone: req.body.phone,
  };

  try {
    // ONLY TOUCH THE DB IF DATA IS VALID
    const doc = await Patient.create(data); 
    res.status(201).json({
      success: true,
      data: doc,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

PatientController.prototype = {
  all,
  create,
};

module.exports = PatientController;