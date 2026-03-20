const { validationResult } = require('express-validator');
const { Patient } = require('../models');

function PatientController() {}

//* I. Create New Patient 
const create = async function (req, res) {
  //Check for validation errors first!
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
    //Only touch the DB if the Data is Valid!
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

//* II. A Get All Patients
const showAll = async function (req, res) {
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

//* II.B Show One Patient
const showOne = async function (req, res) {
  const id = req.params.id;

  try {
    const patient = await Patient.findById(id).populate('appointments').exec();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'PATIENT NOT FOUND',
      });
    }

    res.json({
      success: true,
      data: patient,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'INVALID_ID_FORMAT',
    });
  }
};

//* III. Update Existing Patient
const update = async function (req, res) {
  const patientId = req.params.id;

  //Check for validation errors first
  const errors = validationResult(req);

  if (!errors.isEmpty()){
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
    const doc = await Patient.findByIdAndUpdate(
      patientId,
      { $set: data},
      { new: true }, // returns the updated document
    );

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'PATIENT_NOT_FOUND',
      });
    }

    res.json({
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

//* IV. Delete Existing Patient
const remove = async function (req, res) {
  const id = req.params.id;

  try {
    const doc = await Patient.findByIdAndDelete(id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'PATIENT_NOT_FOUND',
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

PatientController.prototype = {
  create,
  showOne,
  showAll,
  update,
  remove,
};

module.exports = PatientController;
