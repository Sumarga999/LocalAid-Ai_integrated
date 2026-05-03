import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import Task from './models/Task.js';
import User from './models/User.js';

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
  })
  .catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error.message);
  });

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'LocalAid Backend is up and running! 🚀' });
});

// Define the port 
const PORT = process.env.PORT || 5000;

app.get('/api/stats', async (req, res) => {
  try {
    const activeVolunteers = await User.countDocuments({ role: 'volunteer' }); 
    const tasksCompleted = await Task.countDocuments({ status: 'completed' });
    const activeTasks = await Task.countDocuments({ status: { $in: ['open', 'in-progress'] } });

    res.json({
      activeVolunteers,
      tasksCompleted,
      activeTasks
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});