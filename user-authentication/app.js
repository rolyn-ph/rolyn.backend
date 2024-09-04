// Required modules
require('dotenv').config();
const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const { expressjwt: expressJwt } = require('express-jwt'); // Middleware to validate Auth0 JWT
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
    secret: process.env.AUTH0_SECRET,
    baseURL: 'http://localhost:5001',
    clientID: 'QEk1tCuSrJUeIArnnoCDi0FoygYcffgi',
    issuerBaseURL: 'https://dev-6wrusbfmjzjbuzuj.us.auth0.com'
  };

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
app.use('/api/users', userRoutes);

// Attach Auth0 authentication routes to your app, auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// Middleware to check for valid JWT token for protected routes
const checkJwt = expressJwt({
    secret: 'me4CclP-_zO9hRO54u9pFAk5JWeErR1gDDWCo8YIT_jaB-tq0esEmYLWqxxrGnrS', // Secret from Auth0
    audience: 'https://dev-6wrusbfmjzjbuzuj.us.auth0.com/api/v2/', // The audience (API identifier) in Auth0
    issuer: 'dev-6wrusbfmjzjbuzuj.us.auth0.com', // Your Auth0 domain
    algorithms: ['RS256'], // Use RS256 algorithm
});

// Protect API routes
app.use('/api', checkJwt, (req, res, next) => {
    next();
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
