import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  highScore: {
    type: Number,
    default: 0
  },
  maxLevelReached: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

export default mongoose.model('User', userSchema);