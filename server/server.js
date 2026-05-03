import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http'; // NEW: Required for Socket.io
import { Server } from 'socket.io'; // NEW: Import Socket.io Server

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import Task from './models/Task.js';
import User from './models/User.js';
import Message from './models/Message.js'; // NEW: Import the Message model

dotenv.config();

const app = express();

// --- NEW: Create HTTP server and initialize Socket.io ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Make sure this matches your Vite frontend port
    methods: ["GET", "POST"]
  }
});

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
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'LocalAid Backend is up and running! 🚀' });
});

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

// --- NEW: API Route to fetch Chat History ---
app.get('/api/messages/:taskId', async (req, res) => {
  try {
    const messages = await Message.find({ task: req.params.taskId })
      .populate('sender', 'name') // Pulls the sender's name from the User collection
      .sort({ createdAt: 1 }); // Oldest first
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// --- NEW: Socket.io Real-Time Logic ---
io.on('connection', (socket) => {
  console.log(`🔌 User Connected: ${socket.id}`);

  // User joins a specific task's chat room
  socket.on('join_room', (taskId) => {
    socket.join(taskId);
    console.log(`User joined room: ${taskId}`);
  });

  // User sends a message
  socket.on('send_message', async (data) => {
    try {
      // 1. Save to database
      const newMessage = new Message({
        task: data.taskId,
        sender: data.senderId,
        text: data.text
      });
      await newMessage.save();

      // 2. Populate sender info so the UI displays the name correctly
      await newMessage.populate('sender', 'name');

      // 3. Broadcast to the other person in the room
      socket.to(data.taskId).emit('receive_message', newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User Disconnected: ${socket.id}`);
  });
});

// Define the port 
const PORT = process.env.PORT || 5000;

// --- CHANGED: Use server.listen instead of app.listen ---
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});