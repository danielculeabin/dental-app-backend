const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/dental');
    console.log('Connected to MongoDB! 🦷');
  } 
  catch (err) {
    console.error('Could not connect to MongoDB...', err)
  }
}

connectDB();

module.exports = mongoose;

