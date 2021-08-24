const { Schema } = require('mongoose');
const zoneSchema = require('./Zone');

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
