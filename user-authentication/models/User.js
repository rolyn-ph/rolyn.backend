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
    name: { type: String, required: true },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    profilePicture: { type: String }, // URL of the profile picture
    
    // Fields specific to job seekers
    skills: { type: [String], required: function() { return this.role === 'job_seeker'; }},
    experience: { type: String, required: function() { return this.role === 'job_seeker'; }},
    education: { type: String, required: function() { return this.role === 'job_seeker'; }},
    availability: { type: String, required: function() { return this.role === 'job_seeker'; }},
  
    // Fields specific to employers
    companyName: { type: String, required: function() { return this.role === 'employer'; }},
    jobCategories: { type: [String], required: function() { return this.role === 'employer'; }},
    companyDescription: { type: String, required: function() { return this.role === 'employer'; }}
  });

// Creates a 'User' model that allows you to interact with the data
module.exports = mongoose.model('User', userSchema);
