// PostgreSQL Logic

const { createClient } = require('@supabase/supabase-js');

// Initialize the Supabase client with the URL and key from the environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function createUser(userData) {
    // Destructure the user data object to extract the necessary fields
    const { username, email, password, role } = userData;

    try {
        // Step 1: Check if the user already exists in the database by querying the 'users' table
        const { data: existingUser, error: selectError } = await supabase
            .from('users')       // Select from the 'users' table
            .select('id')        // Only select the 'id' column
            .eq('email', email)  // Filter where the email matches the provided email
            .single();           // Expect a single result

        console.log('existingUser:', existingUser); // Debugging output
        console.log('selectError:', selectError); // Debugging output

        // Step 2: Handle any errors during the selection process
        if (selectError) {
            console.error('Error during user check:', selectError); // Log the error for debugging
            // If the error code is not 'PGRST116' (which we assume means "no rows found"), throw an error
            if (selectError.code !== 'PGRST116') {
                throw new Error('Error checking for existing user');
            }
        }

        // Step 3: If an existing user is found, throw an error indicating the user already exists
        if (existingUser) {
            console.error('User already exists:', existingUser);
            throw new Error('User already exists');
        }

        // Step 4: If no user exists, insert the new user into the 'users' table
        const { data, error } = await supabase
            .from('users')       // Insert into the 'users' table
            .insert([
                {
                    username,     // Insert the username
                    email,        // Insert the email
                    password,     // Insert the password
                    role,         // Insert the role (e.g., worker or employer)
                }
            ]);

        // Step 5: Handle any errors during the insertion process
        if (error) {
            console.error('Error creating user:', error); // Log the error for debugging
            throw new Error('Error creating user');       // Throw a general error for the user creation failure
        }

        // Step 6: Return the data of the newly created user
        return data;

    } catch (err) {
        // Catch any errors that occur in the try block, log them, and re-throw them
        console.error('Error in createUser:', err);
        throw err;
    }
}

// Export the functions so they can be used in other parts of the application
module.exports = {
    createUser
};
