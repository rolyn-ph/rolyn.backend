// Required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

// Loads information from .env (keeps sensitive information outside the codebase)
dotenv.config();

// Initialises express application and parses JSON requests
const app = express();
app.use(express.json());

// Connect the application to MongoDB database using URI, plus some error handling
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// This line sets up the routes for handling authentication related requests, they will be prefixed with '/api/auth'
app.use('/api/auth', authRoutes);

// Sets the PORT at which the server will be listening for incoming requests
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Test route to check if server is running properly
app.get('/', (req, res) => {
    res.send('App is running!');
  });
  