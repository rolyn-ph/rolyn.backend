const express = require('express'); // web framework for node.js used to create routes
const bcrypt = require('bcryptjs'); // library for hashing passwords
const jwt = require('jsonwebtoken'); // JSON = JavaScript Object Notation
const { v4: uuidv4 } = require('uuid'); // for generating unique user IDs

const router = express.Router();

// Register Route - handles new user registration
router.post('/register', async (req, res) => { // listens to 'POST' requests to submit new user data
  const { username, email, password, role } = req.body;
  
  try {
    // Check if the user already exists in Supabase
    const { data: existingUser, error: findError } = await req.supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      throw findError;
    }

    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in Supabase
    const { error: insertError } = await req.supabase
      .from('users')
      .insert([
        {
          id: uuidv4(), // generate a unique ID for the user
          username,
          email,
          password: hashedPassword,
          role
        }
      ]);

    if (insertError) {
      throw insertError;
    }

    // Return success message
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error(error); // Log the error details
    res.status(500).send('Server error');
  }
});

// Login Route - handles user login and JWT generation
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in Supabase
    const { data: user, error: findError } = await req.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (findError) {
      throw findError;
    }

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Validate the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error); // Log the error details
    res.status(500).send('Server error');
  }
});

// Protected Route Example
router.get('/protected', verifyToken, (req, res) => {
  res.send('You have gained access to a protected route!');
});

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(403).json({ msg: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error); // Log the error details
    res.status(403).json({ msg: 'Invalid token' });
  }
}

module.exports = { router, verifyToken };

router.get('/test-db', async (req, res) => {
  try {
    const { data: users, error } = await req.supabase
      .from('users')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(users);
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('Database connection error');
  }
});
