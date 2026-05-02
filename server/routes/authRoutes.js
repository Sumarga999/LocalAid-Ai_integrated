import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Route: POST /api/auth/signup
// Purpose: Register a new user
router.post('/signup', async (req, res) => {
  try {
    // 1. Grab the data sent from your React frontend
    const { name, email, password, role } = req.body;

    // 2. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10); // Generates a random string to mix with the password
    const hashedPassword = await bcrypt.hash(password, salt); // Scrambles it

    // 4. Create the new user with the hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    // 5. Save the user to MongoDB
    await newUser.save();

    // 6. Send a success message back to React
    res.status(201).json({ message: 'User created successfully!' });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during sign up.' });
  }
});

// Route: POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    // 1. Grab the role from the frontend alongside email and password
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 2. NEW: Check if the role they selected matches their account in the database!
    if (user.role !== role) {
      const correctRole = user.role === 'volunteer' ? 'Volunteer' : 'Get Help';
      return res.status(403).json({ 
        message: `Account mismatch. Please log in as a ${correctRole}.` 
      });
    }

    const payload = {
      userId: user._id,
      role: user.role,
      name: user.name
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});
export default router;