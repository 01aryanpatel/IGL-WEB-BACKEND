// database/mongodb.js
const mongoose = require('mongoose');

const dbUrl = 'mongodb+srv://iglappservice:iglappfreefire@guild.ibtxueq.mongodb.net/IGL_SERVERS?retryWrites=true&w=majority&appName=GUILD';

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log('✅ Database connected successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
};

module.exports = connectToMongoDB;
