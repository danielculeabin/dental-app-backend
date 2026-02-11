const { validationResult } = require('express-validator');
const { Appointment } = require('../models');

function AppointmentController() {}

// 1. Get all appointments
const all = async function (req, res) {
  try {
    const docs = await Appointment.find({}).populate({
      path: 'patient',
      strictPopulate: false,
    });

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

// 2. Create a new appointment
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
    patient: req.body.patient,
    dentNumber: req.body.dentNumber,
    diagnosis: req.body.diagnosis,
    price: req.body.price,
    date: req.body.date,
    time: req.body.time,
  };

  try {
    // ONLY TOUCH THE DB IF DATA IS VALID
    const doc = await Appointment.create(data);
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

AppointmentController.prototype = {
  all,
  create,
};

module.exports = AppointmentController;
