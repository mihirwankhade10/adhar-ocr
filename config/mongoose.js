// config/mongoose.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/imageUploader', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
