const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: String,
  dob: String,
  gender: String,
  aadhaarNumber: String,
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
