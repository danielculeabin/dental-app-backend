const mongoose = require('mongoose');
const { Schema } = mongoose;

const PatientSchema = new Schema(
  {
    id: String,
    fullname: String,
    phone: String,
    //appointments: [{ type: Schema.Types.ObjectId, ref: 'Patient' }]
  },
  {
    timestamps: true,
    // CRITICAL: This allows virtuals to show up when you send JSON to Postman
    toJSON: { virtuals: true},
    toObject: { virtuals: true},
  },
);

// This is the "Connection" bridge
PatientSchema.virtual('appointments', {
  ref: 'Appointment',       // The name of the Appointment model
  localField: '_id',        // The ID of the patient
  foreignField: 'patient',  // The field in the Appointment model that holds the patient ID
  justOne: false            // We want all appointments, not just the first one found
});

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = Patient;
