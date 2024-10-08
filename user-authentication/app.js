// Required modules
require('dotenv').config();
const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const { jwtCheck } = require('./middleware/authMiddleware'); // Import the middleware
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { router: authRoutes } = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/users');

// Loads information from .env (keeps sensitive information outside the codebase)
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configurations for auth0
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_CLIENT_SECRET,
    baseURL: 'http://localhost:5001',
    clientID: 'QEk1tCuSrJUeIArnnoCDi0FoygYcffgi',
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE
  };

// Initialises express application and parses JSON requests
const app = express();
app.use(express.json());

// Pass Supabase client to routes
app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});

app.use('/api', (req, res, next) => {
    console.log('API request received');  // Log before invoking jwtCheck
    next();
});
app.use('/api', (req, res, next) => {
    console.log('Authorization header:', req.headers.authorization);  // Log the authorization header
    next();
});
app.use('/api', jwtCheck, (req, res, next) => {
    console.log('JWT check passed');  // Log when JWT check passes
    console.log('Decoded JWT in jwtCheck:', req.user);  // Check if req.user is defined and has the sub field
    next();
});

app.use('/api/users', jwtCheck, userRoutes);  // Ensure jwtCheck is applied here

// Apply jwtCheck middleware to protect all routes under /api
// app.use('/api', jwtCheck);

// This line sets up the routes for handling authentication related requests, they will be prefixed with '/api/auth' (same for profile routes)
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
// app.use('/api/users', userRoutes);

// Attach Auth0 authentication routes to your app, auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// Example protected route
app.get('/api/authorized', jwtCheck, (req, res) => {
    res.send('You are authorized');
});

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

// Sets the PORT at which the server will be listening for incoming requests
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Test route to check if server is running properly
app.get('/', (req, res) => {
  res.send('App is running!');
});
