const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Role = require('./Role'); // Import Role model

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role', // Reference the Role model
    required: true 
  },
  savedGigs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }],
  bio: String,
  skills: [String],
  lastActive: { 
    type: Date, 
    default: Date.now 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
