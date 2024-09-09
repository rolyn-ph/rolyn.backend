// controllers/userController.js

// Import the Supabase client
const { supabase } = require('../config/supabase');  // Adjust the path if necessary

async function getUserByEmail(email) {
    try {
        // Query the 'users' table to find a user with the matching email
        const { data, error } = await supabase
            .from('users')       
            .select('*')         
            .eq('email', email)  
            .single();           

        if (error && error.code === 'PGRST116') {
            console.error('Error retrieving user by email:', error);
            return null;  // Return null if no user is found
        }

        if (error) {
            // If there's any other error, throw it
            throw error;
        }

        return data;  // Return user data if found

    } catch (err) {
        console.error('Error in getUserByEmail:', err);
        throw err; // Re-throw to handle it in the route
    }
}

// Export the function so it can be used in routes
module.exports = {
    getUserByEmail,
};
