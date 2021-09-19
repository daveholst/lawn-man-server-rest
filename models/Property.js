const { Schema } = require('mongoose');
const zoneSchema = require('./Zone');
const historySchema = require('./History');

const propertySchema = new Schema({
  propertyName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  juiceBoxId: {
    type: String,
    required: true,
  },
  lastJuiceBoxRawVolume: {
    type: Number,
    required: false,
  },
  lastRecordedVolumeTime: {
    type: Date,
    required: false,
  },
  juiceBoxHistory: [historySchema],
  openSprinklerAddress: {
    type: String,
    required: true,
  },
  openSprinklerKey: {
    type: String,
    required: true,
  },
  climate: {
    type: String,
    required: true,
  },
  zones: [zoneSchema],
});

module.exports = propertySchema;
