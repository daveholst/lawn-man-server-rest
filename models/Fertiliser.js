const { Schema, model } = require('mongoose');

const fertiliserSchema = new Schema({
  productBrand: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  applicationRate: {
    type: String,
    required: false,
  },
  applicationRatePlant: {
    type: String,
    required: false,
  },
  manufacturerLink: {
    type: String,
  },
  bunningsLink: {
    type: String,
  },
  imageLink: {
    type: String,
  },
});

const Fertiliser = model('Fertiliser', fertiliserSchema);
module.exports = Fertiliser;
