/*
// This file helps us to represent, structure and store user data in the database
// mongoose is an object data modelling library
const mongoose = require('mongoose');

// A schema is a blueprint that defines the structure of the records in the database
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['job_seeker', 'employer'], required: true },
    
    // Common profile fields for both roles
    name: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    profilePicture: { type: String }, // URL of the profile picture
    
    // Fields specific to job seekers (currently optional)
    skills: { type: [String] },
    experience: { type: String },
    education: { type: String },
    availability: { type: String },
  
    // Fields specific to employers (currently optional)
    companyName: { type: String },
    jobCategories: { type: [String] },
    companyDescription: { type: String }
  });

// Creates a 'User' model that allows you to interact with the data
module.exports = mongoose.model('User', userSchema);
*/

// PostgreSQL Logic

const { createClient } = require('@supabase/supabase-js');

// Initialize the Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function createUser(userData) {
    const { data, error } = await supabase
        .from('users')
        .insert([
            {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                role: userData.role,
                name: userData.name,
                phone: userData.phone,
                address: userData.address,
                profile_picture: userData.profilePicture,
                skills: userData.skills,
                experience: userData.experience,
                education: userData.education,
                availability: userData.availability,
                company_name: userData.companyName,
                job_categories: userData.jobCategories,
                company_description: userData.companyDescription
            }
        ]);

    if (error) throw error;
    return data;
}

async function getUserByEmail(email) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error) throw error;
    return data;
}

// Other user-related functions...

module.exports = {
    createUser,
    getUserByEmail,
    // Add other functions as needed
};

  