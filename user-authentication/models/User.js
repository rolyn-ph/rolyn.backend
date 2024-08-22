// This file helps us to represent, structure and store user data in the database
// mongoose is an object data modelling library
const mongoose = require('mongoose');

// A schema is a blueprint that defines the structure of the records in the database
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['job_seeker', 'employer'], required: true }
});

// Creates a 'User' model that allows you to interact with the data
module.exports = mongoose.model('User', userSchema);
