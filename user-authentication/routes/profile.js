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
