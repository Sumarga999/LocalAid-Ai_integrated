import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    default: 'normal'
  },
  dueDate: {
    type: Date
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    address: {
      type: String
    }
  },
  images: [{
    type: String
  }],
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Make sure this matches your User model name exactly
    required: true
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'pending-completion', 'completed'],
    default: 'open'
  },
  completedAt: {
    type: Date,
    default: null
  },
  // --- NEW FEEDBACK FIELDS ---
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  review: {
    type: String,
    default: null
  }
}, { 
  timestamps: true // Automatically manages createdAt and updatedAt
});

// Optional: Creates a geospatial index if you ever want to search tasks by proximity
taskSchema.index({ location: '2dsphere' });

export default mongoose.model('Task', taskSchema);