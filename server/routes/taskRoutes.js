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

    // Grab the uploaded file path if the user included an image
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

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
      image: imagePath, // Save the image path to the database!
      requester: req.user.userId // Kept your exact token structure
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

export default router;