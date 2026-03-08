const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    subscription: { type: String, enum: ['free', 'premium'], default: 'free' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
