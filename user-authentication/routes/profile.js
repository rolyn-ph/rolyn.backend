/*
const express = require('express');
// const verifyToken = require('./auth');
const auth = require('./auth');
const User = require('../models/User');

const router = express.Router();

// Get Profile
router.get('/me', auth.verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Update Profile
router.put('/me', auth.verifyToken, async (req, res) => {
  const { name, phone, address, skills, experience, education, availability, companyName, jobCategories, companyDescription } = req.body;

  try {
    let user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user profile fields based on role
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    if (user.role === 'job_seeker') {
      user.skills = skills || user.skills;
      user.experience = experience || user.experience;
      user.education = education || user.education;
      user.availability = availability || user.availability;
    } else if (user.role === 'employer') {
      user.companyName = companyName || user.companyName;
      user.jobCategories = jobCategories || user.jobCategories;
      user.companyDescription = companyDescription || user.companyDescription;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
*/

// PostgreSQL Logic

const express = require('express');
const auth = require('./auth');
const { v4: uuidv4 } = require('uuid'); // if you need to generate any unique IDs

const router = express.Router();

// Get Profile
router.get('/me', auth.verifyToken, async (req, res) => {
  try {
    // Fetch the user profile from Supabase using the user's ID
    const { data: user, error } = await req.supabase
      .from('users')
      .select('*')
      .eq('id', req.user.userId)
      .single();

    if (error) {
      throw error;
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Update Profile
router.put('/me', auth.verifyToken, async (req, res) => {
  const { name, phone, address, skills, experience, education, availability, companyName, jobCategories, companyDescription } = req.body;

  try {
    // Check if the user exists
    const { data: user, error: fetchError } = await req.supabase
      .from('users')
      .select('*')
      .eq('id', req.user.userId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user profile fields based on role
    const updates = {
      name: name || user.name,
      phone: phone || user.phone,
      address: address || user.address,
    };

    if (user.role === 'job_seeker') {
      updates.skills = skills || user.skills;
      updates.experience = experience || user.experience;
      updates.education = education || user.education;
      updates.availability = availability || user.availability;
    } else if (user.role === 'employer') {
      updates.companyName = companyName || user.companyName;
      updates.jobCategories = jobCategories || user.jobCategories;
      updates.companyDescription = companyDescription || user.companyDescription;
    }

    // Save the updated user data to Supabase
    const { error: updateError } = await req.supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.userId);

    if (updateError) {
      throw updateError;
    }

    res.json({ ...user, ...updates });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
