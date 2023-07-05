const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
imagename: String,
});

const UploadSchema = mongoose.model('uplaodimage', uploadSchema);

module.exports = UploadSchema;
