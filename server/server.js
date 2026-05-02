import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
  })
  .catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error.message);
  });

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'LocalAid Backend is up and running! 🚀' });
});

// Define the port 
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});