const express = require('express');
const router = express.Router();

// Controller function to handle retrieving a user by email
const { getUserByEmail } = require('../controllers/userController');

// Define the route to retrieve a user by email
router.get('/:email', getUserByEmail);

module.exports = router;
