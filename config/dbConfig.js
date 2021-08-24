require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL || 'mongodb://unraid.local/lawn-man', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;
