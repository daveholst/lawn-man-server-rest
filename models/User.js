const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const propertySchema = require('./Property');

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // TODO: INSERT BETTER EMAIL VAILIDATION
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
      // TODO: ADD MIN LENGTH AFTER TESTING!
    },
    properties: [propertySchema],
  }
  // // set this to use virtual below
  // {
  //   // ! changed this to toObject as we were no longer using the toJSON method to call the hook.
  //   toObject: {
  //     virtuals: true,
  //   },
  // }
);

// hash user password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;
