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
      enum: ['volunteer', 'getHelp'], // Restricts roles to exactly these two options from your frontend
      default: 'volunteer',
    },
  },
  {
    timestamps: true, // Automatically adds a 'createdAt' and 'updatedAt' date to every user!
  }
);

const User = mongoose.model('User', userSchema);

export default User;