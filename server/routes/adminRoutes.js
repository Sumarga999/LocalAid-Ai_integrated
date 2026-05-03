import express from 'express';
import bcrypt from 'bcryptjs'; // or 'bcrypt' if that's what you installed
import User from '../models/User.js'; 
import Task from '../models/Task.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// --- 1. ADMIN MIDDLEWARE ---
// This ensures ONLY people with the 'admin' role can use these routes
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId || req.user._id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error checking admin status' });
  }
};

// --- 2. FETCH DATA ROUTES ---

// GET: All users
router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Don't send passwords to frontend!
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// GET: All tasks
router.get('/tasks', authMiddleware, isAdmin, async (req, res) => {
  try {
    const tasks = await Task.find().populate('requester', 'name').populate('volunteer', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// --- 3. DELETE ROUTES ---

// DELETE: A user
router.delete('/users/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

// DELETE: A task
router.delete('/tasks/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting task' });
  }
});

// --- 4. CREATE NEW ADMIN ROUTE ---

// POST: Create a new Admin account directly from the dashboard
router.post('/create-admin', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin' // Force the role to admin
    });

    await newAdmin.save();

    const adminResponse = newAdmin.toObject();
    delete adminResponse.password;
    
    res.status(201).json(adminResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating admin.' });
  }
});

// Export the router using ES Module syntax
export default router;