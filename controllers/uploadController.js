const multer = require("multer");
const vision = require("@google-cloud/vision");
const path = require("path");
const ExtractedData = require("../models/Person");
const fs = require("fs");

const renderHomePage = (req, res) => {
  return res.render("homepage");
};

const CREDENTIALS = JSON.parse(
  JSON.stringify({
    type: "service_account",
    project_id: "ocr-proj-391814",
    private_key_id: "5d577910c7132fa911a65168a2577aa06b361abb",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyteboip98G1tL\njzGST9/H43KYvbHE7dl8Jm/uAwBcyK0Wqqgkf4j8T5xQCKAMMLqhQeIAoyhp1PmT\nioyFwXac2xIIpDNk/Y3O6NDrDpm/+Jy1vtBWyh8giVz3U/lo48PNZNG76uhh5XPP\nNBHcqYARwG4H3b2J6tTsBkL5pQbQtJ3mdVnVnWr+BDRXlqP33It9baQTog8Fz73R\neGcE0mOenAujncWy2XRQmJc8WmPFyCP+S564yaVADx+PcYxYsZ6hmlLjP8TJYMHd\nwIVM7PyYgp1sUwqrMri62sJ5dypBwkyFxhQC9Cm+8Ps9mpcnchiBwzNSslROyadV\nf0wTXO25AgMBAAECggEADLLcA/NguowDmFqGGFpUYZLmCFg3XvHTQc0F6FTehFlO\nolURUlmdIWejSPUZ8U/PnSiOL4Moep+zddJTIqiA/gubjBFl5QPW3ShiOwesMW3Q\nLeJvkbE2VcSo/lqhVvyTQ9+pfxfFuDoamPM/Xy2MsAY7U1QEdT3CcDyQKwbY1YDX\nqxtHf3R27G/i4yRRwCJ/G9QEhVmjmVio4WJtpjQ0EImJmiW7TW4dGKy9QikhA7Lg\nr8UarrCRtIXkv57qU67M8HojWUUapM5QWrPD5438AWKHBg1mTlugmUfHBUf5kFDu\n7KMDszLJBX55uybAK8SJhmH3i06uTFU8Nh17wdYLYQKBgQDc9LLG5WmoWl0ZHE2p\nVLAClllLu3YfTRh3QOcIQ0LhSZmP6ycCN7yBZYqcaa4GBLV9oe5IVNxFHE5Gf/TL\nBab69PIMRYB3vS9rz+TvY40HQtiBpOlgl2QrPW57/I5A2AeyG2TZYJu2W9ix5b+B\nz9IMzJQ3HhEhRfsjiISS89GV2QKBgQDPDfM4CQf8/3sjVqZnYeMuZKn+0LQpOTv3\nfcHVWhqFD4MR7DdF6/ZkIAJPBNB8vZvQAE+Y0noR1UnUzmQRi2GgaK+79AIxiC98\nWva+NaC2bsO1yW/s3lfHt73oHFZPBUDMZTrAGj+JPnEvbG4lAGZe0Rpm6afMEDSd\n70H8/WPK4QKBgQCyyRkjkRwGSmAMYneArXLiFQ/aFKyGtVY3oH+QkwQ50Nj9t/PP\nepQAS851s5lJa2QDbRSm2GuHTFkV+JF1+XPcmniEb3R87srBPO3suiuyFWekt3DT\nZIx75HBSyM++Lk9D0aCvt9knHHhhshpcinFXQ+4mDyEjQEHuxZcoZTtQOQKBgALV\nfQu6S+qxkHzmVba6h0J+TDlZn+2kg+aaSQnjhtNlZ/TZ19PUK/Yo3f844KWkbrqF\nFpHP563QzobkIEiBMN/iLu2SpGkLJSM9l3z4/O8iSvl0/VwvmuH36NiBcsj4GG/z\nvr8cXNxDB4ePo15MSBpqIENiVVKcsiurN6r/yNrhAoGBALP7a7fhEtFHCDI63cEp\n8yXr4M13oqFWiLhTK4JH2RTYWsrp8ZGQynUFqaO8uW2AZxvryJveYZyZYI/rTbN7\nCSsjLJEGOdUZQz9W3vGTDkSYPYjfn5JM5hsSEAOcHGhSCds9NQCfPr8RZMZZZDAl\nvhnafAmgy/ihYHrDNMd6UE4u\n-----END PRIVATE KEY-----\n",
    client_email: "ocr-project@ocr-proj-391814.iam.gserviceaccount.com",
    client_id: "110508924465471825280",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/ocr-project%40ocr-proj-391814.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  })
);

const CONFIG = {
  credentials: {
    private_key: CREDENTIALS.private_key,
    client_email: CREDENTIALS.client_email,
  },
};

const client = new vision.ImageAnnotatorClient(CONFIG);

// Create storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Folder where the uploaded images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

// Create multer instance
const upload = multer({ storage: storage });

const uploadImage = (req, res) => {
  // Use 'upload' middleware with the desired field name from the form
  upload.single("image")(req, res, async (err) => {
    if (err) {
      // Handle the error
      console.error(err);
      return res.status(500).json({ error: "Failed to upload image" });
    }

    // File uploaded successfully
    // Access the uploaded file via req.file
    console.log(req.file);
    const uploadedFile = req.file;
    const image_name = uploadedFile.filename;

    try {
      const uploadedFile = req.file;
      const image_name = uploadedFile.filename;
      const extractedText = await detectText(image_name);

      // Create a new instance of the ExtractedData model using the extracted text
      const extractedData = new ExtractedData({
        name: extractedText.name,
        dob: extractedText.dob,
        gender: extractedText.gender,
        aadhaarNumber: extractedText.aadhaar,
        image: {
          data: fs.readFileSync(uploadedFile.path),
          contentType: uploadedFile.mimetype,
        },
      });

      // Save the extracted data to the database
      await extractedData.save();

      // Get the image URL
      const imageUrl = `/uploads/${image_name}`;

      // Render the result.ejs page and pass the extracted text as a variable
      return res.render("result", { extractedText, uploadedImage: uploadedFile.filename });

    } catch (error) {
      console.error("Error detecting text:", error);
      return res
        .status(500)
        .json({ error: "Failed to extract text from the image" });
    }
  });
};

const detectText = async (image_name) => {
  const file_path = path.join("uploads", image_name);
  const request = {
    image: { source: { filename: file_path } },
  };

  try {
    const [result] = await client.textDetection(request);
    const extractedText = result.fullTextAnnotation.text;

    const nameRegex = /नाम \/ Name:\s*(\w+\s*\w+)/i;
    const dobRegex = /जन्म तारीख \/ DOB:\s*(\d{2}\/\d{2}\/\d{4})/i;
    const genderRegex = /(पुरुष|महिला|Male|Female)/i;
    const aadhaarRegex = /\b(\d{12})\b/;

    const nameMatch = extractedText.match(nameRegex);
    const dobMatch = extractedText.match(dobRegex);
    const genderMatch = extractedText.match(genderRegex);
    const aadhaarMatch = extractedText.match(aadhaarRegex);

    const name = nameMatch ? nameMatch[1] : "";
    const dob = dobMatch ? dobMatch[1] : "";
    let gender = genderMatch ? genderMatch[0] : "";
    const aadhaar = aadhaarMatch ? aadhaarMatch[1] : "";

    // Gender mapping
    const genderMap = {
      पुरुष: "Male",
      महिला: "Female",
      Male: "Male",
      Female: "Female",
      // Add more mappings if needed
    };

    // Convert gender to standard format
    if (genderMap.hasOwnProperty(gender)) {
      gender = genderMap[gender];
    }

    return { name, dob, gender, aadhaar };
  } catch (error) {
    console.error("Error detecting text:", error);
    throw error;
  }
};

module.exports = {
  renderHomePage,
  uploadImage,
};
