const express = require('express');
const jwt = require('jsonwebtoken');
const { jwtCheck } = require('../middleware/authMiddleware'); // Assuming you have the JWT middleware configured
const router = express.Router();

// Controller function to handle retrieving a user by email
const { getUserByEmail } = require('../controllers/userController');

router.patch('/update-profile', jwtCheck, async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        const auth0_id = decodedToken.sub;  // Use sub as the auth0_id

        // Now you can use auth0_id in your update logic
        console.log('Manual sub (auth0_id):', auth0_id);

        // Extract the updated user details from the request body
        const { name, phone, address, skills, experience, availability } = req.body;
        const { supabase } = req;

        // Perform the update in Supabase
        const { data, error } = await supabase
            .from('users')
            .update({
                name,
                phone,
                address,
                skills,
                experience,
                availability,
            })
            .eq('auth0_id', auth0_id);

        if (error) {
            console.error('Error updating profile:', error);
            return res.status(500).json({ message: 'Failed to update profile' });
        }

        return res.status(200).send({ message: 'Profile updated successfully', data });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).send({ message: 'Failed to update profile' });
    }
});

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



module.exports = router;
