import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['volunteer', 'getHelp', 'admin'],
      default: 'volunteer',
    },
    // --- ADDED FEATURE: Status for Admin Approval ---
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: function() {
        return this.role === 'volunteer' ? 'pending' : 'approved';
      }
    },
    ratings: [
    {
      rating: { type: Number, required: true, min: 1, max: 5 },
      reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
    }
  ],
  averageRating: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;