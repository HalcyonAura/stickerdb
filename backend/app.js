const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stickerRoutes = require('./routes/stickerRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const mongoose = require('mongoose'); 
const passport = require("passport");
const configurePassport = require("./config/passport");
configurePassport(passport);

const app = express();
app.use(passport.initialize());


// ADDED
require('dotenv').config();  
app.get('/api/getBaseURL', (req, res) => {
    res.json({ baseUrl: process.env.BASE_URL });
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api', stickerRoutes); // Use the routes file
app.use('/api/auth', authRoutes); // Use the routes file

app.get('/', (req, res) => {
    res.send('Backend server is running!');
  });

  // ADDED
  // MongoDB connection
mongoose.connect('mongodb://localhost:27017/stickerdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});