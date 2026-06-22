import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  avatarUrl: { type: String },
  role: { type: String, default: 'user' }, 
  highScore: { type: Number, default: 0 },
  maxLevelReached: { type: Number, default: 1 }
}, {
  timestamps: true 
});

export default mongoose.model('User', userSchema);