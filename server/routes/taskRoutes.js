import express from 'express';
import Task from '../models/Task.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Route: POST /api/tasks
// Purpose: Create a new help request
// Access: Private (Requires login)
router.post('/', authMiddleware, async (req, res) => {
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

    // Create the new task using the data from React
    const newTask = new Task({
      title,
      description,
      category,
      urgency,
      dueDate,
      // Format the location exactly how MongoDB expects it (GeoJSON)
      location: {
        type: 'Point',
        coordinates: [longitude, latitude], // Longitude MUST come first in MongoDB!
        address
      },
      // We get the requester's ID directly from the verified token
      requester: req.user.userId 
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