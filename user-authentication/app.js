/*
// Required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const authRoutes = require('./routes/auth');
const { router: authRoutes } = require('./routes/auth');
const profileRoutes = require('./routes/profile');

// Loads information from .env (keeps sensitive information outside the codebase)
dotenv.config();

// Initialises express application and parses JSON requests
const app = express();
app.use(express.json());

// Connect the application to MongoDB database using URI, plus some error handling
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// This line sets up the routes for handling authentication related requests, they will be prefixed with '/api/auth' (same for profile routes)
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Sets the PORT at which the server will be listening for incoming requests
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Test route to check if server is running properly
app.get('/', (req, res) => {
    res.send('App is running!');
  });
*/

// Required modules
const express = require('express');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { router: authRoutes } = require('./routes/auth');
const profileRoutes = require('./routes/profile');

// Loads information from .env (keeps sensitive information outside the codebase)
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialises express application and parses JSON requests
const app = express();
app.use(express.json());

// Pass Supabase client to routes
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// This line sets up the routes for handling authentication related requests, they will be prefixed with '/api/auth' (same for profile routes)
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Sets the PORT at which the server will be listening for incoming requests
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Test route to check if server is running properly
app.get('/', (req, res) => {
  res.send('App is running!');
});
