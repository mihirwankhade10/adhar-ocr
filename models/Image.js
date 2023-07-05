// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: String,
  dob: String,
  pan: String,
  aadhar: String,
  passport: String,
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
