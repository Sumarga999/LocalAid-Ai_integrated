import express from 'express';
import multer from 'multer';
import path from 'path';
import Task from '../models/Task.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

const getUserId = (user) => (user._id || user.userId || user.id).toString();

// 1. CREATE Task
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, urgency, dueDate, latitude, longitude, address } = req.body;
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';
    const currentUserId = getUserId(req.user);

    const newTask = new Task({
      title, description, category, urgency, dueDate,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)], 
        address
      },
      images: imageUrl ? [imageUrl] : [], 
      requester: currentUserId
    });

    const savedTask = await newTask.save();
    res.status(201).json({ message: 'Created', task: savedTask });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. GET All Tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. GET Single Task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('requester', 'name').populate('volunteer', 'name');
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 4. RATE Task
router.put('/:id/rate', authMiddleware, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const currentUserId = getUserId(req.user);
    if (task.requester.toString() !== currentUserId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    task.rating = rating;
    task.review = review;
    await task.save();
    
    const updatedTask = await Task.findById(req.params.id).populate('requester', 'name').populate('volunteer', 'name');
    res.status(200).json(updatedTask); 
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 5. ACCEPT Task
router.put('/:id/accept', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.volunteer) return res.status(400).json({ message: 'Cannot accept' });
    task.volunteer = getUserId(req.user);
    task.status = 'in-progress'; 
    await task.save();

    const updatedTask = await Task.findById(req.params.id).populate('requester', 'name').populate('volunteer', 'name');
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});

// 6. REQUEST COMPLETION
router.put('/:id/request-completion', authMiddleware, async (req, res) => {
  try {
    const { completionNote } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (task.volunteer?.toString() !== getUserId(req.user)) return res.status(403).json({ message: 'Unauthorized' });
    
    task.status = 'pending-completion'; 
    task.completionNote = completionNote; 
    task.rejectionReason = null; 
    
    await task.save();
    
    const updatedTask = await Task.findById(req.params.id).populate('requester', 'name').populate('volunteer', 'name');
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});

// UPDATED: DENY COMPLETION (Resets task to Open)
router.put('/:id/reject', authMiddleware, async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.requester.toString() !== getUserId(req.user)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // RESET LOGIC:
    task.status = 'open';             // Make it available again
    task.volunteer = null;            // Remove the current volunteer
    task.rejectionReason = rejectionReason; 
    task.completionNote = null; 

    await task.save();
    
    const updatedTask = await Task.findById(req.params.id).populate('requester', 'name').populate('volunteer', 'name');
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error denying completion' });
  }
});

// 7. CANCEL HELP
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task.volunteer?.toString() !== getUserId(req.user)) return res.status(403).json({ message: 'Unauthorized' });
    
    task.volunteer = null;
    task.status = 'open'; 
    
    await task.save();
    const updatedTask = await Task.findById(req.params.id).populate('requester', 'name').populate('volunteer', 'name');
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});

// 8. GENERAL UPDATE
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, urgency, status } = req.body; 
    
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.requester.toString() !== getUserId(req.user)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (category) task.category = category;
    if (urgency) task.urgency = urgency;

    if (status === 'completed') {
      task.status = 'completed';
      task.completedAt = new Date();
      task.rejectionReason = null; 
    } else if (status) {
      task.status = status;
    }

    if (req.file) {
      const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      task.images = [imageUrl];
    }

    await task.save();
    const updatedTask = await Task.findById(req.params.id).populate('requester', 'name').populate('volunteer', 'name');
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// 9. DELETE Task
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const currentUserId = getUserId(req.user);
    if (task.requester.toString() !== currentUserId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

export default router;