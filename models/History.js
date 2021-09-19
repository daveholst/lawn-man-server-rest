const { Schema } = require('mongoose');

const historySchema = new Schema({
  programName: {
    type: String,
    required: false,
  },
  fert1Name: {
    type: String,
    required: false,
  },
  fert1Volume: {
    type: Number,
    required: false,
  },
  fert2Name: {
    type: String,
    required: false,
  },
  fert2Volume: {
    type: Number,
    required: false,
  },
  fert3Name: {
    type: String,
    required: false,
  },
  fert3Volume: {
    type: Number,
    required: false,
  },
  waterVolume: {
    type: Number,
    required: false,
  },
  runStart: {
    type: Date,
    required: false,
  },
  runTime: {
    type: Number,
    required: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = historySchema;
