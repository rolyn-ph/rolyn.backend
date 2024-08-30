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

const createUser = async (client, user) => {
    const { username, email, password, role } = user;
    const query = `
      INSERT INTO users (username, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [username, email, password, role];
    const res = await client.query(query, values);
    return res.rows[0];
  };
  