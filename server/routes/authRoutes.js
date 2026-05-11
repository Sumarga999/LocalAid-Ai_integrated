import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully!' });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during sign up.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    if (user.role !== role) {
      const correctRole = user.role === 'volunteer' ? 'Volunteer' : 'Get Help';
      return res.status(403).json({ 
        message: `Account mismatch. Please log in as a ${correctRole}.` 
      });
    }

    // --- ADDED FEATURE: Approval Check ---
    if (user.role === 'volunteer' && user.status === 'pending') {
      return res.status(403).json({ message: 'Your account is pending admin approval.' });
    }
    if (user.role === 'volunteer' && user.status === 'rejected') {
      return res.status(403).json({ message: 'Your volunteer account has been rejected.' });
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

router.post('/:id/rate', authMiddleware, async (req, res) => {
  try {
    const { rating, taskId } = req.body;
    const userToRate = await User.findById(req.params.id);

    if (!userToRate) {
      return res.status(404).json({ message: 'User not found' });
    }

    userToRate.ratings.push({
      rating: Number(rating),
      reviewer: req.user.userId || req.user._id,
      task: taskId
    });

    const total = userToRate.ratings.reduce((sum, item) => sum + item.rating, 0);
    userToRate.averageRating = total / userToRate.ratings.length;

    await userToRate.save();

    res.status(200).json({ 
      message: 'Rating submitted successfully', 
      averageRating: userToRate.averageRating 
    });
  } catch (error) {
    console.error("Error rating user:", error);
    res.status(500).json({ message: 'Server error while submitting rating' });
  }
});

export default router;