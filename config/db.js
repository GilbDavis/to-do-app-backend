const mongoose = require('mongoose');
const config = require('./config');

const conectarDB = async () => {
  try {
    await mongoose.connect(config.dburlString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  } catch (error) {
    process.exit(1);
  }
}

module.exports = conectarDB;