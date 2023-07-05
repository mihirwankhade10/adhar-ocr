const express = require ('express');
const path = require('path');
const connectDB = require('./config/mongoose');
const uploadRoutes = require('./routes/uploadRoutes');

//connect to mongoDB
connectDB();


const app = express();
app.use(express.static(path.join(__dirname, 'uploads')));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', uploadRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
