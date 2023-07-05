// app.js
const express = require('express');
const app = express();
const uploadRoutes = require('./routes/upload');
const path = require('path');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Set up view engine
app.set('view engine', 'ejs');

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static folder
app.use(express.static('public'));

// Set the maximum file size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Use the upload routes
app.use(uploadRoutes);

// Route handler for the root path
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
