const express = require('express');
const { checkJwt } = require('../middleware/authMiddleware'); // Assuming you have the JWT middleware configured
// const fetch = require('node-fetch');
const router = express.Router();

// Controller function to handle retrieving a user by email
const { getUserByEmail } = require('../controllers/userController');

// Define the route to retrieve a user by email
router.get('/:email', getUserByEmail);

// Define the route to fetch user data from Supabase
router.get('/user-data', checkJwt, async (req, res) => {
    try {
      const token = req.user; // This should contain the validated user information from Auth0

      // Dynamically import node-fetch
      const fetch = (await import('node-fetch')).default;
  
      // Fetch data from Supabase using the token for authorization
      const response = await fetch('https://YOUR_SUPABASE_URL/rest/v1/your_table', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Ensure the Auth0 token is passed here
          'Content-Type': 'application/json',
        },
      });
  
      // Check for errors in the response
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
  
      const data = await response.json();
      res.status(200).send(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).send({ error: 'Failed to fetch user data' });
    }
  });

module.exports = router;
