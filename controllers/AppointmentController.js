const { validationResult } = require('express-validator');
const { Appointment, Patient } = require('../models');

const dayjs = require('dayjs');
const { sendSMS } = require('../utils');


function AppointmentController() {}

//* I. Create New Appointment
const create = async function (req, res) {
  // Check for validation errors first
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
    // 1. Verify patient exists and get their phone number
    const patientRecord = await Patient.findOne({ _id: data.patient });

    if (!patientRecord) {
      return res.status(404).json({
        success: false,
        message: 'PATIENT_NOT_FOUND',
      });
    }

    // 2. Save to Database
    const doc = await Appointment.create(data);

    // 3. Send Notification
    
    // Convert DD.MM.YYYY to YYYY-MM-DD for Day.js to parse it correctly
    const isoDate = data.date.split('.').reverse().join('-'); 
    const appointmentTime = dayjs(`${isoDate}T${data.time}`);

    // Calculate the Unix timestamp for the amount of time needed before the appointment
    const delayedTime = appointmentTime.subtract(1, 'hour').unix();

    const confirmationMessage = `Hello, ${patientRecord.fullname}! This is a message to confirm your appointment on ${data.date} at ${data.time}. We've got you on the calendar!`;
    const reminderMessage = `Hey ${patientRecord.fullname}, this is a reminder not to be late today! Your appointment is in 1 hour (at ${data.time}). See you soon!`;
    
    // await sendSMS(patientRecord.phone, confirmationMessage);  // send immediately
    await sendSMS(patientRecord.phone, reminderMessage, delayedTime); // send it later and open when instructed

    // 4. Final Response
    res.status(201).json({
      success: true,
      data: doc,
    });
  } catch (err) {
    // If the DB fails OR the SMS service fails, it ends up here
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//* II. Get All Appointments
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

//* III. Update Existing Appointment
const update = async function (req, res) {
  const appointmentId = req.params.id;

  //Check for validation errors first (Same as create)
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array(),
    });
  }

  const data = {
    dentNumber: req.body.dentNumber,
    diagnosis: req.body.diagnosis,
    price: req.body.price,
    date: req.body.date,
    time: req.body.time,
  };

  try {
    const doc = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: data }, 
      { new: true }, // returns the updated document
    );

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'APPOINTMENT_NOT_FOUND',
      });
    }

    res.json({
      success: true
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//* IV. Delete Existing Appointment 
const remove = async function (req, res) {
  const id = req.params.id;

  try {
    const doc = await Appointment.findOneAndDelete({ _id: id });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'APPOINTMENT_NOT_FOUND',
      });
    }

    res.json({
      success: true,
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
  update,
  remove,
};

module.exports = AppointmentController;
