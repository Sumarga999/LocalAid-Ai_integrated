import express from 'express';
import multer from 'multer';
import path from 'path';
import Task from '../models/Task.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure an 'uploads' folder exists in your backend!
  },
  filename: function (req, file, cb) {
    // Give the file a unique name (Timestamp + original extension)
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      urgency, 
      dueDate, 
      latitude, 
      longitude, 
      address 
    } = req.body;

    // Grab the uploaded file and prepend the backend URL so React can show it easily
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';

    // Create the new task using the data from React
    const newTask = new Task({
      title,
      description,
      category,
      urgency,
      dueDate,
      location: {
        type: 'Point',
        // CRITICAL FIX: FormData sends everything as text strings. 
        // MongoDB requires coordinates to be actual Numbers, so we must use parseFloat()
        coordinates: [parseFloat(longitude), parseFloat(latitude)], 
        address
      },
      // THE FIX: Save the single URL inside an array named 'images'
      images: imageUrl ? [imageUrl] : [], 
      requester: req.user.userId || req.user._id || req.user.id
    });

    // Save it to the database
    const savedTask = await newTask.save();

    res.status(201).json({
      message: 'Help request created successfully!',
      task: savedTask
    });

  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error while creating task.' });
  }
});

// PURPOSE: Fetch all tasks for the volunteer feed
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    res.status(500).json({ message: 'Server error while fetching tasks.' });
  }
});

// PURPOSE: Fetch only tasks created by the logged-in user for their Dashboard
router.get('/my-reports', authMiddleware, async (req, res) => {
  try {
    const userTasks = await Task.find({ requester: req.user.userId }).sort({ createdAt: -1 });
    
    res.status(200).json(userTasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ message: 'Server error while fetching your tasks.' });
  }
});

// PUT: Accept a task
// Ensure you have your authentication middleware (e.g., verifyToken) protecting this route!
router.put('/:id/accept', authMiddleware, async (req, res) => {
  try {
    // 1. Find the task by the ID in the URL
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // 2. Check if it's already accepted by someone else
    if (task.volunteer) {
      return res.status(400).json({ message: 'This task has already been accepted.' });
    }

    // 3. Get the correct User ID from the token (The Ninja Bug Fix!)
    const currentUserId = req.user._id || req.user.userId || req.user.id;
    
    // Prevent the requester from accepting their own task
    if (task.requester.toString() === currentUserId) {
      return res.status(400).json({ message: 'You cannot accept a task you created.' });
    }

    // 4. Update the task with the real volunteer's ID and change status
    task.volunteer = currentUserId;
    
    if (task.status !== undefined) {
      task.status = 'in-progress'; 
    }

    // 5. Save to the database and send the response!
    const updatedTask = await task.save();
    res.json(updatedTask);

  } catch (error) {
    console.error("Error accepting task:", error);
    res.status(500).json({ message: 'Server Error while accepting task' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    .populate('requester', 'name') 
      .populate('volunteer', 'name');
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // This sends EVERYTHING (images, status, volunteer ID) to the frontend
    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Server error fetching task details" });
  }
});

// DELETE a task by ID (Protected by authMiddleware)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;

    // 1. Check if the task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const currentUserId = req.user.userId || req.user.id || req.user._id; 
    
    if (task.requester.toString() !== currentUserId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    // 3. Delete the task
    await Task.findByIdAndDelete(taskId);

    // 4. Send success response back to the frontend
    res.status(200).json({ message: 'Task deleted successfully' });

  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
});

// PUT: Edit a task by ID (Protected by authMiddleware)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    // 1. Check if task exists
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // 2. Check ownership
    const currentUserId = req.user.userId || req.user.id || req.user._id;
    if (task.requester.toString() !== currentUserId.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this task' });
    }

    // 3. Ensure task is still 'open'
    if (task.status !== 'open') {
      return res.status(400).json({ message: 'Cannot edit a task that is already in progress or completed.' });
    }

    // 4. Update the text fields
    const { title, description, category, urgency, address, latitude, longitude } = req.body;
    
    if (title) task.title = title;
    if (description) task.description = description;
    if (category) task.category = category;
    if (urgency) task.urgency = urgency;
    
    // Update location if provided
    if (address && latitude && longitude) {
      task.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address
      };
    }

    // 5. If they uploaded a NEW image, replace the old one
    if (req.file) {
      const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      task.images = [imageUrl]; 
    }

    // 6. Save and return
    const updatedTask = await task.save();
    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });

  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: 'Server error while updating task' });
  }
});
export default router;