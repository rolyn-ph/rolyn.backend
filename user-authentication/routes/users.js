const express = require('express');
const jwt = require('jsonwebtoken');
const { jwtCheck } = require('../middleware/authMiddleware'); // Assuming you have the JWT middleware configured
const router = express.Router();

// Controller function to handle retrieving a user by email
const { getUserByEmail } = require('../controllers/userController');

// Define the route to fetch user data from Supabase
router.get('/user-data', jwtCheck, async (req, res) => {
    try {
        console.log('Request received at /user-data');

        // Extract JWT from the authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new Error('Authorization header is missing');
        }

        console.log('Authorization header:', authHeader);

        const token = authHeader.split(' ')[1];
        console.log('Token:', token);  // Log the extracted token

        // Make a request to Auth0's userinfo endpoint to get the user's email
        const userInfoResponse = await fetch('https://dev-6wrusbfmjzjbuzuj.us.auth0.com/userinfo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const userInfo = await userInfoResponse.json();
        console.log('User Info:', userInfo);

        const email = userInfo.email;
        console.log('Email from userInfo:', email);

        // Error if email is missing
        if (!email) {
            throw new Error('Email not found in token or user info');
        }

        // Fetch the user by email using the getUserByEmail function
        const user = await getUserByEmail(email);  // Calling the function

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data if found
        return res.status(200).json(user);

    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send({ error: 'Failed to fetch user data' });
    }
});

// Define the route to retrieve a user by email
router.get('/:email', getUserByEmail);

module.exports = router;
