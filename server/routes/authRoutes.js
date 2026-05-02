import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // Import the model we just made!

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

export default router;