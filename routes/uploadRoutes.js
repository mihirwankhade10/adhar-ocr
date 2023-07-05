// imageRoutes.js

const express = require('express');
const router = express.Router();
const { uploadImage, renderHomePage } = require('../controllers/uploadController');

// Define the route for uploading an image
router.get('/', renderHomePage);

router.post('/upload', uploadImage);

module.exports = router;
