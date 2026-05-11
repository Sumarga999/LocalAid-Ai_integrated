import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; 
import Task from '../models/Task.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

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

router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

router.get('/tasks', authMiddleware, isAdmin, async (req, res) => {
  try {
    const tasks = await Task.find().populate('requester', 'name').populate('volunteer', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

router.delete('/users/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

router.delete('/tasks/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting task' });
  }
});

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
      role: 'admin'
    });
    await newAdmin.save();
    const adminResponse = newAdmin.toObject();
    delete adminResponse.password;
    res.status(201).json(adminResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating admin.' });
  }
});

// --- ADDED FEATURE: Admin Approval Routes ---

// GET: All volunteers waiting for approval
router.get('/pending-volunteers', authMiddleware, isAdmin, async (req, res) => {
  try {
    const pending = await User.find({ role: 'volunteer', status: 'pending' }).select('-password');
    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending volunteers' });
  }
});

// PUT: Update volunteer status (Approve/Reject)
router.put('/update-status/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { status } = req.body; // Expecting 'approved' or 'rejected'
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: `User marked as ${status}`, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
});

export default router;