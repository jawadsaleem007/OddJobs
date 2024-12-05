const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'gig_worker', 'admin'], required: true },
  profilePicture: { type: String },
  bio: { type: String },
  skills: [{ type: String }], // For gig workers
  hourlyRate: { type: Number }, // For gig workers
  savedGigs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }], // For clients
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
