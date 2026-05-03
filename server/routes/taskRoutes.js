import express from 'express';
import multer from 'multer';
import path from 'path';
import Task from '../models/Task.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Multer Configuration for Images ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage: storage });

// 1. CREATE Task
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, urgency, dueDate, latitude, longitude, address } = req.body;
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';
    const currentUserId = req.user._id || req.user.userId || req.user.id;

    const newTask = new Task({
      title,
      description,
      category,
      urgency,
      dueDate,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)], 
        address
      },
      images: imageUrl ? [imageUrl] : [], 
      requester: currentUserId
    });

    const savedTask = await newTask.save();
    res.status(201).json({ message: 'Help request created successfully!', task: savedTask });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error while creating task.' });
  }
});

// 2. GET All Tasks (Feed)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching tasks.' });
  }
});

// 3. GET User's Created Tasks
router.get('/my-reports', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.userId || req.user.id;
    const userTasks = await Task.find({ requester: currentUserId }).sort({ createdAt: -1 });
    res.status(200).json(userTasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching your tasks.' });
  }
});

// 4. GET Single Task Details
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('requester', 'name') 
      .populate('volunteer', 'name');
    
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching task details" });
  }
});

// 5. PUT: Accept Task (Volunteer Action)
router.put('/:id/accept', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.volunteer) return res.status(400).json({ message: 'Already accepted.' });

    const currentUserId = req.user._id || req.user.userId || req.user.id;
    if (task.requester.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: 'You cannot accept your own task.' });
    }

    task.volunteer = currentUserId;
    task.status = 'in-progress'; 
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error accepting task' });
  }
});

// 6. PUT: General Update (Edit details OR Update Status)
// MERGED: This handles both clicking "Edit" and "Mark Complete"
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, category, urgency, address, latitude, longitude, status } = req.body;
    const currentUserId = (req.user._id || req.user.userId || req.user.id).toString();

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // --- SECURITY CHECK ---
    if (task.requester.toString() !== currentUserId) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // --- LOGIC A: Status Update (Mark Complete) ---
    if (status) {
      task.status = status;
      if (status === 'completed') task.completedAt = new Date();
    }

    // --- LOGIC B: Detail Update (Editing) ---
    // Only allow detail edits if the task is still "open"
    if (!status || status === 'open') {
      if (task.status === 'open') {
        if (title) task.title = title;
        if (description) task.description = description;
        if (category) task.category = category;
        if (urgency) task.urgency = urgency;
        if (address && latitude && longitude) {
          task.location = {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
            address
          };
        }
        if (req.file) {
          task.images = [`http://localhost:5000/uploads/${req.file.filename}`];
        }
      }
    }

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: 'Server error while updating task' });
  }
});

// 7. DELETE Task
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const currentUserId = (req.user.userId || req.user.id || req.user._id).toString();
    if (task.requester.toString() !== currentUserId) {
      return res.status(403).json({ message: 'Not authorized to delete' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// PUT: Cancel acceptance (Volunteer Action)
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const currentUserId = (req.user._id || req.user.userId || req.user.id).toString();

    // Security: Only the volunteer assigned to this task can cancel it
    if (!task.volunteer || task.volunteer.toString() !== currentUserId) {
      return res.status(403).json({ message: 'You are not the volunteer for this task.' });
    }

    // Reset the task
    task.volunteer = undefined; // Remove the volunteer
    task.status = 'open';       // Make it available again
    
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error("Cancel Task Error:", error);
    res.status(500).json({ message: 'Error cancelling task' });
  }
});
export default router;