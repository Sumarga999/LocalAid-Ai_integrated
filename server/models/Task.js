import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Medication Delivery', 'Child Day Care', 'Animal Day Care', 'Grocery Delivery', 'Other'],
      required: true,
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    dueDate: {
      type: Date, 
    },
    images: {
      type: [String], 
      default: [],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'], 
        default: 'Point',
      },
      coordinates: {
        type: [Number], // Stored as [longitude, latitude]
        required: true,
      },
      address: {
        type: String, 
      }
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed'],
      default: 'open',
    },
    // --- NEW: Track exactly when it was completed ---
    completedAt: {
      type: Date,
      default: null,
    },
    rating: { 
    type: Number, 
    min: 1, 
    max: 5 
  }
  },
  {
    timestamps: true, // Automatically handles exactly when it was posted
  }
);

// Allows us to calculate exactly how far away a task is!
taskSchema.index({ location: '2dsphere' });

const Task = mongoose.model('Task', taskSchema);

export default Task;