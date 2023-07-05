// routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

// Create Multer upload instance
const upload = multer({ storage: storage });

// POST /upload route for image upload
router.post('/upload', upload.single('image'), uploadController.uploadImage);

module.exports = router;
