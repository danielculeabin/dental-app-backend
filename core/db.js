const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const url = process.env.MongoDB_URI || 'mongodb://localhost:27017/dental';

    await mongoose.connect(url);
    console.log('Connected to MongoDB! 🦷');
  } catch (err) {
    console.error('Could not connect to MongoDB...', err)
    process.exit(1);  //Stop the server if the DB fails
  }
};

connectDB();

module.exports = mongoose;

