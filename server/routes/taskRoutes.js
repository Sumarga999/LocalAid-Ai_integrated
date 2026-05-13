import express from 'express';
import multer from 'multer';
import path from 'path';
import Task from '../models/Task.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// --- AI LOGIC ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const categorizeTaskAI = async (title, description) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `
        Categorize into: ["Grocery Delivery", "Medication Delivery", "Child Day Care", "Animal Day Care", "Plumbing", "Cleaning", "Tutoring", "Other"].
        Urgency: ["Low", "Medium", "High", "Critical"].
        Rules: Water/Toilets = Plumbing + High. Medicine = Critical.
        Return valid JSON ONLY: { "category": "...", "urgency": "..." }
      `
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Title: ${title}\nDesc: ${description}` }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    return JSON.parse(result.response.text());
  } catch (error) {
    return { category: "Other", urgency: "Medium" };
  }
};

// --- FILE UPLOAD ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// --- ROUTES ---

// 1. Create Task
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, dueDate, latitude, longitude, address } = req.body;
    const aiAnalysis = await categorizeTaskAI(title, description);

    const newTask = new Task({
      title,
      description,
      category: aiAnalysis.category,
      urgency: aiAnalysis.urgency,
      dueDate,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0],
        address
      },
      images: req.file ? [`http://localhost:5000/uploads/${req.file.filename}`] : [],
      requester: req.user._id || req.user.userId || req.user.id // Safety first
    });

    await newTask.save();
    res.status(201).json({ message: 'Created successfully', task: newTask });
  } catch (error) {
    console.error("Creation Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 2. Accept Task (FIXING THE 500 ERROR HERE)
router.put('/:id/accept', authMiddleware, async (req, res) => {
  try {
    const volunteerId = req.user._id || req.user.userId || req.user.id;
    
    // Use findByIdAndUpdate to avoid validation issues with other fields
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { 
        volunteer: volunteerId,
        status: 'accepted' 
      },
      { new: true }
    ).populate('requester', 'name email');

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Acceptance Error details:", error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 3. Get All Tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('requester', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. Get Single Task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('requester', 'name email').populate('volunteer', 'name email');
    res.json(task || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;