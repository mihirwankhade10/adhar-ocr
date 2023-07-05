const fs = require('fs');
const { google } = require('googleapis');
const Image = require('../models/Image');

// Load the service account key JSON file
const credentials = require('../credentials/service-account-key.json');

// Configure authentication
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

// Create a Google Cloud Vision API client
const vision = google.vision({ version: 'v1', auth });

const uploadImage = async (req, res) => {
  try {
    // Read the uploaded image file
    const imageFile = req.file.path;
    const fileContent = fs.readFileSync(imageFile, { encoding: 'base64' });

    // Create the request payload for the Google Cloud Vision API
    const request = {
      image: {
        content: fileContent,
      },
      features: [
        {
          type: 'DOCUMENT_TEXT_DETECTION',
        },
      ],
    };

    // Call the Google Cloud Vision API
    const [response] = await vision.images.annotate(request);

    // Extract relevant information from the API response
    const { fullTextAnnotation } = response;
    const { text } = fullTextAnnotation;

    // Perform text parsing based on the document type (PAN, Aadhar, Passport)
    let parsedName = '';
    let parsedDOB = '';
    let parsedPAN = '';
    let parsedAadhar = '';
    let parsedPassport = '';

    // Add your text parsing logic here

    // Save the extracted data to the database
    const image = new Image({
      name: parsedName,
      dob: parsedDOB,
      pan: parsedPAN,
      aadhar: parsedAadhar,
      passport: parsedPassport,
    });
    await image.save();

    // Send the extracted data as a response
    res.json({
      name: parsedName,
      dob: parsedDOB,
      pan: parsedPAN,
      aadhar: parsedAadhar,
      passport: parsedPassport,
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Image processing failed' });
  }
};

module.exports = {
  uploadImage,
};
