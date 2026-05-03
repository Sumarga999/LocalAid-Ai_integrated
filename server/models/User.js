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
      unique: true, // Prevents two users from signing up with the same email
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Basic security rule
    },
    role: {
      type: String,
      enum: ['volunteer', 'getHelp', 'admin'], // Restricts roles to exactly these two options from your frontend
      default: 'volunteer',
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
    timestamps: true, // Automatically adds a 'createdAt' and 'updatedAt' date to every user!
  }
);

const User = mongoose.model('User', userSchema);

export default User;