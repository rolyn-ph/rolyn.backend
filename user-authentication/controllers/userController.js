// controllers/userController.js

// Import the Supabase client
const { supabase } = require('../config/supabase');  // Adjust the path if necessary

// Define the getUserByEmail function as an Express controller
async function getUserByEmail(req, res) {
    const email = req.params.email;  // Extract the email from the request parameters

    try {
        // Step 1: Query the 'users' table to find a user with the matching email
        const { data, error } = await supabase
            .from('users')       // Select from the 'users' table
            .select('*')         // Select all columns
            .eq('email', email)  // Filter where the email matches the provided email
            .single();           // Expect a single result

        // Step 2: Handle any errors that occur during the selection process
        if (error) {
            console.error('Error retrieving user by email:', error); // Log the error for debugging
            return res.status(404).json({ message: 'User not found' });  // Return a 404 response
        }

        // Step 3: Return the data of the found user as a JSON response
        return res.status(200).json(data);

    } catch (err) {
        // Catch any errors that occur in the try block, log them, and return a server error response
        console.error('Error in getUserByEmail:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

// Export the function so it can be used in routes
module.exports = {
    getUserByEmail,
};
